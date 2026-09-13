import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DocumentTypeService } from '@services';
import {
  DocumentType,
  DocumentTypeID,
  NewDocumentType,
  Text,
  UniqueName,
} from '@app/document-type/types/models';
import { Attribute } from '@app/attribute/types/models';
import { BaseButtonDirective } from '@directives/base-button/base-button';
import { TextInput } from '@components/form/text-input/text-input';
import { CardContainer } from '@components/containers/card-container/card-container';
import { SelectInput } from '@components/form/select-input/select-input';
import { FeedbackService } from 'services/feedback';
import { AttributeType, AttributeTypeMetadata } from '@app/attribute/types/enums';

@Component({
  selector: 'sh-document-type-form-page',
  imports: [
    BaseButtonDirective,
    CardContainer,
    TextInput,
    SelectInput,
    ReactiveFormsModule,
],
  templateUrl: './form.html',
  styleUrl: './form.scss',
})
export class DocumentTypeFormPage implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly documentTypes = inject(DocumentTypeService);
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly feedback = inject(FeedbackService);

  protected readonly form: DocumentTypeFormGroup;
  protected readonly attributeTypes = AttributeTypeMetadata.getKeys();

  protected id: DocumentTypeID | null = null;
  protected pageTitle = '';
  protected submitButtonLabel = '';
  protected isEdit = false;

  protected get attributes(): FormArray {
    if (!this.form) {
      throw new Error('Form is not initialized.');
    }

    return this.form.attributes;
  }

  protected getAttributeLabel(key: AttributeType): string {
    return AttributeTypeMetadata.getLabelByKey(key);
  }

  protected getAttributeValue(key: AttributeType): string {
    return key;
  }

  constructor() {
    const id = this.activeRoute.snapshot.paramMap.get('id') as DocumentTypeID | null;

    this.isEdit = Boolean(id);
    this.form = (this.isEdit)
      ? new UpdateDocumentTypeFormGroup()
      : new CreateDocumentTypeFormGroup();
    this.id = id;
  }

  ngOnInit(): void {
    if (this.id) {
      this.documentTypes
        .getById(this.id)
        .subscribe({
          next: (documentType) => {
            this.form!.documentType = documentType;
          },
          error: () => {
            this.feedback.showErrorMessage('Unable to load document type data. Please try again.');
          },
        });
    }
  }

  ngOnDestroy(): void {
    // Perform any necessary cleanup here
  }

  protected addAttribute(initialValue?: Attribute): void {
    this.form.addAttribute(initialValue);
  }

  protected removeAttribute(index: number): void {
    this.form.removeAttribute(index);
  }

  protected submit(): void {
    if (!this.form) {
      throw new Error('Form is not initialized.');
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isEdit) {
      this.update();
    } else {
      this.create();
    }
  }

  protected cancel(): void {
    this.router.navigate(['/app/document-types']);
  }

  private create() {
    if (!this.form) {
      throw new Error('Form is not initialized.');
    }

    const documentType: NewDocumentType = {
      name: this.form.get('name')?.value as UniqueName,
      description: this.form.get('description')?.value as Text,
      attributes: this.form.get('attributes')?.value as Attribute[],
    };

    this.documentTypes
      .create(documentType)
      .subscribe({
        next: () => {
          this.router.navigate(['/app/document-types']);
        },
        error: () => {
          this.feedback.showErrorMessage('Unable to create document type. Please try again.');
        },
      });
  }

  private update() {
    if (!this.form) {
      throw new Error('Form is not initialized.');
    }

    const documentType: DocumentType = {
      id: this.id!,
      name: this.form.get('name')?.value as UniqueName,
      description: this.form.get('description')?.value as Text,
      attributes: this.form.get('attributes')?.value as Attribute[],
    };

    this.documentTypes
      .update(this.id!, documentType)
      .subscribe({
        next: () => {
          this.router.navigate(['/app/document-types']);
        },
        error: () => {
          this.feedback.showErrorMessage('Unable to update document type. Please try again.');
        },
      });
  }
}

abstract class DocumentTypeFormGroup extends FormGroup {
  abstract get pageTitle(): string;
  abstract get submitButtonLabel(): string;

  constructor(initialValue?: DocumentType) {
    super({
      name: new FormControl(initialValue?.name ?? '', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      description: new FormControl(initialValue?.description ?? '', {
        nonNullable: false,
      }),
      attributes: new FormArray<AttributeFormGroup>(
        (initialValue?.attributes ?? []).map(attr => new AttributeFormGroup(attr))
      ),
    });
  }

  set documentType(value: DocumentType) {
    this.patchValue({
      name: value.name,
      description: value.description,
    });

    value.attributes.forEach(attr => {
      this.addAttribute(attr);
    });
  }

  get name(): FormControl<string> {
    return this.get('name') as FormControl<string>;
  }

  get description(): FormControl<string> {
    return this.get('description') as FormControl<string>;
  }

  get attributes(): FormArray<AttributeFormGroup> {
    return this.get('attributes') as FormArray<AttributeFormGroup>;
  }

  public addAttribute(attribute?: Attribute): void {
    this.attributes.push(new AttributeFormGroup(attribute));
  }

  public removeAttribute(index: number): void {
    this.attributes.removeAt(index);
  }
}

class CreateDocumentTypeFormGroup extends DocumentTypeFormGroup {
  get pageTitle(): string {
    return 'Register Document Type';
  }

  get submitButtonLabel(): string {
    return 'Register';
  }
}

class UpdateDocumentTypeFormGroup extends DocumentTypeFormGroup {
  get pageTitle(): string {
    return 'Edit Document Type';
  }

  get submitButtonLabel(): string {
    return 'Update';
  }
}

class AttributeFormGroup extends FormGroup {
  constructor(initialValue?: Attribute) {
    super({
      key: new FormControl(initialValue?.key ?? '', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      label: new FormControl(initialValue?.label ?? '', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      type: new FormControl(initialValue?.type ?? '', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      description: new FormControl(initialValue?.description ?? '', {
        nonNullable: false,
      }),
    });
  }

  get key(): FormControl<string> {
    return this.get('key') as FormControl<string>;
  }

  get label(): FormControl<string> {
    return this.get('label') as FormControl<string>;
  }

  get type(): FormControl<string> {
    return this.get('type') as FormControl<string>;
  }

  get description(): FormControl<string> {
    return this.get('description') as FormControl<string>;
  }
}

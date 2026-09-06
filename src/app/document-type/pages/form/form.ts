import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AttributeService, DocumentTypeService } from '@services';
import {
  DocumentType,
  DocumentTypeID,
  NewDocumentType,
  Text,
  UniqueName,
} from '@app/document-type/types/models';
import { BaseButtonDirective } from '@directives/base-button/base-button';
import { TextInput } from '@components/form/text-input/text-input';
import { CheckboxInput } from '@components/form/checkbox-input/checkbox-input';
import { CardContainer } from '@components/containers/card-container/card-container';
import { Attribute } from '@app/attribute/types/models';

@Component({
  selector: 'sh-document-type-form-page',
  imports: [
    AsyncPipe,
    BaseButtonDirective,
    CardContainer,
    TextInput,
    CheckboxInput,
    ReactiveFormsModule,
  ],
  templateUrl: './form.html',
  styleUrl: './form.scss',
})
export class DocumentTypeFormPage implements OnInit {
  private readonly router = inject(Router);
  private readonly attributes = inject(AttributeService);
  private readonly documentTypes = inject(DocumentTypeService);
  private readonly activeRoute = inject(ActivatedRoute);

  protected $attributes = this.attributes.getAll();
  protected getAttributeLabel = (attribute: Attribute): string => attribute.label;
  protected getAttributeKey = (attribute: Attribute): string => attribute.key;
  protected id: DocumentTypeID | null = null;
  protected pageTitle = '';
  protected submitButtonLabel = '';
  protected isEdit = false;

  protected readonly documentTypeForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    attributes: new FormControl<Attribute[]>([], {
      nonNullable: false,
    }),
  });

  ngOnInit(): void {
    this.id = this.activeRoute.snapshot.paramMap.get('id') as DocumentTypeID | null;
    this.isEdit = Boolean(this.id);
    this.setTitle(this.isEdit);
    this.setSubmitButtonLabel(this.isEdit);

    if (this.id) {
      this.documentTypes.getById(this.id).subscribe({
        next: (documentType) => {
          this.documentTypeForm.patchValue({
            name: documentType.name,
            description: documentType.description,
            attributes: documentType.attributes,
          });
        },
        error: (err) => {
          console.error('Failed to fetch document type data:', err);
        },
      });
    }
  }

  protected submit(): void {
    if (this.documentTypeForm.invalid) {
      this.documentTypeForm.markAllAsTouched();
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
    const documentType: NewDocumentType = {
      name: this.documentTypeForm.get('name')?.value as UniqueName,
      description: this.documentTypeForm.get('description')?.value as Text,
      attributes: this.documentTypeForm.controls.attributes.value || [],
    };

    this.documentTypes
      .create(documentType)
      .subscribe({
        next: () => {
          this.router.navigate(['/app/document-types']);
        },
        error: (err) => {
          console.error(`Document type creation failed:`, err);
        },
      });
  }

  private update() {
    const documentType: DocumentType = {
      id: this.id!,
      name: this.documentTypeForm.get('name')?.value as UniqueName,
      description: this.documentTypeForm.get('description')?.value as Text,
      attributes: this.documentTypeForm.controls.attributes.value || [],
    };

    this.documentTypes
      .update(this.id!, documentType)
      .subscribe({
        next: () => {
          this.router.navigate(['/app/document-types']);
        },
        error: (err) => {
          console.error(`Document type update failed:`, err);
        },
      });
  }

  private setTitle(isEdit: boolean): void {
    this.pageTitle = isEdit ? 'Edit Document Type' : 'Register Document Type';
  }

  private setSubmitButtonLabel(isEdit: boolean): void {
    this.submitButtonLabel = isEdit ? 'Update' : 'Register';
  }
}

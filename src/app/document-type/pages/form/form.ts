import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { DocumentTypeService } from '@services/document-type';
import { NewDocumentType, Text, UniqueName } from '@app/document-type/types/models';
import { BaseButtonDirective } from '@directives/base-button/base-button';
import { TextInput } from '@components/form/text-input/text-input';
import { CheckboxInput } from '@components/form/checkbox-input/checkbox-input';
import { CardContainer } from '@components/containers/card-container/card-container';
import { AttributeService } from '@services/attribute';
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
export class DocumentTypeFormPage {
  private readonly router = inject(Router);
  private readonly attributes = inject(AttributeService);
  private readonly documentTypes = inject(DocumentTypeService);

  protected $attributes = this.attributes.getAll();
  protected getAttributeLabel = (attribute: Attribute): string => attribute.label;
  protected getAttributeKey = (attribute: Attribute): string => attribute.key;

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
      nonNullable: true,
    }),
  });

  protected submit(): void {
    if (this.documentTypeForm.invalid) {
      this.documentTypeForm.markAllAsTouched();
      return;
    }

    const newDocumentType: NewDocumentType = {
      name: this.documentTypeForm.get('name')?.value as UniqueName,
      description: this.documentTypeForm.get('description')?.value as Text,
      attributes: this.documentTypeForm.get('attributes')?.value || [],
    };

    this.documentTypes
      .create(newDocumentType)
      .subscribe({
        next: () => {
          this.router.navigate(['/types']);
        },
        error: (err) => {
          console.error('Document type creation failed:', err);
        },
      });
  }
}

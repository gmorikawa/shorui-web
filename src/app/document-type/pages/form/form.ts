import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { DocumentTypeService } from '@services/document-type';
import { NewDocumentType, Text, UniqueName } from '@app/document-type/types/models';
import { BaseButtonDirective } from '@directives/base-button/base-button';
import { TextInput } from '@components/form/text-input/text-input';
import { CardContainer } from '@components/containers/card-container/card-container';

@Component({
  selector: 'sh-document-type-form-page',
  imports: [
    BaseButtonDirective,
    CardContainer,
    TextInput,
    ReactiveFormsModule,
  ],
  templateUrl: './form.html',
  styleUrl: './form.scss',
})
export class DocumentTypeFormPage {
  private readonly router = inject(Router);
  private readonly documentType = inject(DocumentTypeService);

  protected readonly documentTypeForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
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
    };

    this.documentType
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

import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import type { DocumentType } from '@app/document-type/types/models';
import { Router } from '@angular/router';

import { DocumentService } from '@services/document';
import { NewDocument, Title } from '@app/document/types/models';
import { BaseButtonDirective } from '@directives/base-button/base-button';
import { TextInput } from '@components/form/text-input/text-input';
import { CardContainer } from '@components/containers/card-container/card-container';
import { DocumentTypeService } from '@services/document-type';
import { SelectInput } from '@components/form/select-input/select-input';

@Component({
  selector: 'sh-document-form-page',
  imports: [
    BaseButtonDirective,
    CardContainer,
    TextInput,
    ReactiveFormsModule,
    SelectInput,
  ],
  templateUrl: './form.html',
  styleUrl: './form.scss',
})
export class DocumentFormPage implements OnInit {
  private readonly router = inject(Router);
  private readonly document = inject(DocumentService);
  private readonly documentTypeService = inject(DocumentTypeService);

  protected documentTypes = signal<DocumentType[]>([]);

  protected readonly getLabel = (type: DocumentType): string => type.name;
  protected readonly getValue = (type: DocumentType): string => type.id;

  protected readonly documentForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    type: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  public ngOnInit(): void {
    this.documentTypeService
      .getAll()
      .subscribe((documentTypes) => {
        this.documentTypes.set(documentTypes);
      });
  }

  protected submit(): void {
    if (this.documentForm.invalid) {
      this.documentForm.markAllAsTouched();
      return;
    }

    const newDocument: NewDocument = {
      title: this.documentForm.get('title')?.value as Title,
      type: null as any
    };

    this.document
      .create(newDocument)
      .subscribe({
        next: () => {
          this.router.navigate(['/documents']);
        },
        error: (err) => {
          console.error('Document creation failed:', err);
        },
      });
  }
}

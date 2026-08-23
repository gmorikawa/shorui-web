import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import type { DocumentType, DocumentTypeID } from '@app/document-type/types/models';
import { Router } from '@angular/router';

import { DocumentService } from '@services/document';
import { NewDocument, Title } from '@app/document/types/models';
import { BaseButtonDirective } from '@directives/base-button/base-button';
import { TextInput } from '@components/form/text-input/text-input';
import { CardContainer } from '@components/containers/card-container/card-container';
import { DocumentTypeService } from '@services/document-type';
import { SelectInput } from '@components/form/select-input/select-input';
import { FileService } from '@services/file';
import { Binary } from '@app/file/types/override';
import { FileInput } from '@components/form/file-input/file-input';

@Component({
  selector: 'sh-document-form-page',
  imports: [
    BaseButtonDirective,
    CardContainer,
    TextInput,
    ReactiveFormsModule,
    SelectInput,
    FileInput,
  ],
  templateUrl: './form.html',
  styleUrl: './form.scss',
})
export class DocumentFormPage implements OnInit {
  private readonly router = inject(Router);
  private readonly document = inject(DocumentService);
  private readonly documentTypeService = inject(DocumentTypeService);
  private readonly fileService = inject(FileService);

  protected documentTypes = signal<DocumentType[]>([]);

  protected readonly getLabel = (type: DocumentType): string => type.name;
  protected readonly getValue = (type: DocumentType): string => type.id;
  private readonly getDocumentTypeById = (id: DocumentTypeID): DocumentType => {
    return this.documentTypes().find((type) => type.id === id)!;
  };

  protected readonly documentForm = new FormGroup({
    title: new FormControl<Title>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    type: new FormControl<DocumentTypeID>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    file: new FormControl<Binary | null>(null, {
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

    const binary = this.documentForm.get('file')?.value as Binary;

    this.fileService
      .upload(binary)
      .subscribe({
        next: (file) => {
          console.log('File uploaded successfully:', file);
  
          const newDocument: NewDocument = {
            title: this.documentForm.get('title')?.value as Title,
            type: this.getDocumentTypeById(this.documentForm.get('type')?.value as DocumentTypeID),
            file: file,
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
        },
        error: (err) => {
          console.error('File upload failed:', err);
        },
      });
  }
}

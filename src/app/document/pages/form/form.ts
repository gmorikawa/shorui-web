import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormRecord, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import type { Attribute } from '@app/attribute/types/models';
import type { DocumentType, DocumentTypeID } from '@app/document-type/types/models';
import { DocumentAttributes, NewDocument, Title } from '@app/document/types/models';
import { Binary } from '@app/file/types/override';
import { DocumentViewer } from '@app/document/components/document-viewer/document-viewer';
import { DocumentService } from '@services/document';
import { FileService } from '@services/file';
import { BaseButtonDirective } from '@directives/base-button/base-button';
import { TextInput } from '@components/form/text-input/text-input';
import { CardContainer } from '@components/containers/card-container/card-container';
import { DocumentTypeService } from '@services/document-type';
import { SelectInput } from '@components/form/select-input/select-input';
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
    DocumentViewer,
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
  protected selectedAttributes = signal<Attribute[]>([]);

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
    attributes: new FormRecord<FormControl<string>>({}),
  });

  public ngOnInit(): void {
    this.documentTypeService
      .getAll()
      .subscribe((documentTypes) => {
        this.documentTypes.set(documentTypes);
      });

    this.documentForm.controls.type.valueChanges.subscribe((typeId) => {
      const documentType = this.documentTypes().find((type) => type.id === typeId);
      this.updateAttributeControls(documentType);
    });
  }

  private updateAttributeControls(documentType: DocumentType | undefined): void {
    const attributesGroup = this.documentForm.controls.attributes;

    Object
      .keys(attributesGroup.controls)
      .forEach((key) => attributesGroup.removeControl(key));

    const attributes = documentType?.attributes ?? [];
    attributes.forEach((attribute) => {
      attributesGroup.addControl(attribute.key, new FormControl('', { nonNullable: true }));
    });

    this.selectedAttributes.set(attributes);
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

          const attributes = this.documentForm.get('attributes')?.value as DocumentAttributes;

          const newDocument: NewDocument = {
            title: this.documentForm.get('title')?.value as Title,
            type: this.getDocumentTypeById(this.documentForm.get('type')?.value as DocumentTypeID),
            file: file,
            ...(Object.keys(attributes).length > 0 ? { attributes } : {}),
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

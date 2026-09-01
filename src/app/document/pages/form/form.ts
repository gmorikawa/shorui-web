import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormRecord, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import type { Attribute } from '@app/attribute/types/models';
import type { DocumentType, DocumentTypeID } from '@app/document-type/types/models';
import { DocumentAttributes, NewDocument, Text, Title } from '@app/document/types/models';
import { Binary } from '@app/file/types/override';
import { DocumentViewer } from '@app/document/components/document-viewer/document-viewer';
import { DocumentService, FileService, FolderService } from '@services';
import { BaseButtonDirective } from '@directives/base-button/base-button';
import { TextInput } from '@components/form/text-input/text-input';
import { CardContainer } from '@components/containers/card-container/card-container';
import { DocumentTypeService } from '@services';
import { SelectInput } from '@components/form/select-input/select-input';
import { FileInput } from '@components/form/file-input/file-input';
import type { Folder, FolderID } from '@app/folder/types/model';

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
  private readonly route = inject(ActivatedRoute);
  private readonly document = inject(DocumentService);
  private readonly documentTypeService = inject(DocumentTypeService);
  private readonly fileService = inject(FileService);
  private readonly folderService = inject(FolderService);

  protected documentTypes = signal<DocumentType[]>([]);
  protected selectedAttributes = signal<Attribute[]>([]);
  private folder: Folder | null = null;

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
    description: new FormControl<Text>('', {
      nonNullable: false,
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
    const folderId = this.route.snapshot.queryParamMap.get('folder') as FolderID | null;
    if (folderId) {
      this.folderService.getById(folderId).subscribe({
        next: (folder) => {
          this.folder = folder;
        },
        error: (err) => {
          console.error('Folder retrieval failed:', err);
        },
      });
    }

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
    if (this.documentForm.invalid || !this.folder) {
      this.documentForm.markAllAsTouched();
      return;
    }

    const binary = this.documentForm.get('file')?.value as Binary;

    this.fileService
      .upload(binary)
      .subscribe({
        next: (file) => {
          const attributes = this.documentForm.get('attributes')?.value as DocumentAttributes;

          const newDocument: NewDocument = {
            title: this.documentForm.get('title')?.value as Title,
            description: this.documentForm.get('description')?.value as Text,
            type: this.getDocumentTypeById(this.documentForm.get('type')?.value as DocumentTypeID),
            ...(Object.keys(attributes).length > 0 ? { attributes } : {}),
          };

          this.document
            .create(newDocument, this.folder!, file)
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

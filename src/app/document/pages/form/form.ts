import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormRecord,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';

import type { Attribute } from '@app/attribute/types/models';
import type { DocumentType, DocumentTypeID } from '@app/document-type/types/models';
import {
  Document,
  DocumentAttributes,
  DocumentID,
  EditDocument,
  NewDocument,
  Text,
  Title,
} from '@app/document/types/models';
import { Binary } from '@app/file/types/override';
import { DocumentViewer } from '@app/document/components/document-viewer/document-viewer';
import { DocumentService, FileService, FolderService } from '@services';
import { BaseButtonDirective } from '@directives/base-button/base-button';
import { TextInput } from '@components/form/text-input/text-input';
import { CardContainer } from '@components/containers/card-container/card-container';
import { DocumentTypeService } from '@services';
import { SelectInput } from '@components/form/select-input/select-input';
import { FileInput } from '@components/form/file-input/file-input';
import type { Folder, FolderID } from '@app/folder/types/models';
import type { File } from '@app/file/types/models';
import { FeedbackService } from 'services/feedback';

type DocumentForm = FormGroup<{
  title: FormControl<Title>;
  description: FormControl<Text | null>;
  type: FormControl<DocumentTypeID>;
  file: FormControl<Binary | null>;
  attributes: FormRecord<FormControl<string>>;
}>;

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
  private readonly documents = inject(DocumentService);
  private readonly documentTypeService = inject(DocumentTypeService);
  private readonly fileService = inject(FileService);
  private readonly folderService = inject(FolderService);
  private readonly feedback = inject(FeedbackService);
  private folder: Folder | null = null;
  private temporaryFile: File | null = null;

  protected documentTypes = signal<DocumentType[]>([]);
  protected selectedAttributes = signal<Attribute[]>([]);
  protected id: DocumentID | null = null;
  protected pageTitle = '';
  protected submitButtonLabel = '';
  protected isEdit = false;

  protected readonly getLabel = (type: DocumentType): string => type.name;
  protected readonly getValue = (type: DocumentType): string => type.id;
  private readonly getDocumentTypeById = (id: DocumentTypeID): DocumentType => {
    return this.documentTypes().find((type) => type.id === id)!;
  };

  protected documentForm!: DocumentForm;

  public ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') as DocumentID | null;
    const folderId = this.route.snapshot.queryParamMap.get('folder') as FolderID | null;

    this.isEdit = Boolean(this.id);
    this.documentForm = this.buildForm(this.isEdit);
    this.setTitle(this.isEdit);
    this.setSubmitButtonLabel(this.isEdit);

    forkJoin({
      folder: folderId ? this.folderService.getById(folderId) : of(null),
      documentTypes: this.documentTypeService.getAll(),
      document: this.id ? this.documents.getById(this.id) : of(null),
    }).subscribe({
      next: ({ folder, documentTypes, document }) => {
        this.folder = folder;
        this.documentTypes.set(documentTypes);

        if (document) {
          this.populateForm(document);
        }
      },
      error: () => {
        this.feedback.showErrorMessage('Unable to load document form data. Please try again.');
      },
    });

    this.documentForm.get('type')!.valueChanges
      .subscribe((typeId) => {
        const documentType = this.documentTypes().find((type) => type.id === typeId);
        this.addAttributeControls(documentType);
      });
  }

  protected submit(): void {
    if (this.documentForm.invalid) {
      this.documentForm.markAllAsTouched();
      return;
    }

    if (this.isEdit) {
      this.update();
    } else {
      this.create();
    }
  }

  protected cancel(): void {
    this.router.navigate(['/app/documents']);
  }

  private create(): void {
    if (!this.folder) {
      this.feedback.showErrorMessage('Select a destination folder before registering the document.');
      return;
    }

    const binary = this.documentForm.get('file')!.value as Binary;

    this.fileService
      .upload(binary)
      .subscribe({
        next: (file) => {
          const newDocument: NewDocument = {
            title: this.documentForm.get('title')!.value as Title,
            description: this.documentForm.get('description')!.value as Text,
            type: this.getDocumentTypeById(this.documentForm.get('type')!.value as DocumentTypeID),
            attributes: this.documentForm.get('attributes')!.value as DocumentAttributes,
            file: file,
            folder: this.folder!,
          };

          this.documents
            .create(newDocument)
            .subscribe({
              next: () => {
                this.router.navigate(['/app/documents']);
              },
              error: () => {
                this.feedback.showErrorMessage('Unable to create document. Please try again.');
              },
            });
        },
        error: () => {
          this.feedback.showErrorMessage('Unable to upload file. Please try again.');
        },
      });
  }

  private update(): void {
    const binary = this.documentForm.get('file')!.value as Binary | null;

    const updateDocument = (file?: File) => {
      const editedDocument: EditDocument = {
        title: this.documentForm.get('title')!.value as Title,
        description: this.documentForm.get('description')!.value as Text,
        type: this.getDocumentTypeById(this.documentForm.get('type')!.value as DocumentTypeID),
        attributes: this.documentForm.get('attributes')!.value as DocumentAttributes,
        file: file ?? this.temporaryFile!,
        folder: this.folder!,
      };

      this.documents
        .update(this.id!, editedDocument)
        .subscribe({
          next: () => {
            this.router.navigate(['/app/documents']);
          },
          error: () => {
            this.feedback.showErrorMessage('Unable to update document. Please try again.');
          },
        });
    };

    if (binary) {
      this.fileService
        .upload(binary)
        .subscribe({
          next: updateDocument,
          error: () => {
            this.feedback.showErrorMessage('Unable to upload file. Please try again.');
          },
        });
    } else {
      updateDocument();
    }
  }

  private populateForm(document: Document): void {
    const documentType = this.getDocumentTypeById(document.type.id);

    this.temporaryFile = document.file ?? null;

    this.documentForm.patchValue(
      {
        title: document.title,
        description: document.description ?? '',
        type: document.type.id,
        attributes: document.attributes ?? {},
      },
      { emitEvent: false },
    );

    this.addAttributeControls(documentType, document);
    this.documentForm.get('attributes')!.patchValue(document.attributes ?? {});
  }

  private setTitle(isEdit: boolean): void {
    this.pageTitle = isEdit ? 'Edit Document' : 'Register Document';
  }

  private setSubmitButtonLabel(isEdit: boolean): void {
    this.submitButtonLabel = isEdit ? 'Update' : 'Register';
  }

  private buildForm(isEdit: boolean): DocumentForm {
    const form = new FormGroup({
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
        validators: isEdit ? [] : [Validators.required],
      }),
      attributes: new FormRecord<FormControl<string>>({}),
    });

    return form;
  }

  private addAttributeControls(documentType?: DocumentType, initial?: Document): void {
    const attributesGroup = this.documentForm.controls.attributes;

    Object.keys(attributesGroup.controls).forEach((key) => attributesGroup.removeControl(key));

    const attributes = documentType?.attributes ?? [];
    attributes.forEach((attribute) => {
      attributesGroup.addControl(
        attribute.key,
        new FormControl(initial?.attributes?.[attribute.key] ?? '', { nonNullable: true })
      );
    });

    this.selectedAttributes.set(attributes);
  }
}

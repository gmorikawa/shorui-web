import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { AuthService, DocumentService, FolderService, UserService } from '@services';
import { Folder, NewFolder } from '@app/folder/types/models';
import { Document } from '@app/document/types/models';
import { DocumentCard } from '@app/document/components/document-card/document-card';
import { Stack } from '@components/stack/stack';
import { BaseButtonDirective } from '@directives/base-button/base-button';
import { FolderNewCard } from '@app/folder/components/folder-new-card/folder-new-card';
import { FolderCard } from '@app/folder/components/folder-card/folder-card';
import {
  BreadcrumbItem,
  BreadcrumbNavigator,
} from '@components/navigation/breadcrumb-navigator/breadcrumb-navigator';
import { stackSignal } from '@app/shared/utils/stack-signal';
import { FeedbackService } from 'services/feedback';

@Component({
  selector: 'sh-document-list-page',
  imports: [
    Stack,
    DocumentCard,
    FolderCard,
    FolderNewCard,
    BreadcrumbNavigator,
    BaseButtonDirective,
  ],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class DocumentListPage implements OnInit {
  private readonly document = inject(DocumentService);
  private readonly folder = inject(FolderService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly feedback = inject(FeedbackService);

  protected folders = signal<Folder[]>([]);
  protected folderStack = stackSignal<Folder>([]);
  protected documents = signal<Document[]>([]);
  protected currentFolder = signal<Folder | null>(null);

  protected temporaryNewFolder = signal<NewFolder | null>(null);
  protected breadcrumbItems = signal<BreadcrumbItem[]>([]);

  public ngOnInit(): void {
    this.auth.getLoggedUser().subscribe({
      next: (user) => {
        this.loadFolder(user.folder);
        this.folderStack.push(user.folder);
      },
      error: () => {
        this.feedback.showErrorMessage('Unable to load documents. Please try again.');
      },
    });

    this.breadcrumbItems.set([{ label: 'home', url: '/app/documents' }]);
  }

  protected openFolder(folder: Folder): void {
    this.loadFolder(folder);
  }

  private loadFolder(folder: Folder): void {
    this.currentFolder.set(folder);

    forkJoin({
      folders: this.folder.getByParent(folder),
      documents: this.document.getByFolder(folder),
    }).subscribe({
      next: ({ folders, documents }) => {
        this.folders.set(folders);
        this.documents.set(documents);
      },
      error: () => {
        this.feedback.showErrorMessage('Unable to load folder contents. Please try again.');
      },
    });
  }

  protected navigateToForm(): void {
    this.folder.saveInCache(this.currentFolder()!);
    this.router.navigate(['/app/documents/register'], {
      queryParams: { folder: this.currentFolder()?.id },
    });
  }

  protected edit = (document: Document): void => {
    this.folder.saveInCache(this.currentFolder()!);
    this.router.navigate(['/app/documents/register', document.id], {
      queryParams: { folder: this.currentFolder()?.id },
    });
  };

  protected download = (document: Document): void => {
    this.document.download(document).subscribe({
      next: (file) => {
        const url = URL.createObjectURL(file);
        const link = window.document.createElement('a');

        link.href = url;
        link.download = document.title;
        link.click();

        URL.revokeObjectURL(url);
      },
      error: () => {
        this.feedback.showErrorMessage('Unable to download document. Please try again.');
      },
    });
  };

  protected delete = (document: Document): void => {
    if (!window.confirm(`Delete "${document.title}"? This cannot be undone.`)) {
      return;
    }

    this.document.delete(document.id).subscribe({
      next: () => {
        this.documents.update((documents) => documents.filter(({ id }) => id !== document.id));
      },
      error: () => {
        this.feedback.showErrorMessage('Unable to delete document. Please try again.');
      },
    });
  };

  protected deleteFolder = (folder: Folder): void => {
    if (!window.confirm(`Delete folder "${folder.name}"? This cannot be undone.`)) {
      return;
    }

    this.folder
      .delete(folder.id)
      .subscribe({
        next: () => {
          this.folder.removeFromCache(folder.id);
          this.folders.update((folders) => folders.filter(({ id }) => id !== folder.id));
        },
        error: () => {
          this.feedback.showErrorMessage('Unable to delete folder. Please try again.');
        },
      });
  };

  protected addNewFolder(): void {
    this.temporaryNewFolder.set({ name: '' });
  }

  protected saveNewFolder = (name: string): void => {
    const newFolder = this.temporaryNewFolder();

    if (newFolder && this.currentFolder()) {
      this.folder.create(name, this.currentFolder()!).subscribe({
        next: () => {
          this.loadFolder(this.currentFolder()!);
          this.temporaryNewFolder.set(null);
        },
        error: () => {
          this.feedback.showErrorMessage('Unable to create folder. Please try again.');
        },
      });
    }
  };

  protected cancelNewFolder = (): void => {
    this.temporaryNewFolder.set(null);
  };

  protected navigateToFolder = (folder: Folder): void => {
    this.folderStack.push(folder);

    this.breadcrumbItems.set([...this.breadcrumbItems(), { label: folder.name }]);
    this.loadFolder(folder);
  };

  protected navigateBack = (): void => {
    this.breadcrumbItems.set(this.breadcrumbItems().slice(0, -1));
    this.folderStack.pop();
    this.loadFolder(this.folderStack.peek()!);
  };
}

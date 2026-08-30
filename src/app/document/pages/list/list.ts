import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { AuthService, DocumentService, FolderService, UserService } from '@services';
import { Folder, NewFolder } from '@app/folder/types/model';
import { Document } from '@app/document/types/models';
import { DocumentCard } from '@app/document/components/document-card/document-card';
import { Stack } from '@components/stack/stack';
import { BaseButtonDirective } from '@directives/base-button/base-button';
import { FolderNewCard } from '@app/folder/components/folder-new-card/folder-new-card';
import { FolderCard } from '@app/folder/components/folder-card/folder-card';
import { BreadcrumbItem, BreadcrumbNavigator } from '@components/navigation/breadcrumb-navigator/breadcrumb-navigator';
import { stackSignal } from '@app/shared/utils/stack-signal';

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

  protected folders = signal<Folder[]>([]);
  protected folderStack = stackSignal<Folder>([]);
  protected documents = signal<Document[]>([]);
  protected currentFolder = signal<Folder | null>(null);

  protected temporaryNewFolder = signal<NewFolder | null>(null);
  protected breadcrumbItems = signal<BreadcrumbItem[]>([]);

  public ngOnInit(): void {
    this.auth.getLoggedUser()
      .subscribe(user => {
        this.loadFolder(user.folder);
        this.folderStack.push(user.folder);
      });
    
    this.breadcrumbItems.set([
      { label: 'home', url: '/' },
    ]);
  }

  protected openFolder(folder: Folder): void {
    this.loadFolder(folder);
  }

  private loadFolder(folder: Folder): void {
    this.currentFolder.set(folder);

    forkJoin({
      folders: this.folder.getByParent(folder),
      documents: this.document.getByFolder(folder),
    }).subscribe(({ folders, documents }) => {
      this.folders.set(folders);
      this.documents.set(documents);
      });
  }

  protected navigateToForm(): void {
    this.router.navigate(['/documents/register']);
  }

  protected addNewFolder(): void {
    this.temporaryNewFolder.set({ name: '' });
  }

  protected saveNewFolder = (name: string): void => {
    const newFolder = this.temporaryNewFolder();

    if (newFolder && this.currentFolder()) {
      this.folder.create(name, this.currentFolder()!)
        .subscribe(() => {
          this.loadFolder(this.currentFolder()!);
          this.temporaryNewFolder.set(null);
        });
    }
  };

  protected cancelNewFolder = (): void => {
    this.temporaryNewFolder.set(null);
  };

  protected navigateToFolder = (folder: Folder): void => {
    this.folderStack.push(folder);

    this.breadcrumbItems.set([
      ...this.breadcrumbItems(),
      { label: folder.name }
    ]);
    this.loadFolder(folder);
  };

  protected navigateBack = (): void => {
    this.breadcrumbItems.set(
      this.breadcrumbItems().slice(0, -1)
    );
    this.folderStack.pop();
    this.loadFolder(this.folderStack.peek()!);
  };
}

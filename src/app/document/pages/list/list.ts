import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

import { DocumentService } from '@services/document';
import { Document } from '@app/document/types/models';
import { DocumentCard } from '@app/document/components/document-card/document-card';
import { Stack } from '@components/stack/stack';
import { BaseButtonDirective } from '@directives/base-button/base-button';

@Component({
  selector: 'sh-document-list-page',
  imports: [
    Stack,
    DocumentCard,
    BaseButtonDirective,
  ],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class DocumentListPage implements OnInit {
  private readonly document = inject(DocumentService);
  private readonly router = inject(Router);

  protected documents = signal<Document[]>([]);

  public ngOnInit(): void {
    this.document
      .getAll()
      .subscribe(documents => {
        this.documents.set(documents);
      });
  }

  protected navigateToForm(): void {
    this.router.navigate(['/documents/register']);
  }
}

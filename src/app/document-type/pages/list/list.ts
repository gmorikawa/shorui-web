import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

import { DocumentTypeService } from '@services';
import { DocumentType } from '@app/document-type/types/models';
import { DocumentTypeCard } from '@app/document-type/components/document-type-card/document-type-card';
import { Stack } from '@components/stack/stack';
import { BaseButtonDirective } from '@directives/base-button/base-button';
import { FeedbackService } from 'services/feedback';

@Component({
  selector: 'sh-document-type-list-page',
  imports: [
    Stack,
    DocumentTypeCard,
    BaseButtonDirective,
  ],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class DocumentTypeListPage implements OnInit {
  private readonly documentType = inject(DocumentTypeService);
  private readonly router = inject(Router);
  private readonly feedback = inject(FeedbackService);

  protected documentTypes = signal<DocumentType[]>([]);

  public ngOnInit(): void {
    this.documentType
      .getAll()
      .subscribe({
        next: (documentTypes) => {
          this.documentTypes.set(documentTypes);
        },
        error: () => {
          this.feedback.showErrorMessage('Unable to load document types. Please try again.');
        },
      });
  }

  protected navigateToForm(documentType?: DocumentType): void {
    if (documentType) {
      this.router.navigate(['/app/document-types/register', documentType.id]);
    } else {
      this.router.navigate(['/app/document-types/register']);
    }
  }
}

import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

import { DocumentTypeService } from '@services';
import { DocumentType } from '@app/document-type/types/models';
import { DocumentTypeCard } from '@app/document-type/components/document-type-card/document-type-card';
import { Stack } from '@components/stack/stack';
import { BaseButtonDirective } from '@directives/base-button/base-button';

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

  protected documentTypes = signal<DocumentType[]>([]);

  public ngOnInit(): void {
    this.documentType
      .getAll()
      .subscribe(documentTypes => {
        this.documentTypes.set(documentTypes);
      });
  }

  protected navigateToForm(): void {
    this.router.navigate(['/types/register']);
  }
}

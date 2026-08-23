import { Component, input } from '@angular/core';
import { DocumentType } from '@app/document-type/types/models';
import { CardContainer } from '@components/containers/card-container/card-container';

@Component({
  selector: 'sh-document-type-card',
  imports: [
    CardContainer,
  ],
  templateUrl: './document-type-card.html',
  styleUrl: './document-type-card.scss',
})
export class DocumentTypeCard {
  public documentType = input<DocumentType | null>(null);
}

import { Component, input } from '@angular/core';
import { Document } from '@app/document/types/models';
import { CardContainer } from '@components/containers/card-container/card-container';

@Component({
  selector: 'sh-document-card',
  imports: [
    CardContainer,
  ],
  templateUrl: './document-card.html',
  styleUrl: './document-card.scss',
})
export class DocumentCard {
  public document = input<Document | null>(null);
}

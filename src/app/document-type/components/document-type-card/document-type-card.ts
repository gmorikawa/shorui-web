import { Component, input } from '@angular/core';
import { DocumentType } from '@app/document-type/types/models';
import { CardContainer } from '@components/containers/card-container/card-container';
import { BaseButtonDirective } from '@directives/base-button/base-button';

type Action = {
  label: string;
  callback: (documentType: DocumentType) => void;
}

@Component({
  selector: 'sh-document-type-card',
  imports: [
    CardContainer,
    BaseButtonDirective,
  ],
  templateUrl: './document-type-card.html',
  styleUrl: './document-type-card.scss',
})
export class DocumentTypeCard {
  public documentType = input<DocumentType | null>(null);
  public actions = input<Action[]>([]);
}

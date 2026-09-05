import { Component, input } from '@angular/core';
import { Document } from '@app/document/types/models';
import { CardContainer } from '@components/containers/card-container/card-container';
import { BaseButtonDirective } from '@directives/base-button/base-button';

type Action = {
  label: string;
  callback: (document: Document) => void;
}

@Component({
  selector: 'sh-document-card',
  imports: [
    CardContainer,
    BaseButtonDirective,
  ],
  templateUrl: './document-card.html',
  styleUrl: './document-card.scss',
})
export class DocumentCard {
  public document = input<Document | null>(null);
  public actions = input<Action[]>([]);
}

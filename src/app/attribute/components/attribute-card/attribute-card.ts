import { Component, input } from '@angular/core';
import { Attribute } from '@app/attribute/types/models';
import { CardContainer } from '@components/containers/card-container/card-container';
import { BaseButtonDirective } from '@directives/base-button/base-button';

type Action = {
  label: string;
  callback: (attribute: Attribute) => void;
}

@Component({
  selector: 'sh-attribute-card',
  imports: [
    BaseButtonDirective,
    CardContainer,
  ],
  templateUrl: './attribute-card.html',
  styleUrl: './attribute-card.scss',
})
export class AttributeCard {
  public attribute = input<Attribute | null>(null);
  public actions = input<Action[]>([]);
}

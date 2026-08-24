import { Component, input } from '@angular/core';
import { Attribute } from '@app/attribute/types/models';
import { CardContainer } from '@components/containers/card-container/card-container';

@Component({
  selector: 'sh-attribute-card',
  imports: [
    CardContainer,
  ],
  templateUrl: './attribute-card.html',
  styleUrl: './attribute-card.scss',
})
export class AttributeCard {
  public attribute = input<Attribute | null>(null);
}

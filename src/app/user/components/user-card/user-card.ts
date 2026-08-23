import { Component, input } from '@angular/core';
import { User } from '@features/user/types';
import { CardContainer } from '@components/containers/card-container/card-container';

@Component({
  selector: 'sh-user-card',
  imports: [
    CardContainer,
  ],
  templateUrl: './user-card.html',
  styleUrl: './user-card.scss',
})
export class UserCard {
  public user = input<User | null>(null);
}

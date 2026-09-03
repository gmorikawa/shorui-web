import { Component, input } from '@angular/core';
import { User } from '@app/user/types/types';
import { CardContainer } from '@components/containers/card-container/card-container';
import { BaseButtonDirective } from '@directives/base-button/base-button';

type Action = {
  label: string;
  callback: (user: User) => void;
}

@Component({
  selector: 'sh-user-card',
  imports: [
    CardContainer,
    BaseButtonDirective,
  ],
  templateUrl: './user-card.html',
  styleUrl: './user-card.scss',
})
export class UserCard {
  public user = input<User | null>(null);
  public actions = input<Action[]>([]);
}

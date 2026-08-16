import { Component, input } from '@angular/core';
import { User } from '@features/user/types';
import { Card } from '@components/card/card';

@Component({
  selector: 'sh-user-card',
  imports: [
    Card,
  ],
  templateUrl: './user-card.html',
  styleUrl: './user-card.scss',
})
export class UserCard {
  public user = input<User | null>(null);
}

import { Component, inject, OnInit, signal } from '@angular/core';
import { MainContainer } from '@components/containers/main-container/main-container';
import { UserService } from '@services/user';
import { User } from '@features/user/types';
import { UserCard } from '@app/user/components/user-card/user-card';
import { Stack } from '@components/stack/stack';

@Component({
  selector: 'sh-user-list-page',
  imports: [
    MainContainer,
    Stack,
    UserCard,
  ],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class UserListPage implements OnInit {
  private readonly user = inject(UserService);

  protected users = signal<User[]>([]);

  public ngOnInit(): void {
    this.user
      .getAll()
      .subscribe(users => {
        this.users.set(users);
      });
  }

}

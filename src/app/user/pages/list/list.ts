import { Component, inject, OnInit, signal } from '@angular/core';
import { TileButton } from '../../../../components/tile-button/tile-button';
import { MainContainer } from '../../../../components/containers/main-container/main-container';
import { UserService } from '../../../../services/user';
import { User } from '../../../../features/user/types';

@Component({
  selector: 'sh-user-list-page',
  imports: [
    MainContainer,
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

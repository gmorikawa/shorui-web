import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '@services/user';
import { User } from '@app/user/types/types';
import { UserCard } from '@app/user/components/user-card/user-card';
import { Stack } from '@components/stack/stack';
import { Router } from '@angular/router';

@Component({
  selector: 'sh-user-list-page',
  imports: [
    Stack,
    UserCard,
  ],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class UserListPage implements OnInit {
  private readonly user = inject(UserService);
  private readonly router = inject(Router);

  protected users = signal<User[]>([]);

  public ngOnInit(): void {
    this.user
      .getAll()
      .subscribe(users => {
        this.users.set(users);
      });
  }

  protected navigateToForm(): void {
    this.router.navigate(['/users/register']);
  }
}

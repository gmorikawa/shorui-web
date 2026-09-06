import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '@services';
import { User } from '@app/user/types/types';
import { UserCard } from '@app/user/components/user-card/user-card';
import { Stack } from '@components/stack/stack';
import { Router } from '@angular/router';
import { FeedbackService } from 'services/feedback';

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
  private readonly feedback = inject(FeedbackService);

  protected users = signal<User[]>([]);

  public ngOnInit(): void {
    this.user
      .getAll()
      .subscribe({
        next: (users) => {
          this.users.set(users);
        },
        error: () => {
          this.feedback.showErrorMessage('Unable to load users. Please try again.');
        },
      });
  }

  protected navigateToForm(user?: User): void {
    if (user) {
      this.router.navigate(['/app/users/form', user.id]);
    } else {
      this.router.navigate(['/app/users/form']);
    }
  }
}

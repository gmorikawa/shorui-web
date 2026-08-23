import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Email, FullName, NewUser, UserRole } from '@app/user/types/types';
import { PlainPassword } from '@app/auth/types/models';
import { BaseButtonDirective } from '@directives/base-button/base-button';
import { PasswordInput } from '@components/form/password-input/password-input';
import { TextInput } from '@components/form/text-input/text-input';
import { EmailInput } from '@components/form/email-input/email-input';
import { CardContainer } from '@components/containers/card-container/card-container';
import { UserService } from '@services/user';

@Component({
  selector: 'sh-user-form-page',
  imports: [
    BaseButtonDirective,
    CardContainer,
    EmailInput,
    PasswordInput,
    TextInput,
    ReactiveFormsModule,
  ],
  templateUrl: './form.html',
  styleUrl: './form.scss',
})
export class UserFormPage {
  private readonly router = inject(Router);
  private readonly user = inject(UserService);

  protected readonly userForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  protected submit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const newUser: NewUser = {
      name: this.userForm.get('name')?.value as FullName,
      email: this.userForm.get('email')?.value as Email,
      password: this.userForm.get('password')?.value as PlainPassword,
      role: UserRole.MEMBER,
    };

    this.user
      .create(newUser)
      .subscribe({
        next: () => {
          this.router.navigate(['/users']);
        },
        error: (err) => {
          console.error('User registration failed:', err);
        },
      });
  }
}

import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthLayout } from '@app/auth/components/auth-layout/auth-layout';
import { AuthService } from '@services/auth';
import { Email, FullName, NewAdmin } from '@features/user/types';
import { PlainPassword } from '@features/auth/types';
import { BaseButtonDirective } from "@directives/base-button/base-button";
import { PasswordInput } from '@components/form/password-input/password-input';
import { TextInput } from '@components/form/text-input/text-input';
import { EmailInput } from '@components/form/email-input/email-input';

@Component({
  selector: 'sh-first-access',
  imports: [
    AuthLayout,
    BaseButtonDirective,
    EmailInput,
    PasswordInput,
    TextInput,
    ReactiveFormsModule
  ],
  templateUrl: './first-access.html',
  styleUrl: './first-access.scss',
})
export class FirstAccessPage {
  private readonly router = inject(Router);
  private readonly auth: AuthService = inject(AuthService);

  protected readonly firstAccessForm = new FormGroup({
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
    if (this.firstAccessForm.invalid) {
      this.firstAccessForm.markAllAsTouched();
      return;
    }

    const newAdmin: NewAdmin = {
      name: this.firstAccessForm.get('name')?.value as FullName,
      email: this.firstAccessForm.get('email')?.value as Email,
      password: this.firstAccessForm.get('password')?.value as PlainPassword,
    };

    this.auth
      .firstAccess(newAdmin)
      .subscribe({
        next: (created) => {
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          console.error('First access failed:', err);
        },
      }
    );
  }
}

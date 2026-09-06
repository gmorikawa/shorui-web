import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

import { AuthService } from "@services";
import { Credentials, PlainPassword } from "@app/auth/types/models";
import { Email } from "@app/user/types/types";
import { BaseButtonDirective } from "@directives/base-button/base-button";
import { PasswordInput } from "@components/form/password-input/password-input";
import { EmailInput } from "@components/form/email-input/email-input";
import { AuthLayout } from "@app/auth/components/auth-layout/auth-layout";
import { SwitchInput } from "@components/form/switch-input/switch-input";
import { FeedbackService } from "services/feedback";

@Component({
  selector: "sh-login",
  imports: [
    AuthLayout,
    BaseButtonDirective,
    PasswordInput,
    EmailInput,
    SwitchInput,
    ReactiveFormsModule
  ],
  templateUrl: "./login.html",
  styleUrl: "./login.scss",
})
export class LoginPage {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly feedback = inject(FeedbackService);

  protected readonly loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    remember: new FormControl(false, { nonNullable: true }),
  });

  protected submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials: Credentials = {
      email: this.loginForm.get('email')?.value as Email,
      password: this.loginForm.get('password')?.value as PlainPassword,
    };

    this.auth
      .login(credentials)
      .subscribe({
        next: ({ token }) => {
          this.router.navigate(['/app/users']);
        },
        error: () => {
          this.feedback.showErrorMessage('Login failed. Please try again.');
        },
      }
    );
  }
}

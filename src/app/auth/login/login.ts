import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

import { AuthService } from "../../../services/auth";
import { Credentials, PlainPassword } from "../../../features/auth";
import { Email } from "../../../features/user";

@Component({
  selector: "sh-login",
  imports: [ReactiveFormsModule],
  templateUrl: "./login.html",
  styleUrl: "./login.scss",
})
export class LoginComponent {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

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
          this.router.navigate(['/menu']);
        },
        error: (err) => {
          console.error('Login failed:', err);
        },
      }
    );
  }
}

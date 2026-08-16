import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth';
import { Email, FullName, NewAdmin } from '../../../features/user/types';
import { PlainPassword } from '../../../features/auth/types';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'sh-first-access',
  imports: [ReactiveFormsModule],
  templateUrl: './first-access.html',
  styleUrl: './first-access.scss',
})
export class FirstAccessComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly auth: AuthService = inject(AuthService);
  private readonly apiUrl: string = environment.apiUrl;

  ngOnInit(): void {
    console.log('FirstAccessComponent initialized', this.apiUrl);
  }

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

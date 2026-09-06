import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { EditUser, Email, FullName, NewUser, UserID, UserRole } from '@app/user/types/types';
import { PlainPassword } from '@app/auth/types/models';
import { BaseButtonDirective } from '@directives/base-button/base-button';
import { PasswordInput } from '@components/form/password-input/password-input';
import { TextInput } from '@components/form/text-input/text-input';
import { EmailInput } from '@components/form/email-input/email-input';
import { CardContainer } from '@components/containers/card-container/card-container';
import { UserService } from '@services';
import { FeedbackService } from 'services/feedback';

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
export class UserFormPage implements OnInit {
  private readonly router = inject(Router);
  private readonly users = inject(UserService);
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly feedback = inject(FeedbackService);
  
  protected id: UserID | null = null;
  protected pageTitle = '';
  protected submitButtonLabel = '';
  protected isEdit = false;
  protected userForm!: FormGroup;

  ngOnInit(): void {
    this.id = this.activeRoute.snapshot.paramMap.get('id') as UserID | null;

    this.isEdit = Boolean(this.id);
    this.userForm = this.buildForm(this.isEdit);
    this.setTitle(this.isEdit);
    this.setSubmitButtonLabel(this.isEdit);

    if (this.id) {
      this.users.getById(this.id).subscribe({
        next: (user) => {
          this.userForm
            .patchValue({
              name: user.name,
              email: user.email,
            });
        },
        error: () => {
          this.feedback.showErrorMessage('Unable to load user data. Please try again.');
        },
      });
    }
  }

  protected submit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    if (this.isEdit) {
      this.update();
    } else {
      this.create();
    }
  }

  protected cancel(): void {
    this.router.navigate(['/app/users']);
  }

  private create() {
    const newUser: NewUser = {
      name: this.userForm.get('name')?.value as FullName,
      email: this.userForm.get('email')?.value as Email,
      password: this.userForm.get('password')?.value as PlainPassword,
      role: UserRole.MEMBER,
    };

    this.users
      .create(newUser)
      .subscribe({
        next: () => {
          this.router.navigate(['/app/users']);
        },
        error: () => {
          this.feedback.showErrorMessage('Unable to create user. Please try again.');
        },
      });
  }

  private update() {
    const editedUser: EditUser = {
      name: this.userForm.get('name')?.value as FullName,
      email: this.userForm.get('email')?.value as Email,
      currentPassword: this.userForm.get('currentPassword')?.value as PlainPassword,
    };

    this.users
      .update(this.id!, editedUser)
      .subscribe({
        next: () => {
          this.router.navigate(['/app/users']);
        },
        error: () => {
          this.feedback.showErrorMessage('Unable to update user. Please try again.');
        },
      });
  }

  private setTitle(isEdit: boolean): void {
    if (isEdit) {
      this.pageTitle = 'Edit User';
    } else {
      this.pageTitle = 'Create User';
    }
  }

  private setSubmitButtonLabel(isEdit: boolean): void {
    if (isEdit) {
      this.submitButtonLabel = 'Update';
    } else {
      this.submitButtonLabel = 'Create';
    }
  }

  private buildForm(isEdit: boolean): FormGroup {
    const form = new FormGroup({});

    form.addControl('name', new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }));

    form.addControl('email', new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }));

    if (isEdit) {
      form.addControl('currentPassword', new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }));
    } else {
      form.addControl('password', new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }));
    }

    return form;
  }
}

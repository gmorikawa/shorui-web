import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AttributeService } from '@services/attribute';
import { AttributeKey, Label, NewAttribute } from '@app/attribute/types/models';
import { BaseButtonDirective } from '@directives/base-button/base-button';
import { TextInput } from '@components/form/text-input/text-input';
import { CardContainer } from '@components/containers/card-container/card-container';

@Component({
  selector: 'sh-attribute-form-page',
  imports: [
    BaseButtonDirective,
    CardContainer,
    TextInput,
    ReactiveFormsModule,
  ],
  templateUrl: './form.html',
  styleUrl: './form.scss',
})
export class AttributeFormPage {
  private readonly router = inject(Router);
  private readonly attribute = inject(AttributeService);

  protected readonly attributeForm = new FormGroup({
    key: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    label: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl('', {
      nonNullable: true,
    }),
  });

  protected submit(): void {
    if (this.attributeForm.invalid) {
      this.attributeForm.markAllAsTouched();
      return;
    }

    const newAttribute: NewAttribute = {
      key: this.attributeForm.get('key')?.value as AttributeKey,
      label: this.attributeForm.get('label')?.value as Label,
      description: this.attributeForm.get('description')?.value || undefined,
    };

    this.attribute
      .create(newAttribute)
      .subscribe({
        next: () => {
          this.router.navigate(['/attributes']);
        },
        error: (err) => {
          console.error('Attribute creation failed:', err);
        },
      });
  }
}

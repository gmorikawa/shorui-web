import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AttributeService } from '@services';
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
export class AttributeFormPage implements OnInit {
  private readonly router = inject(Router);
  private readonly attribute = inject(AttributeService);
  private readonly activeRoute = inject(ActivatedRoute);

  protected key: AttributeKey | null = null;
  protected pageTitle = 'Create Attribute';
  protected submitButtonLabel = 'Create';
  protected isEdit = false;
  protected attributeForm!: FormGroup;

  ngOnInit(): void {
    this.key = this.activeRoute.snapshot.paramMap.get('key');

    this.isEdit = Boolean(this.key);
    this.attributeForm = this.buildForm(this.isEdit);
    this.setTitle(this.isEdit);
    this.setSubmitButtonLabel(this.isEdit);

    if (this.key) {
      this.attribute.getByKey(this.key).subscribe({
        next: (attribute) => {
          this.attributeForm.patchValue(attribute);
        },
        error: (err) => {
          console.error('Failed to fetch attribute data:', err);
        },
      });
    }
  }

  protected submit(): void {
    if (this.attributeForm.invalid) {
      this.attributeForm.markAllAsTouched();
      return;
    }

    const attribute: NewAttribute = {
      key: this.attributeForm.get('key')?.value as AttributeKey,
      label: this.attributeForm.get('label')?.value as Label,
      description: this.attributeForm.get('description')?.value || undefined,
    };

    const request = this.isEdit
      ? this.attribute.update(this.key!, attribute)
      : this.attribute.create(attribute);

    request
      .subscribe({
        next: () => {
          this.router.navigate(['/app/attributes']);
        },
        error: (err) => {
          console.error(`Attribute ${this.isEdit ? 'update' : 'creation'} failed:`, err);
        },
      });
  }

  protected cancel(): void {
    this.router.navigate(['/app/attributes']);
  }

  private setTitle(isEdit: boolean): void {
    if (isEdit) {
      this.pageTitle = 'Edit Attribute';
    } else {
      this.pageTitle = 'Create Attribute';
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

    if (isEdit) {
      form.addControl('key', new FormControl({ value: '', disabled: true }, {
        nonNullable: true,
        validators: [Validators.required],
      }));
    } else {
      form.addControl('key', new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }));
    }

    form.addControl('label', new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }));

    form.addControl('description', new FormControl('', {
      nonNullable: true,
    }));

    return form;
  }
}

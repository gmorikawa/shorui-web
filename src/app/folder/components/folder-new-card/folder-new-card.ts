import { Component, input } from '@angular/core';

import { FolderCardBase } from '../folder-card-base/folder-card-base';

import { NewFolder } from '@app/folder/types/models';
import { TextInput } from '@components/form/text-input/text-input';
import { BaseButtonDirective } from '@directives/base-button/base-button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

type CreateListener = (name: string) => void;
type CancelListener = () => void;

@Component({
  selector: 'folder-new-card',
  imports: [
    ReactiveFormsModule,
    BaseButtonDirective,
    FolderCardBase,
    TextInput
  ],
  templateUrl: './folder-new-card.html',
  styleUrl: './folder-new-card.scss',
})
export class FolderNewCard {
  public folder = input.required<NewFolder>();

  public create = input.required<CreateListener>();

  public cancel = input.required<CancelListener>();

  protected readonly folderForm = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  protected submit = () => {
    console.log('FolderNewCard submit');
    if (this.folderForm.valid) {
      this.create()(this.folderForm.get('name')?.value!);
    } else {
      this.cancel()();
    }
  };
}

import { Component, input, output } from '@angular/core';
import { BaseButtonDirective } from '@directives/base-button/base-button';

import { FolderCardBase } from '../folder-card-base/folder-card-base';

import { Folder } from '@app/folder/types/models';

type Action = {
  label: string;
  callback: (folder: Folder) => void;
}

@Component({
  selector: 'folder-card',
  imports: [
    FolderCardBase,
    BaseButtonDirective,
  ],
  templateUrl: './folder-card.html',
  styleUrl: './folder-card.scss',
})
export class FolderCard {
  readonly folder = input.required<Folder>();
  readonly actions = input<Action[]>([]);

  readonly open = output<MouseEvent>();
}

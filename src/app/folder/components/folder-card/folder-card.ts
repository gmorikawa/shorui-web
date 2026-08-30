import { Component, input } from '@angular/core';

import { FolderCardBase } from '../folder-card-base/folder-card-base';

import { Folder } from '@app/folder/types/model';

@Component({
  selector: 'folder-card',
  imports: [
    FolderCardBase,
  ],
  templateUrl: './folder-card.html',
  styleUrl: './folder-card.scss',
})
export class FolderCard {
  readonly folder = input.required<Folder>();
}

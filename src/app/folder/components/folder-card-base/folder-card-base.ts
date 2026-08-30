import { Component, output } from '@angular/core';
import { CardContainer } from '@components/containers/card-container/card-container';

@Component({
  selector: 'folder-card-base',
  imports: [
    CardContainer,
  ],
  templateUrl: './folder-card-base.html',
  styleUrl: './folder-card-base.scss',
})
export class FolderCardBase {
  readonly open = output<MouseEvent>();
}

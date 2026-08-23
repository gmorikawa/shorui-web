import { Component, effect, input, signal } from '@angular/core';
import { Binary } from '@app/file/types/override';
import { CardContainer } from '@components/containers/card-container/card-container';

/**
 * text: PDF, Word, Excel, PowerPoint, Text
 * image: PNG, JPEG, GIF
 */
type DocumentType = 'text' | 'image';

@Component({
  selector: 'document-viewer',
  imports: [
    CardContainer,
  ],
  templateUrl: './document-viewer.html',
  styleUrl: './document-viewer.scss',
})
export class DocumentViewer {
  readonly binary = input<Binary | null>(null);
  readonly type = input<DocumentType>('image');

  protected readonly contentUrl = signal<string | null>(null);

  constructor() {
    // recreate the object URL only when the binary input changes, revoking the previous one
    effect((onCleanup) => {
      const binary = this.binary();
      if (!binary) {
        this.contentUrl.set(null);
        return;
      }

      const url = URL.createObjectURL(binary);
      this.contentUrl.set(url);
      onCleanup(() => URL.revokeObjectURL(url));
    });
  }
}

import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertBox } from '@components/feedback/alert-box/alert-box';
import { FeedbackService } from 'services/feedback';

@Component({
  selector: 'app-root',
  imports: [
    AlertBox,
    RouterOutlet,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly feedback = inject(FeedbackService);

  protected readonly title = signal('shorui-web');
}

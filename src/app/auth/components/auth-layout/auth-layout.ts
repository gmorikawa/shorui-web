import { Component, input } from '@angular/core';
import { CardContainer } from '@components/containers/card-container/card-container';
import { MainContainer } from '@components/containers/main-container/main-container';

@Component({
  selector: 'auth-layout',
  imports: [
    CardContainer,
    MainContainer,
  ],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayout {
  readonly eyebrow = input<string>('');
  readonly title = input<string>('');
  readonly description = input<string>('');
}

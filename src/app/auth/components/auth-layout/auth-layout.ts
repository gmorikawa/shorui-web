import { Component, input } from '@angular/core';
import { Card } from '@components/card/card';
import { MainContainer } from '@components/containers/main-container/main-container';

@Component({
  selector: 'auth-layout',
  imports: [
    Card,
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

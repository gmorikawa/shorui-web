import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { ShortcutButton } from '@components/buttons/shortcut-button/shortcut-button';
import { MainContainer } from '@components/containers/main-container/main-container';
import { AuthService } from '@services/auth';

@Component({
  selector: 'main-layout',
  imports: [
    MainContainer,
    ShortcutButton,
    RouterOutlet
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  protected handleNavigation(path: string): void {
    this.router.navigate([path]);
  }

  protected handleLogout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}

import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShortcutButton } from '@components/buttons/shortcut-button/shortcut-button';
import { MainContainer } from '@components/containers/main-container/main-container';
import { WindowContainer } from '@components/containers/window-container/window-container';

@Component({
  selector: 'main-layout',
  imports: [
    MainContainer,
    WindowContainer,
    NgOptimizedImage,
    ShortcutButton,
    RouterOutlet
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout { }

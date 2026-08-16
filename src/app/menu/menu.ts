import { Component } from '@angular/core';
import { TileButton } from '@components/tile-button/tile-button';
import { MainContainer } from '@components/containers/main-container/main-container';

@Component({
  selector: 'sh-menu',
  imports: [
    MainContainer,
    TileButton,
  ],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {}

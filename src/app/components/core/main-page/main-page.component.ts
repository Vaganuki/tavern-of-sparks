import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavBarComponent} from '../nav-bar/nav-bar.component';
import {CardSelectorComponent} from '../assets/card-selector/card-selector.component';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-main-page',
  imports: [
    NavBarComponent,
    RouterOutlet,
    CardSelectorComponent,
    CommonModule,
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {
}

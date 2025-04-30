import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {PrimengValidationComponent} from './dev/primeng-validation/primeng-validation.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PrimengValidationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'tavern-of-sparks';
}

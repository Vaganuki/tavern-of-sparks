import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {LoginComponent} from "./components/auth/login/login.component";
import {DevComponent} from './components/dev/dev.component';
import {NavBarComponent} from './components/core/nav-bar/nav-bar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'tavern-of-sparks';
}

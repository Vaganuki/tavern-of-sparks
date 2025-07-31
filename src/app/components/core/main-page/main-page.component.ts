import {Component, inject} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-main-page',
  imports: [],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {

  private _authService = inject(AuthService);
  private _router = inject(Router);

  logout(){
    this._authService.logout();
    void this._router.navigate(['/login']);
  }

}

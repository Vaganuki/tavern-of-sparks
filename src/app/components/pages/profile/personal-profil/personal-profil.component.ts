import { Component } from '@angular/core';

@Component({
  selector: 'app-personal-profil',
  imports: [],
  templateUrl: './personal-profil.component.html',
  styleUrl: './personal-profil.component.scss'
})
export class PersonalProfilComponent {

  mockup_data = {
    username: "xX_MockUp_Xx",
    email: "mock@up.com",
    firstname: "Mock",
    lastname: "Up",
    birthdate: new Date("2019-05-01"),
    profileImage: null,
  }

}

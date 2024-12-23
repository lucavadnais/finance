import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthProvider} from "../../providers/auth/auth.provider";
import {ButtonComponent} from "../../components/button/button.component";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    ButtonComponent
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  constructor(
    private router: Router,
    private authProvider: AuthProvider) { }

  logout() {
    this.authProvider.logout();
    this.router.navigateByUrl("/login");
  }
}

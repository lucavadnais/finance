import { Component } from '@angular/core';
import {ButtonComponent} from "../../components/button/button.component";
import {AuthProvider} from "../../providers/auth/auth.provider";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ButtonComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

constructor(
  private router: Router,
  private authProvider: AuthProvider) { }

  logout() {
    console.log("logout");
    this.authProvider.logout();
    this.router.navigateByUrl("/login");
  }

}

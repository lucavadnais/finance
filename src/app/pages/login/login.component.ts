import { Component } from '@angular/core';
import {AuthProvider} from "../../providers/auth/auth.provider";
import { Router } from '@angular/router';
import {FormsModule} from "@angular/forms";
import {ButtonComponent} from "../../components/button/button.component";
import {NgIf} from "@angular/common";
import {UserProvider} from "../../providers/user.provider";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ButtonComponent,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  email!: string;
  password!: string;
  errorMessage: string = '';

  constructor(
    private userProvider: UserProvider,
    private authProvider: AuthProvider,
    private router: Router
  ) { }

  async createUser() {
    if (!this.email || !this.password) {
      this.errorMessage = "Veuillez remplir tous les champs."
      return;
    }
    try {
      await this.userProvider.createUser({email: this.email, password: this.password, language: 'en', first_name: 'John', last_name: 'Doe'})
    } catch (e: any) {
      console.log(e)
      this.password = '';
      console.error(e);
    }
  }

  async login() {
    if (!this.email || !this.password) {
      this.errorMessage = "Veuillez remplir tous les champs."
      return;
    }
    try {
      await this.authProvider.login({email: this.email, password: this.password})
      await this.router.navigate(['/home'])
    } catch (e: any) {
      console.log(e)
      this.errorMessage = "Courriel ou mot de passe invalide. Veuillez réessayer."
      this.password = '';
      console.error(e);
    }
  }
}

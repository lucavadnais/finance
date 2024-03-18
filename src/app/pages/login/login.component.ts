import { Component } from '@angular/core';
import {AuthProvider} from "../../providers/auth/auth.provider";
import { Router } from '@angular/router';
import {FormsModule} from "@angular/forms";
import {ButtonComponent} from "../../components/button/button.component";
import {NgIf} from "@angular/common";

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
    private authProvider: AuthProvider,
    private router: Router
  ) { }


  async login() {
    if (!this.email || !this.password) {
      this.errorMessage = "Please fill in all fields."
      return;
    }
    try {
      await this.authProvider.login({email: this.email, password: this.password})
      await this.router.navigate(['/home'])
    } catch (e: any) {
      console.log(e)
      this.errorMessage = "Invalid credentials. Please try again."
      this.password = '';
      console.error(e);
    }
  }
}

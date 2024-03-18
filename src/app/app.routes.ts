import { Routes } from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import {AuthGuard} from "./providers/auth/auth.guard";
import {HomeComponent} from "./pages/home/home.component";


export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'

  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  }
];

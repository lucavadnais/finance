import {Injectable} from "@angular/core";
import {AuthProvider} from "./auth.provider";
import {CanActivate, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{

    constructor(
      private router: Router,
      private authProvider: AuthProvider
    ) { }

  canActivate(): boolean {
    let isAuth: boolean | null = null;
    this.authProvider.isAuthenticated().subscribe((response) => {
      isAuth = response;
    });

    /*TODO: fix nav glitch */
    if (!isAuth) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}

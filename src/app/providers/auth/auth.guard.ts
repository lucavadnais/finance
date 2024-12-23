import {inject} from "@angular/core";
import {AuthProvider} from "./auth.provider";
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree
} from "@angular/router";
import {Observable} from "rxjs";

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
):
  Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree=> {

  return inject(AuthProvider).authenticated()
    ? true
    : inject(Router).createUrlTree(['/login']);
};

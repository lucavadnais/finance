import {Inject, Injectable, OnInit, PLATFORM_ID} from "@angular/core";
import {HeaderProvider} from "../header/header.provider";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {BehaviorSubject} from "rxjs";
import {isPlatformBrowser} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class AuthProvider {
  private isLoggedIn = new BehaviorSubject<boolean>(false);
  server = environment.apiUrl;
  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private httpClient: HttpClient,
    private headerProvider: HeaderProvider) {
    this.isBrowser = isPlatformBrowser(platformId)
    this.checkToken();
  }

  validateCreds(): void {
    localStorage.setItem('access_token', 'access_token');
    this.isLoggedIn.next(true);
  }

  isAuthenticated() {
    return this.isLoggedIn.asObservable();
  }

  checkToken() {
    if (this.isBrowser) {
      const token = localStorage.getItem('access_token');
      this.isLoggedIn.next(!!token);
      return !!token;
    } else {
      return false;
    }
  }

  login(credentials: {email: string, password: string}) {
    return new Promise((resolve, reject) => {
      const headers = this.headerProvider.getCommonHeaders();
      this.httpClient.post(this.server + `/login`, credentials, {"headers":headers}).subscribe((res: any) => {
        this.validateCreds();
        resolve(res);
      }, err=>{
        reject(err);
      });
    });
  }

  logout(){
    localStorage.removeItem('access_token');
    this.isLoggedIn.next(false);
  }
}

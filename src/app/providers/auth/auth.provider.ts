import {Injectable} from "@angular/core";
import {HeaderProvider} from "../header/header.provider";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthProvider {
  private readonly TOKEN_KEY = 'auth_token';
  server = environment.apiUrl;

  constructor(
    private httpClient: HttpClient,
    private headerProvider: HeaderProvider) {
  }

  // Save the token to local storage
  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Retrieve the token from local storage
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Check if the user is authenticated
  authenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  login(credentials: {email: string, password: string}) {
    return new Promise((resolve, reject) => {
      const headers = this.headerProvider.getCommonHeaders();
      this.httpClient.post(this.server + `/login`, credentials, {"headers":headers}).subscribe((res: any) => {
        this.saveToken(res);
        resolve(res);
      }, err=>{
        reject(err);
      });
    });
  }

  logout(){
    localStorage.removeItem(this.TOKEN_KEY);
  }
}

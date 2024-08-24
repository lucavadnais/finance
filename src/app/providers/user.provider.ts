import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {HeaderProvider} from "./header/header.provider";
import {environment} from "../environments/environment";
import {newUser} from "../models/user.model";

@Injectable({
  providedIn: 'root',
})
export class UserProvider {

  server = environment.apiUrl;
  constructor(
    private httpClient: HttpClient,
    private headerProvider: HeaderProvider) {}

  createUser(credentials: newUser): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient
        .post<any>(`${this.server}/users`, credentials, {
          headers: this.headerProvider.getCommonHeaders(),
        })
        .subscribe({
          next: res => {
            resolve(res)
          },
          error: err => {
            reject(err)
          }
        });
    })
  }
}

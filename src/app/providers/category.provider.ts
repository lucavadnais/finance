import {Injectable} from "@angular/core";
import {environment} from "../environments/environment";
import {HttpClient} from "@angular/common/http";
import {HeaderProvider} from "./header/header.provider";

@Injectable({
  providedIn: 'root',
})
export class CategoryProvider {

  server = environment.apiUrl;
  constructor(
    private httpClient: HttpClient,
    private headerProvider: HeaderProvider) {}

  getUserCategories(userId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient
        .get<any>(`${this.server}/category/user/${userId}`, {
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

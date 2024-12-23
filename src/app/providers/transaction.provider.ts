import {Injectable} from "@angular/core";
import {environment} from "../environments/environment";
import {HttpClient} from "@angular/common/http";
import {HeaderProvider} from "./header/header.provider";
import {TransactionToApi} from "../models/transaction.model";

@Injectable({
  providedIn: 'root',
})
export class TransactionProvider {

  server = environment.apiUrl;
  constructor(
    private httpClient: HttpClient,
    private headerProvider: HeaderProvider) {}

  sendTransaction(transaction: TransactionToApi): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient
        .post<any>(`${this.server}/transaction/new`, transaction, {
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

  getAllUserTransactions(userId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient
        .get<any>(`${this.server}/transaction/user/${userId}`, {
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

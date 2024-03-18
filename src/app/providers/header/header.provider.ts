import { Injectable } from '@angular/core'
import { HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class HeaderProvider {
  constructor() {}

  public getCommonHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    })
  }
}

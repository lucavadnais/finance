import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RefreshService {
  refreshAccount: EventEmitter<any> = new EventEmitter();

  constructor() {}

  emitRefreshNewAccountEvent() {
    this.refreshAccount.emit();
  }
}

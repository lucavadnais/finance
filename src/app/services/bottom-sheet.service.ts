import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BottomSheetService {
  closeBottomSheet: EventEmitter<string> = new EventEmitter();
  concludeBottomSheet: EventEmitter<string> = new EventEmitter();

  constructor() {}

  emitOpenBottomSheetEvent(id: string) {
    this.closeBottomSheet.emit(id);
  }

  emitConcludeBottomSheetEvent(id: string) {
    this.concludeBottomSheet.emit(id);
  }
}

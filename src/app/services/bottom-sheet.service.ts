import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BottomSheetService {
  closeBottomSheet: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  emitOpenBottomSheetEvent() {
    this.closeBottomSheet.emit();
  }
}

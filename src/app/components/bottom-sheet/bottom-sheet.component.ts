import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";
import {BottomSheetService} from "../../services/bottom-sheet.service";

@Component({
  selector: 'app-bottom-sheet',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './bottom-sheet.component.html',
  styleUrl: './bottom-sheet.component.scss'
})
export class BottomSheetComponent implements OnInit {

  @Input() actionButtons = true;
  @Input() title: string = '';
  @Input() id: string = '';
  @Output() isOpen = new EventEmitter<boolean>();

  constructor(
    private bottomSheetService: BottomSheetService,
  ) {}

  ngOnInit() {
    document.getElementById('root')!.style.overflow = 'hidden';
    this.bottomSheetService.closeBottomSheet.subscribe((id) => {
      this.id = id;
      this.close();
    });
  }

  close() {
    document.getElementById('bottom-sheet' + this.id)!.className = 'bottom-sheet closed';
    document.getElementById('bottom-sheet-background' + this.id)!.className = 'bottom-sheet-background closed';
    setTimeout(() => {
      this.isOpen.emit(false);
      setTimeout(() => {
        if (!document.querySelector('[id^="bottom-sheet"]')?.id) {
          document.getElementById('root')!.style.overflow = '';
        }
      }, 1);
    }, 500);
  }

  conclude() {
    this.bottomSheetService.emitConcludeBottomSheetEvent(this.id);
    this.close();
  }
}

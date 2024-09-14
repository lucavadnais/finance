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
  @Output() isOpen = new EventEmitter<boolean>();


  constructor(
    private bottomSheetService: BottomSheetService,
  ) {}

  ngOnInit() {
    this.bottomSheetService.closeBottomSheet.subscribe(() => {
      this.close();
    });
  }

  close() {
    document.getElementById('bottom-sheet')!.className = 'bottom-sheet closed';
    document.getElementById('bottom-sheet-background')!.className = 'bottom-sheet-background closed';
    setTimeout(() => {
      this.isOpen.emit(false);
    }, 500);
  }
}

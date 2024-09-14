import {Component, Input} from '@angular/core';
import {RouterLink} from "@angular/router";
import {BottomSheetComponent} from "../bottom-sheet/bottom-sheet.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    RouterLink,
    BottomSheetComponent,
    NgIf
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  @Input() currentUrl = '';

  isBottomSheetOpen = false;

  constructor() {
  }


  openPlusMenu() {
    this.isBottomSheetOpen = !this.isBottomSheetOpen;
  }
}

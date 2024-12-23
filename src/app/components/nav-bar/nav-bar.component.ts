import {Component, Input} from '@angular/core';
import {RouterLink} from "@angular/router";
import {BottomSheetComponent} from "../bottom-sheet/bottom-sheet.component";
import {NgIf} from "@angular/common";
import {NewAccountComponent} from "../new-account/new-account.component";
import {TransactionComponent} from "../transaction/transaction.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    RouterLink,
    BottomSheetComponent,
    NgIf,
    NewAccountComponent,
    TransactionComponent,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  @Input() currentUrl = '';

  isBottomSheetOpen = false;
  selectedTransactionType = 0;

  constructor() {
  }


  openAddTransactionMenu() {
    this.isBottomSheetOpen = !this.isBottomSheetOpen;
  }

  onSelectTransactionTypeChange(event: any) {
    this.selectedTransactionType = event.target.value;
  }
}

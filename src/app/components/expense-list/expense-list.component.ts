import {Component, Input} from '@angular/core';
import {Transaction} from "../../models/transaction.model";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.scss'
})
export class ExpenseListComponent {

  @Input() expenses: Transaction[] = [];

}

import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Category, Transaction} from "../../models/transaction.model";
import {NgForOf} from "@angular/common";
import {CategoryProvider} from "../../providers/category.provider";
import {User} from "../../models/user.model";
import {AuthProvider} from "../../providers/auth/auth.provider";
import {resolve} from "node:path";

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.scss'
})
export class ExpenseListComponent implements OnInit, OnChanges {

  @Input() expenses: Transaction[] = [];

  user: User | null = null;
  filteredExpenses: Transaction[] = [];


  constructor(
    private categoryProvider: CategoryProvider,
    private authProvider: AuthProvider
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.user ? this.fetchPageContent() : null;
  }

  ngOnInit() {
    this.user = JSON.parse(this.authProvider.getToken());
    this.fetchPageContent();
  }


  fetchPageContent() {
    this.getSubCategory().then((res: any) => {
      this.filteredExpenses = this.expenses.map((expense: Transaction) => {
        if (expense.category?.parentId) {
          res.find((category: Category) => {
            if (expense.category?.parentId === category._id) {
              expense.category.parent = category;
            }
          });
        }
        return expense;
      });
    });
  }

  getSubCategory() {
    return new Promise((resolve, reject) => {
      this.categoryProvider.getUserCategories(this.user!._id).then((res: any) => {
        resolve(res);
      }).catch(err => {
        reject(err);
      });
    });
  }
}

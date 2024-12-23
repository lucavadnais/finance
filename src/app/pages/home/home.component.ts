import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ButtonComponent} from "../../components/button/button.component";
import {AuthProvider} from "../../providers/auth/auth.provider";
import {CardComponent} from "../../components/card/card.component";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {ExpenseListComponent} from "../../components/expense-list/expense-list.component";
import {Account, Category, Transaction} from "../../models/transaction.model";
import {AccountProvider} from "../../providers/account.provider";
import {User} from "../../models/user.model";
import {BottomSheetComponent} from "../../components/bottom-sheet/bottom-sheet.component";
import {NewAccountComponent} from "../../components/new-account/new-account.component";
import {RefreshService} from "../../services/refresh.service";
import {CardSwitcherService} from "../../services/card-switcher.service";
import {TransactionProvider} from "../../providers/transaction.provider";
import {CategoryProvider} from "../../providers/category.provider";
import {ProgressSpinnerModule} from "primeng/progressspinner";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ButtonComponent,
    CardComponent,
    NgStyle,
    NgForOf,
    ExpenseListComponent,
    NgIf,
    BottomSheetComponent,
    NewAccountComponent,
    ProgressSpinnerModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, AfterViewInit {

  user: User | null = null;
  offset = 75;
  slideDownTarget = '';
  isStack: any = false;
  loading = true;
  isBottomSheetOpen = false;

  totalAmount = '1000.00';
  accounts: Account[] = [];

  expenses: Transaction[] = [];
  filteredExpenses: Transaction[] = [];


  newAccountCard = {
    newCard: true,
    type: 'debit',
    provider: 'visa',
    name: '',
    lastDigits: 1234,
    color: 'linear-gradient(#ffffff, rgba(214, 214, 214, 0.8))'
  }

  constructor(
    private cardSwitcherService: CardSwitcherService,
    private refreshService: RefreshService,
    private authProvider: AuthProvider,
    private accountProvider: AccountProvider,
    private transactionProvider: TransactionProvider,
    private categoryProvider: CategoryProvider
  ) {

  }

  ngOnInit() {
    this.refreshService.refreshAccount.subscribe(() => {
      console.log('refreshing accounts');
      this.fetchPageContent();
    });

    this.user = JSON.parse(this.authProvider.getToken());
    this.newAccountCard.name = `${this.user?.first_name} ${this.user?.last_name}`;
    this.fetchPageContent();
  }

  fetchPageContent() {
    Promise.all([this.getUserAccounts(), this.getUserTransactions(), this.getUserCategories()]).then((res : any) => {
      this.accounts = res[0];
      this.expenses = res[1];
      for (let expense of this.expenses) {
        expense.date = new Date(expense.date).toDateString();
        expense.account = this.accounts.find((account: Account) => account._id === expense.accountId);
        expense.category = res[2].find((category: Category) => category._id === expense.categoryId);
      }
      this.filteredExpenses = this.expenses;
    }).catch(err => {
      console.error(err);
    }).finally(() => {
      // this.getParentHeight().then(() => {
      //   this.loading = false;
      // });
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getParentHeight().then(() => {
        setTimeout(() => {
          this.loading = false;
        }, 500);
      })
    }, 500);
  }

  getUserAccounts() {
    return new Promise((resolve, reject) => {
      if (this.user) {
        this.accountProvider.getAllUserAccounts(this.user._id).then((res: Account[]) => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      }
    });
  }

  getUserTransactions() {
    return new Promise((resolve, reject) => {
      if (this.user) {
        this.transactionProvider.getAllUserTransactions(this.user._id).then((res: any) => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      }
    });
  }

  getUserCategories() {
    return new Promise((resolve, reject) => {
      if (this.user) {
        this.categoryProvider.getUserCategories(this.user._id).then((res: any) => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      }
    });
  }

  createNewCard() {
    this.isBottomSheetOpen = !this.isBottomSheetOpen;
  }

  async selectCard(card: any, index: number) {
    this.slideDownTarget = (((this.accounts.length - 1) - index) * this.offset).toString()
    // remove classname from other cards
    setTimeout(() => {
      document.getElementById(index.toString())?.classList.remove('selected');
      let i = 0;
      for (let unselectedCard of this.accounts) {
        if (unselectedCard !== card && unselectedCard !== this.accounts[0]) {
          document.getElementById(i.toString())?.classList.remove('unselected');
        }
        i++;
      }
      this.accounts = this.accounts.filter(c => c !== card);
      this.accounts.push(card);
    }, 500);

    this.isStack = await this.cardSwitcherService.selectCard(card, index, this.accounts, '', this.isStack, true);

    setTimeout(() => {
      this.getParentHeight();
      if (this.isStack) {
        this.filteredExpenses = this.expenses.filter(expense => expense.accountId === card._id);
      } else {
        this.filteredExpenses = this.expenses;
      }
    }, 500);
  }

  async getParentHeight() {
    const parentElement = document.getElementById('card-container')!;
    const children: any[] = Array.from(parentElement.children);
    let minTop = Infinity;
    let maxBottom = -Infinity;

    children.forEach(child => {
      const rect = child.getBoundingClientRect();
      const childTop = rect.top - parentElement.getBoundingClientRect().top;
      const childBottom = childTop + rect.height;

      // Track the highest and lowest points
      if (childTop < minTop) minTop = childTop;
      if (childBottom > maxBottom) maxBottom = childBottom;
    });

    // Calculate height to encompass all children
    parentElement!.style.height = `${maxBottom - minTop}px`;
  }
}

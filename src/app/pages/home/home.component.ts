import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ButtonComponent} from "../../components/button/button.component";
import {AuthProvider} from "../../providers/auth/auth.provider";
import {CardComponent} from "../../components/card/card.component";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {ExpenseListComponent} from "../../components/expense-list/expense-list.component";
import {Account, Transaction} from "../../models/transaction.model";
import {AccountProvider} from "../../providers/account.provider";
import {User} from "../../models/user.model";
import {BottomSheetComponent} from "../../components/bottom-sheet/bottom-sheet.component";
import {NewAccountComponent} from "../../components/new-account/new-account.component";
import {RefreshService} from "../../services/refresh.service";

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
    NewAccountComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, AfterViewInit {

  user: User | null = null;
  offset = 75;
  slideDownTarget = '';
  isStack = false;
  loading = false;
  isBottomSheetOpen = false;

  totalAmount = '1000.00';
  accounts: Account[] = [];

  expenses: Transaction[] = [];


  newAccountCard = {
    newCard: true,
    type: 'debit',
    provider: 'visa',
    name: '',
    lastDigits: 1234,
    color: 'linear-gradient(#ffffff, rgba(214, 214, 214, 0.8))'
  }

  constructor(
    private refreshService: RefreshService,
    private authProvider: AuthProvider,
    private accountProvider: AccountProvider,
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
    Promise.all([this.getUserAccounts()]).then((res:any) => {
      this.accounts = res[0];
      this.expenses = [
        {
          _id: '1',
          accountId: '1',
          account: this.accounts[0],
          type: 'debit',
          date: '2021-07-01',
          amount: 100.00,
          categoryId: '1',
          category: { _id: '1', userId: '1', name: 'Groceries', icon: 'shopping-cart', parentId: 0, parent: null },
          comment: 'Groceries at Walmart'
        },
        {
          _id: '2',
          accountId: '1',
          account: this.accounts[1],
          type: 'debit',
          date: '2021-07-01',
          amount: 100.00,
          categoryId: '2',
          category: {_id: '2', userId: '1', name: 'Gas', icon: 'gas-pump', parentId: 0, parent: {_id: '2', userId: '1', name: 'Shell', icon: 'gas-pump', parentId: 0, parent: null}},
          comment: 'Gas at Shell'
        }
      ];
    }).catch(err => {
      console.error(err);
    }).finally(() => {
      this.loading = false;
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getParentHeight();
    }, 500);
  }

  getUserAccounts() {
    return new Promise((resolve, reject) => {
      if (this.user) {
        this.accountProvider.getAllUserAccounts(this.user._id).then((res: any) => {
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

  updateCardClasses(action: 'add' | 'remove', classes: string[]) {
    this.accounts.forEach((_, index) => {
      const element = document.getElementById(index.toString());
      if (element) {
        classes.forEach(className => element.classList[action](className));
      }

      document.getElementById(this.accounts.length.toString())!.classList[action](classes[0]);

    });
  }

  selectCard(card: any, index: number) {
    this.slideDownTarget = (((this.accounts.length - 1) - index) * this.offset).toString()

    if (this.accounts[this.accounts.length - 1] === card) {
      if (!this.isStack) {
        this.updateCardClasses.call(this, 'add', ['stack']);
      } else {
        this.updateCardClasses.call(this, 'remove', ['stack']);
        this.updateCardClasses.call(this, 'add', ['unstack']);
      }

      setTimeout(() => {
        this.updateCardClasses.call(this, 'remove', ['unstack']);
        this.getParentHeight();
      }, 500);

      this.isStack = !this.isStack;
      return;
    }

    let i = 0;
    for (let unselectedCard of this.accounts) {
      if (index < i  && unselectedCard !== this.accounts[0]) {
        document.getElementById(i.toString())?.classList.add('unselected');
      }
      i++;
    }

    // add classname to card
    document.getElementById(index.toString())?.classList.add('selected');

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
  }

  getParentHeight() {
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
    // return maxBottom - minTop;
  }
}

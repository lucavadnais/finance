import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {CardComponent} from "../card/card.component";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {RefreshService} from "../../services/refresh.service";
import {AuthProvider} from "../../providers/auth/auth.provider";
import {AccountProvider} from "../../providers/account.provider";
import {Account, Category} from "../../models/transaction.model";
import {User} from "../../models/user.model";
import {CardSwitcherService} from "../../services/card-switcher.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { CalendarModule } from 'primeng/calendar';
import {InputNumberModule} from "primeng/inputnumber";
import {ButtonComponent} from "../button/button.component";
import {InputTextareaModule} from "primeng/inputtextarea";
import {BottomSheetComponent} from "../bottom-sheet/bottom-sheet.component";
import {CategoriesComponent} from "../categories/categories.component";
import {BottomSheetService} from "../../services/bottom-sheet.service";
import {TransactionProvider} from "../../providers/transaction.provider";

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [
    CardComponent,
    NgForOf,
    NgStyle,
    ReactiveFormsModule,
    CalendarModule,
    FormsModule,
    InputNumberModule,
    ButtonComponent,
    InputTextareaModule,
    BottomSheetComponent,
    NgIf,
    CategoriesComponent
  ],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss'
})
export class TransactionComponent implements OnInit {

  @Input() transactionType = 0;

  user: User | null = null;
  accounts: Account[] = [];

  isStack: any = true;
  slideDownTarget = '';
  offset = 70;

  amount: number = 10.25;
  comment: string = '';
  date: string = new Date().toISOString().slice(0, 10);


  category: Category | null  = null;
  parentName: string = '';

  isBottomSheetOpen: boolean = false;

  constructor(
    private bottomSheetService: BottomSheetService,
    private cardSwitcherService: CardSwitcherService,
    private refreshService: RefreshService,
    private authProvider: AuthProvider,
    private accountProvider: AccountProvider,
    private transactionProvider: TransactionProvider
  ) {

  }


  ngOnInit() {
    this.refreshService.refreshAccount.subscribe(() => {
      this.fetchPageContent();
    });
    this.bottomSheetService.concludeBottomSheet.subscribe((id: string) => {
      console.log('ici')
      if (id === 'transaction') {
        this.sendTransaction();
      }
    });

    this.user = JSON.parse(this.authProvider.getToken());
    this.fetchPageContent();
  }

  fetchPageContent() {
    Promise.all([this.getUserAccounts()]).then((res:any) => {
      this.accounts = res[0];
    }).catch(err => {
      console.error(err);
    })
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

  openCalendar() {
    const input = document.getElementById('dateInput') as HTMLInputElement;
    input.showPicker();
  }

  openAddTransactionMenu() {
    this.isBottomSheetOpen = !this.isBottomSheetOpen;
  }

  sendTransaction() {
    if (!this.category) {
      return;
    }
    this.transactionProvider.sendTransaction({
      userId: this.user!._id,
      accountId: this.accounts[this.accounts.length - 1]._id,
      type: this.transactionType,
      date: new Date(this.date),
      amount: this.amount,
      categoryId: this.category._id,
      comment: this.comment,
    }).then(() => {
      this.refreshService.emitRefreshNewTransactionEvent();
    }).catch(err => {
      console.error(err);
    });
  }

  selectedCategory(category: any) {
    this.category = category;
  }

  selectedParentNameCategory(parentName: any) {
    this.parentName = parentName;
  }

  async selectCard(card: any, index: number) {
    this.slideDownTarget = (((this.accounts.length - 1) - index) * this.offset).toString();

    // remove classname from other cards
    setTimeout(() => {
      document.getElementById(index.toString() + 'trx')?.classList.remove('selected');
      let i = 0;
      for (let unselectedCard of this.accounts) {
        if (unselectedCard !== card && unselectedCard !== this.accounts[0]) {
          document.getElementById(i.toString() + 'trx')?.classList.remove('unselected');
        }
        i++;
      }
      this.accounts = this.accounts.filter(c => c !== card);
      this.accounts.push(card);
    }, 500);

    this.isStack = await this.cardSwitcherService.selectCard(card, index, this.accounts, 'trx', this.isStack, true);
  }

}



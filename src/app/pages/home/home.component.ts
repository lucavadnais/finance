import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ButtonComponent} from "../../components/button/button.component";
import {AuthProvider} from "../../providers/auth/auth.provider";
import {Router} from "@angular/router";
import {CardComponent} from "../../components/card/card.component";
import {NgForOf, NgStyle} from "@angular/common";
import {ExpenseListComponent} from "../../components/expense-list/expense-list.component";
import {Account, Transaction} from "../../models/transaction.model";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ButtonComponent,
    CardComponent,
    NgStyle,
    NgForOf,
    ExpenseListComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, AfterViewInit {

  offset = 75;
  slideDownTarget = '';
  isStack = false;

  totalAmount = '1000.00';

  // TMP
  cards = [
    {
      cardType: 'credit',
      cardNumber: '3456',
      cardHolderName: 'John Doe',
      cardProvider: 'masterCard',
      cardColor: 'linear-gradient(#585858, rgba(13, 13, 13, 0.8))'
    },
    {
      cardType: 'debit',
      cardNumber: '3456',
      cardHolderName: 'John Doe',
      cardProvider: 'visa',
      cardColor: 'linear-gradient(#0072F7, rgba(0, 22, 55, 0.8))'
    },
    {
      cardType: 'credit',
      cardNumber: '3456',
      cardHolderName: 'John Doe',
      cardProvider: 'masterCard',
      cardColor: 'linear-gradient(#00D971, rgba(0, 55, 29, 0.8))'
    },
  ];

  account: Account[] = [
    {
      _id: '1',
      userId: '1',
      createdAt: '2021-07-01',
      type: 'checking',
      currency: 'USD',
      provider: 'Chase',
      name: 'Chase Checking',
      lastDigits: 1234,
      color: 'linear-gradient(#0072F7, rgba(0, 22, 55, 0.8))'
    },
    {
      _id: '2',
      userId: '1',
      createdAt: '2021-07-01',
      type: 'savings',
      currency: 'USD',
      provider: 'Chase',
      name: 'Chase Savings',
      lastDigits: 5678,
      color: 'linear-gradient(#00D971, rgba(0, 55, 29, 0.8))'
    }
  ];

  expenses: Transaction[] = [
    {
      _id: '1',
      accountId: '1',
      account: this.account[0],
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
      account: this.account[1],
      type: 'debit',
      date: '2021-07-01',
      amount: 100.00,
      categoryId: '2',
      category: {_id: '2', userId: '1', name: 'Gas', icon: 'gas-pump', parentId: 0, parent: {_id: '2', userId: '1', name: 'Shell', icon: 'gas-pump', parentId: 0, parent: null}},
      comment: 'Gas at Shell'
    }
  ];

  constructor() { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.getParentHeight();
  }

  updateCardClasses(action: 'add' | 'remove', classes: string[]) {
    this.cards.forEach((_, index) => {
      const element = document.getElementById(index.toString());
      if (element) {
        classes.forEach(className => element.classList[action](className));
      }
    });
  }

  selectCard(card: any, index: number) {
    this.slideDownTarget = (((this.cards.length - 1) - index) * this.offset).toString()

    if (this.cards[this.cards.length - 1] === card) {
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
    for (let unselectedCard of this.cards) {
      if (unselectedCard !== card && unselectedCard !== this.cards[0]) {
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
      for (let unselectedCard of this.cards) {
        if (unselectedCard !== card && unselectedCard !== this.cards[0]) {
          document.getElementById(i.toString())?.classList.remove('unselected');
        }
        i++;
      }
      this.cards = this.cards.filter(c => c !== card);
      this.cards.push(card);
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

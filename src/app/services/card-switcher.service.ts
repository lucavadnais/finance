import {Injectable, Input} from "@angular/core";
import {Account} from "../models/transaction.model";

@Injectable({
  providedIn: 'root',
})
export class CardSwitcherService {

  isStack = false;
  accounts: Account[] = [];
  id = '';

  constructor() {}

  selectCard(card: any, index: number, accounts: Account[], id: string, stackStatus: boolean, autoStack = false) {
    return new Promise((resolve) => {
      this.accounts = accounts;
      this.id = id;
      this.isStack = stackStatus;

      if (this.accounts[this.accounts.length - 1] === card) {
        resolve(this.stack());
        return;
      }

      let i = 0;
      for (let unselectedCard of this.accounts) {
        if (index < i && unselectedCard !== this.accounts[0]) {
          document.getElementById(i.toString() + this.id)?.classList.add('unselected');
        }
        i++;
      }

      // add classname to card
      document.getElementById(index.toString() + this.id)?.classList.add('selected');

      if (autoStack) {
        setTimeout(() => {
          resolve(this.stack());
        }, 500);
      } else {
        resolve(this.isStack);
      }
    });
  }

  stack() {
    return new Promise((resolve) => {
      if (!this.isStack) {
        this.updateCardClasses.call(this, 'add', ['stack']);
      } else {
        this.updateCardClasses.call(this, 'remove', ['stack']);
        this.updateCardClasses.call(this, 'add', ['unstack']);
      }

      setTimeout(() => {
        this.updateCardClasses.call(this, 'remove', ['unstack']);
        return;
      }, 500);
      this.isStack = !this.isStack;
      resolve(this.isStack);
    });
  }

  updateCardClasses(action: 'add' | 'remove', classes: string[]) {
    this.accounts.forEach((_, index) => {
      const element = document.getElementById(index.toString() + this.id);
      if (element) {
        classes.forEach(className => element.classList[action](className));
      }

      document.getElementById(this.accounts.length.toString() + this.id)?.classList[action](classes[0]);

    });
  }
}

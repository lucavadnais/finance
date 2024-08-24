export interface Transaction {
  _id: string;
  accountId: string;
  account: Account;
  type: string;
  date: string;
  amount: number;
  categoryId: any;
  category: Category;
  comment: string;
}

export interface Category {
  _id: string;
  userId: string;
  name: string;
  icon: string;
  parentId: number;
  parent: Category | null;
}

export interface Account {
  _id: string;
  userId: string;
  createdAt: string;
  type: string;
  currency: string;
  provider: string;
  name: string;
  lastDigits: number;
  color: string;
}

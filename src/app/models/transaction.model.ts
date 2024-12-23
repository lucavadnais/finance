export interface Transaction {
  _id: string;
  userId: string;
  accountId: string;
  type: number;
  date: string;
  amount: number;
  categoryId: any;
  comment: string;
  account?: Account;
  category?: Category;
}

export interface TransactionToApi {
  userId: string;
  accountId: string;
  type: number;
  date: Date;
  amount: number;
  categoryId: string;
  comment: string;
}

export interface Category {
  _id: string;
  userId: string;
  name: string;
  icon: string;
  parentId?: string;
  parent: Category | null;
  children?: Category[] | null;
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

export interface AccountToApi {
  userId: string;
  type: string;
  currency: string;
  provider: string;
  name: string;
  lastDigits: number | undefined;
  color: string;
  createdAt: Date;
}

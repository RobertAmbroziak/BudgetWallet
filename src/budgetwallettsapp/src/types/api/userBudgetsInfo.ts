import {Account} from "./account";
import {Category} from "./category";

export interface UserBudgetsInfo {
    accounts: Account[];
    categories: Category[];
    currentBudgetId: number;
  }
import {Budget} from "./budget";
import {BudgetPeriod} from "./budgetPeriod";
import {Account} from "./account";
import {Category} from "./category";

export interface ExpenseFilterData {
    budgets: Budget[] | null;
    budgetPeriods: BudgetPeriod[] | null;
    accounts: Account[];
    categories: Category[];
    currentBudgetId: number;
  }
import { BudgetPeriod } from "./budgetPeriod"
import { BudgetCategory } from "./budgetCategory"

export interface Budget {
    id: number,
    name: string,
    description: string,
    validFrom: Date,
    validTo: Date,
    isActive: boolean,
    budgetPeriods: BudgetPeriod[],
    budgetCategories: BudgetCategory[],
  }
import { BudgetPeriodCategory } from "./budgetPeriodCategory"

export interface BudgetPeriod {
    id: number,
    budgetId: number,
    validFrom: Date,
    validTo: Date,
    name: string,
    budgetPeriodCategories: BudgetPeriodCategory[]
}
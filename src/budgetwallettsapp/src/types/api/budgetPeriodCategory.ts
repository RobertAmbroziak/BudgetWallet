import { Category } from "./category" 

export interface BudgetPeriodCategory {
    id: number,
    budgetPeriodId: number,
    categoryId: number,
    maxValue: number,
    isActive: boolean,
    category: Category
}
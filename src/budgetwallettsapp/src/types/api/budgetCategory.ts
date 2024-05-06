import { Category } from "./category" 

export interface BudgetCategory {
    id: number,
    budgetId: number,
    categoryId: number,
    maxValue: number,
    isActive: boolean,
    category: Category
}
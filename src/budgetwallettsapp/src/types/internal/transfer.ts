import { Category } from "../api/category" 
import { Account } from "../api//account" 
import { Split } from "../api/split" 

export interface Transfer {
    transferId: number,
    transferName: string,
    transferDescription: string,
    transferValue: number,
    transferDate: Date,
    budgetId: number,
    accountSourceId: number,
    accountSourceName: string,
    accountSourceDescription: string,
    splits: Split[],
    accounts: Account[],
    categories: Category[]
}

      
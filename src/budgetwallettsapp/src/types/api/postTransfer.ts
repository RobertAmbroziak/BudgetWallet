import { PostSplit } from "./postSplit";

export interface PostTransfer {
    id: number,
    name: string,
    description: string,
    budgetId: number,
    sourceAccountId: number,
    value: number,
    transferDate: Date,
    transferType: string,
    isActive: boolean,
    splits: PostSplit[]
}
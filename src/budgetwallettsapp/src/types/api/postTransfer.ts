import { PostSplit } from "./postSplit";

export interface PostTransfer {
    id: number,
    name: string,
    description: string,
    budgetId: number | null,
    sourceAccountId: number | null,
    destinationAccountId: number | null,
    value: number,
    transferDate: Date,
    transferType: string,
    isActive: boolean,
    splits: PostSplit[]
}
import { Account } from "./account"

export interface InternalDepositTransfer {
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
    SourceAccount: Account | null,
    DestinationAccount: Account | null
}
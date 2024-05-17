import { DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES } from "react";
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
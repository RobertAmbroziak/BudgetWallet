export interface Split {
    splitId: number,
    splitName: string,
    splitDescription: string,
    splitValue: number,
    categoryId: number,
    categoryName: string,
    categoryDescription: string,
    accountSourceId: number,
    accountSourceName: string,
    accountSourceDescription: string,
    transferId: number,
    transferName: string,
    transferDescription: string,
    transferValue: number,
    transferDate: Date,
    isActive: boolean,
    orderId: number,
    percentage: number,
    transferDateFormated: string,
    splitValueFormated: string,
    transferValueFormated: string,

    isShaded: boolean | null
  }
  
import {Account} from "./account";
import {Category} from "./category";

export interface Split {
    splitId: number;
    splitName: string;
    splitDescription: string;
    splitValue: number;
    categoryId: number;
    categoryName: string;
    categoryDescription: string;
    accountSourceId: number;
    accountSourceName: string;
    accountSourceDescription: string;
    transferId: number;
    transferName: string;
    transferDescription: string;
    transferValue: number;
    transferDate: Date;
    isActive: boolean;
    orderId: number ;
    percentage: number;
    isShaded: boolean | null;
    transferDateFormated: string;
    splitValueFormated: string ;
    transferValueFormated: string;
  }
  
  export interface Transfer {
    transferId: number;
    transferName: string;
    transferDescription: string;
    transferValue: number;
    transferDate: string;
    budgetId: number;
    accountSourceId: number;
    accountSourceName: string;
    accountSourceDescription: string;
    splits: Split[];
    accounts: Account[];
    categories: Category[];
  }
  
  export interface SplitChartItem {
    periodOrderId: number;
    budgetPartSumValue: number;
    spltPartSumValue: number;
  }
  
  export interface SplitResponse {
    splits: Split[];
    splitSummary: {
      budgetValue: number;
    };
    splitChartItems: SplitChartItem[];
  }
  

  export interface ChartData {
    xAxis: { data: number[] }[];
    series: {
      showMark: boolean;
      name: string;
      data: number[];
      valueFormatter?: (value: number | null) => string;
    }[];
  }
  
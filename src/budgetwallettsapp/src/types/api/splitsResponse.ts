import { Split } from "./split";
import { SplitSummary } from "./splitSummary";
import { SplitChartItem } from "./splitChartItem";

export interface SplitsResponse {
    splits: Split[],
    splitSummary: SplitSummary,
    splitChartItems: SplitChartItem[],
    responseInFo: string,
}
import React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { ChartData } from "../../types/split";

interface Props {
  chartData: ChartData;
}

const SplitChart: React.FC<Props> = ({ chartData }) => {
  return (
    <LineChart
      xAxis={chartData.xAxis}
      series={chartData.series}
      height={200}
      margin={{ top: 10, bottom: 20 }}
    />
  );
};

export default SplitChart;

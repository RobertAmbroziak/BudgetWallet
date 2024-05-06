import { useState } from "react";
import { TransferFilter } from "../../types/api/transferFilter";
import { SplitRequest } from "../../types/api/splitRequest";
import SplitFilter from "./splitFilter";
import SplitTable from "./splitTable";

function Expenses() {
  const [showSplits, setShowSplits] = useState<boolean>(false);
  const [splitRequest, setSplitRequest] = useState<SplitRequest | null>(null);
  const [expenseFilterData, setExpenseFilterData] = useState<TransferFilter>({
    accounts: [],
    categories: [],
    budgets: null,
    budgetPeriods: null,
    currentBudgetId: 0,
  });

  const handleGetSplitsButtonClick = (
    request: SplitRequest,
    filters: TransferFilter
  ) => {
    setSplitRequest(request);
    setShowSplits(true);
    setExpenseFilterData(filters);
  };

  return (
    <div>
      <br />
      <SplitFilter onGetSplitsButtonClick={handleGetSplitsButtonClick} />
      <br />
      {showSplits && (
        <SplitTable
          splitRequest={splitRequest}
          expenseFilterData={expenseFilterData}
        />
      )}
    </div>
  );
}

export default Expenses;

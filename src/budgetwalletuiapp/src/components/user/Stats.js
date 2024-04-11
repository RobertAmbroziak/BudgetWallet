import React, { useState } from "react";
import SplitsFilter from "./SplisFilter";
import Splits from "./Splits";

function Stats() {
  const [showSplits, setShowSplits] = useState(false);
  const [splitsRequest, setSplitsRequest] = useState(null);
  const [filtersData, setFiltersData] = useState({ accounts: [], categories: [], budgetId: "" });
  const handleGetSplitsButtonClick = (request, filters) => {
    setSplitsRequest(request);
    setShowSplits(true);
    setFiltersData(filters);
  };

  return (
    <div>
      <br />
      <SplitsFilter
        onGetSplitsButtonClick={handleGetSplitsButtonClick}
      />
      <br />
      {showSplits && (
        <Splits splitsRequest={splitsRequest} filtersData={filtersData}/>
      )}
    </div>
  );
}

export default Stats;

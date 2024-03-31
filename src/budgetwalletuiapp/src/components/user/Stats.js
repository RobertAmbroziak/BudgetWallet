import React, { useState } from "react";
import SplitsFilter from "./SplisFilter";
import Splits from "./Splits";

function Stats({ jwtToken }) {
  const [showSplits, setShowSplits] = useState(false);
  const [splitsRequest, setSplitsRequest] = useState(null);
  const [filtersData, setFiltersData] = useState({ accounts: [], categories: [] });
  const handleGetSplitsButtonClick = (request, filters) => {
    setSplitsRequest(request);
    setShowSplits(true);
    setFiltersData(filters);
  };

  return (
    <div>
      <br />
      <SplitsFilter
        jwtToken={jwtToken}
        onGetSplitsButtonClick={handleGetSplitsButtonClick}
      />
      <br />
      {showSplits && (
        // <Splits jwtToken={jwtToken} splitsRequest={splitsRequest} />
        <Splits jwtToken={jwtToken} splitsRequest={splitsRequest} filtersData={filtersData}/>
      )}
    </div>
  );
}

export default Stats;

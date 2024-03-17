import React, { useState } from "react";
import SplitsFilter from "./SplisFilter";
import Splits from "./Splits";

function Stats({ jwtToken }) {
  const [showSplits, setShowSplits] = useState(false);
  const [splitsRequest, setSplitsRequest] = useState(null);
  const handleGetSplitsButtonClick = (request) => {
    setSplitsRequest(request);
    setShowSplits(true);
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
        <Splits jwtToken={jwtToken} splitsRequest={splitsRequest} />
      )}
    </div>
  );
}

export default Stats;

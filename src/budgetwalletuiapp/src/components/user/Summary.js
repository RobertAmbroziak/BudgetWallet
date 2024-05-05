import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useLanguage } from "../../LanguageContext";
import translations from "../../translations";

function Summary({ splitsSummary }) {
  const { language } = useLanguage();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "4px",
      }}
    >
      <Typography variant="summary">
        {translations[language].lbl_SumOfExpenses}: {splitsSummary.splitsValue}{" "}
        | {translations[language].lbl_BudgetValue}: {splitsSummary.budgetValue}{" "}
        | {translations[language].lbl_Percentage}: {splitsSummary.percentage}%
      </Typography>
    </Box>
  );
}

export default Summary;

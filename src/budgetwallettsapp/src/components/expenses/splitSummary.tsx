import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useLanguage } from "../../contexts/languageContext";
import translations from "../../translations";

interface SummaryProps {
  splitSummary: {
    splitsValue: number;
    budgetValue: number;
    percentage: number;
  };
}

const SplitSummary: React.FC<SummaryProps> = ({ splitSummary }) => {
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
      <Typography variant="h6">
        {translations[language].lbl_SumOfExpenses}: {splitSummary.splitsValue} |{" "}
        {translations[language].lbl_BudgetValue}: {splitSummary.budgetValue} |{" "}
        {translations[language].lbl_Percentage}: {splitSummary.percentage}%
      </Typography>
    </Box>
  );
};

export default SplitSummary;

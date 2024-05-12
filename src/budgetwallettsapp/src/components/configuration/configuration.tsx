import React from "react";
import { useLanguage } from "../../contexts/languageContext";
import translations from "../../translations";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BudgetConfiguration from "./budgetConfiguration";
import CategoryConfiguration from "./categoryConfiguration";
import AccountConfiguration from "./accountConfiguration";

function Configuration() {
  const { language } = useLanguage();
  return (
    <>
      <Accordion sx={{ my: 1, mx: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="configuration-accounts-content"
          id="configuration-accounts-header"
        >
          {translations[language].lbl_ConfigurationAccounts}
        </AccordionSummary>
        <AccordionDetails>
          <AccountConfiguration />
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ my: 1, mx: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="configuration-categories-content"
          id="configuration-categories-header"
        >
          {translations[language].lbl_ConfigurationCategories}
        </AccordionSummary>
        <AccordionDetails>
          <CategoryConfiguration />
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ my: 1, mx: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="configuration-budgets-content"
          id="configuration-budgets-header"
        >
          {translations[language].lbl_ConfigurationBudgets}
        </AccordionSummary>
        <AccordionDetails>
          <BudgetConfiguration />
        </AccordionDetails>
      </Accordion>
      <br />
    </>
  );
}

export default Configuration;

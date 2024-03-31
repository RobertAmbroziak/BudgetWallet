import React from "react";
import { useLanguage } from "../../LanguageContext";
import translations from "../../translations";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Budgets from "./Budgets.js";
import Categories from "./Categories.js";
import Accounts from "./Accounts.js";

function Configuration({ jwtToken }) {
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
          <Accounts jwtToken={jwtToken} />
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
          <Categories jwtToken={jwtToken} />
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
          <Budgets jwtToken={jwtToken} />
        </AccordionDetails>
      </Accordion>
      <br />
    </>
  );
}

export default Configuration;

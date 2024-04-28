import React, { useState, useEffect } from "react";
import config from "../../config";
import axios from "axios";
import { useLanguage } from "../../LanguageContext";
import translations from "../../translations";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import { useUser } from "../../UserContext";

function SplitsFilter({ onGetSplitsButtonClick }) {
  const { language } = useLanguage();
  const { jwtToken } = useUser();

  const [filters, setFilters] = useState({
    budgets: [],
    budgetPeriods: [],
    accounts: [],
    categories: [],
  });

  const [selectedValues, setSelectedValues] = useState({
    budgetId: "",
    budgetPeriodId: null,
    accountId: null,
    categoryId: null,
  });

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await axios.get(
          `${config.API_BASE_URL}${config.API_ENDPOINTS.FILTER}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        const defaultBudget = response.data.budgets.find(
          (budget) => budget.id === response.data.currentBudgetId
        );

        setFilters({
          budgets: response.data.budgets,
          budgetPeriods: response.data.budgetPeriods,
          accounts: response.data.accounts,
          categories: response.data.categories,
          currentBudgetId: response.data.currentBudgetId,
        });
        setSelectedValues((prevValues) => ({
          ...prevValues,
          budgetId: defaultBudget ? defaultBudget.id : 0,
        }));
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };
    fetchFilters();
  }, [jwtToken]);

  const handleDropdownChange = async (event) => {
    const { name, value } = event.target;
    setSelectedValues({
      ...selectedValues,
      [name]: value,
    });

    if (name === "budgetId") {
      try {
        const url = config.API_ENDPOINTS.BUDGET_PERIODS.replace(
          "{budgetId}",
          value
        );

        const responsePeriods = await axios.get(
          `${config.API_BASE_URL}${url}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        const budgetCategoryUrl =
          config.API_ENDPOINTS.BUDGET_CATEGORIES.replace("{budgetId}", value);

        const responseCategories = await axios.get(
          `${config.API_BASE_URL}${budgetCategoryUrl}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        setFilters((prevFilters) => ({
          ...prevFilters,
          budgetPeriods: responsePeriods.data,
          categories: responseCategories.data,
        }));

        setSelectedValues((prevValues) => ({
          ...prevValues,
          budgetPeriodId: null,
          categoryId: null,
        }));
      } catch (error) {
        console.error(
          "Error fetching budget periods or budget categories:",
          error
        );
      }
    }
  };

  const handleGetSplitsButtonClick = () => {
    if (selectedValues.budgetId > 0) {
      const splitsRequest = {
        BudgetId: selectedValues.budgetId,
        BudgetPeriodId: selectedValues.budgetPeriodId,
        CategoryId: selectedValues.categoryId,
        AccountId: selectedValues.accountId,
      };
      onGetSplitsButtonClick(splitsRequest, {
        accounts: filters.accounts,
        categories: filters.categories,
      });
    }
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="budgetSelect">
          {translations[language].lbl_budget}
        </InputLabel>
        <Select
          labelId="budgetSelect"
          id="budgetSelect"
          value={selectedValues.budgetId ?? ""}
          label="Budget"
          name="budgetId"
          onChange={handleDropdownChange}
        >
          {filters.budgets.map((budget) => (
            <MenuItem key={budget.id} value={budget.id}>
              {budget.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="budgetPeriodSelect">
          {translations[language].lbl_period}
        </InputLabel>
        <Select
          labelId="budgetPeriodSelect"
          id="budgetPeriodSelect"
          value={selectedValues.budgetPeriodId ?? ""}
          label="BudgetPeriod"
          name="budgetPeriodId"
          onChange={handleDropdownChange}
        >
          <MenuItem key={0} value={null}>
            {translations[language].itm_all}
          </MenuItem>
          {filters.budgetPeriods.map((budgetPeriod) => (
            <MenuItem key={budgetPeriod.id} value={budgetPeriod.id}>
              {budgetPeriod.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="categorySelect">
          {translations[language].lbl_category}
        </InputLabel>
        <Select
          labelId="categorySelect"
          id="categorySelect"
          value={selectedValues.categoryId ?? ""}
          label="Category"
          name="categoryId"
          onChange={handleDropdownChange}
        >
          <MenuItem key={0} value={null}>
            {translations[language].itm_all}
          </MenuItem>
          {filters.categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="accountSelect">
          {translations[language].lbl_account}
        </InputLabel>
        <Select
          labelId="accountSelect"
          id="accountSelect"
          value={selectedValues.accountId ?? ""}
          label="Account"
          name="accountId"
          onChange={handleDropdownChange}
        >
          <MenuItem key={0} value={null}>
            {translations[language].itm_all}
          </MenuItem>
          {filters.accounts.map((account) => (
            <MenuItem key={account.id} value={account.id}>
              {account.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="outlined" onClick={handleGetSplitsButtonClick}>
        {translations[language].btn_search}
      </Button>
    </div>
  );
}

export default SplitsFilter;

import React, { useState, useEffect } from "react";
import config from "../../config";
import axios from "axios";
import { useLanguage } from "../../LanguageContext";
import translations from "../../translations";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";

function SplitsFilter({ jwtToken, onGetSplitsButtonClick }) {
  const [splitsResponse, setSplitsResponse] = useState(null);
  const { language } = useLanguage();

  const [filters, setFilters] = useState({
    budgets: [],
    budgetPeriods: [],
    accounts: [],
    categories: [],
  });

  const [selectedValues, setSelectedValues] = useState({
    budgetId: 0,
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
        const response = await axios.get(
          `${config.API_BASE_URL}${config.API_ENDPOINTS.FILTER_BUDGET_PERIODS}/${value}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        setFilters((prevFilters) => ({
          ...prevFilters,
          budgetPeriods: response.data,
        }));
        setSelectedValues((prevValues) => ({
          ...prevValues,
          budgetPeriodId: null,
        }));
      } catch (error) {
        console.error("Error fetching budget periods:", error);
      }
    }
  };

  const handleGetSplitsButtonClick = () => {
    const splitsRequest = {
      BudgetId: selectedValues.budgetId,
      BudgetPeriodId: selectedValues.budgetPeriodId,
      CategoryId: selectedValues.categoryId,
      AccountId: selectedValues.accountId,
    };
    onGetSplitsButtonClick(splitsRequest);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="budgetSelect">Budżet</InputLabel>
        <Select
          labelId="budgetSelect"
          id="budgetSelect"
          value={selectedValues.budgetId}
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
        <InputLabel id="budgetPeriodSelect">Okres</InputLabel>
        <Select
          labelId="budgetPeriodSelect"
          id="budgetPeriodSelect"
          value={selectedValues.budgetPeriodId}
          label="BudgetPeriod"
          name="budgetPeriodId"
          onChange={handleDropdownChange}
        >
          <MenuItem key={0} value={null}>
            Wszystkie
          </MenuItem>
          {filters.budgetPeriods.map((budgetPeriod) => (
            <MenuItem key={budgetPeriod.id} value={budgetPeriod.id}>
              {budgetPeriod.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="categorySelect">Kategoria</InputLabel>
        <Select
          labelId="categorySelect"
          id="categorySelect"
          value={selectedValues.categoryId}
          label="Category"
          name="categoryId"
          onChange={handleDropdownChange}
        >
          <MenuItem key={0} value={null}>
            Wszystkie
          </MenuItem>
          {filters.categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="accountSelect">Konto</InputLabel>
        <Select
          labelId="accountSelect"
          id="accountSelect"
          value={selectedValues.accountId}
          label="Account"
          name="accountId"
          onChange={handleDropdownChange}
        >
          <MenuItem key={0} value={null}>
            Wszystkie
          </MenuItem>
          {filters.accounts.map((account) => (
            <MenuItem key={account.id} value={account.id}>
              {account.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="outlined" onClick={handleGetSplitsButtonClick}>Wyszukaj</Button>
    </div>
  );
}

export default SplitsFilter;

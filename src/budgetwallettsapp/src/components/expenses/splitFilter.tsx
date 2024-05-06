import React, { useState, useEffect, ChangeEvent } from "react";
import config from "../../config";
import axios from "axios";
import { useLanguage } from "../../contexts/languageContext";
import translations from "../../translations";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useUser } from "../../contexts/userContext";
import { TransferFilter } from "../../types/api/transferFilter";
import { SplitRequest } from "../../types/api/splitRequest";
import { Budget } from "../../types/api/budget";
import { BudgetPeriod } from "../../types/api/budgetPeriod";
import { Category } from "../../types/api/category";
import { Account } from "../../types/api/account";

interface Props {
  onGetSplitsButtonClick: (
    request: SplitRequest,
    filterData: TransferFilter
  ) => void;
}

const SplitFilter: React.FC<Props> = ({ onGetSplitsButtonClick }) => {
  const { language } = useLanguage();
  const { jwtToken } = useUser();

  const [filters, setFilters] = useState<TransferFilter>({
    budgets: null,
    budgetPeriods: null,
    accounts: [],
    categories: [],
    currentBudgetId: 0,
  });

  const [selectedValues, setSelectedValues] = useState<SplitRequest>({
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
          (budget: Budget) => budget.id === response.data.currentBudgetId
        );

        setFilters({
          budgets: response.data.budgets,
          budgetPeriods: response.data.budgetPeriods,
          accounts: response.data.accounts,
          categories: response.data.categories,
          currentBudgetId: response.data.currentBudgetId,
        });
        console.log(filters);
        setSelectedValues((prevValues) => ({
          ...prevValues,
          budgetId: defaultBudget ? defaultBudget.id : "",
        }));
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };
    fetchFilters();
  }, [jwtToken]);

  const handleDropdownChange = async (
    event: any
    //event: ChangeEvent<{ name?: string; value: any }>
  ) => {
    const { name, value } = event.target;
    setSelectedValues({
      ...selectedValues,
      [name as string]: value,
    });

    if (name === "budgetId") {
      try {
        const url = config.API_ENDPOINTS.BUDGET_PERIODS.replace(
          "{budgetId}",
          value as string
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
          config.API_ENDPOINTS.BUDGET_CATEGORIES.replace(
            "{budgetId}",
            value as string
          );

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
    if (selectedValues.budgetId) {
      const splitsRequest: SplitRequest = {
        budgetId: selectedValues.budgetId,
        budgetPeriodId: selectedValues.budgetPeriodId,
        categoryId: selectedValues.categoryId,
        accountId: selectedValues.accountId,
      };
      onGetSplitsButtonClick(splitsRequest, {
        budgets: filters.budgets,
        budgetPeriods: filters.budgetPeriods,
        accounts: filters.accounts,
        categories: filters.categories,
        currentBudgetId: filters.currentBudgetId,
      });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="budgetSelect">
          {translations[language].lbl_budget}
        </InputLabel>
        <Select
          labelId="budgetSelect"
          id="budgetSelect"
          value={selectedValues.budgetId}
          label="Budget"
          name="budgetId"
          onChange={handleDropdownChange}
        >
          {filters.budgets?.map((budget: Budget) => (
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
          value={selectedValues.budgetPeriodId ?? 0}
          label="BudgetPeriod"
          name="budgetPeriodId"
          onChange={handleDropdownChange}
        >
          <MenuItem key={0} value="">
            {translations[language].itm_all}
          </MenuItem>
          {filters.budgetPeriods?.map((budgetPeriod: BudgetPeriod) => (
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
          value={selectedValues.categoryId ?? 0}
          label="Category"
          name="categoryId"
          onChange={handleDropdownChange}
        >
          <MenuItem key={0} value="">
            {translations[language].itm_all}
          </MenuItem>
          {filters.categories?.map((category: Category) => (
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
          value={selectedValues.accountId ?? 0}
          label="Account"
          name="accountId"
          onChange={handleDropdownChange}
        >
          <MenuItem key={0} value="">
            {translations[language].itm_all}
          </MenuItem>
          {filters.accounts?.map((account: Account) => (
            <MenuItem key={account.id} value={account.id}>
              {account.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="outlined" onClick={handleGetSplitsButtonClick}>
        {translations[language].btn_search}
      </Button>
    </Box>
  );
};

export default SplitFilter;

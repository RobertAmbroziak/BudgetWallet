import React, { useState, useEffect } from "react";
import config from "../../config";
import axios from "axios";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLanguage } from "../../LanguageContext";
import translations from "../../translations";
import { useUser } from "../../UserContext";

dayjs.extend(utc);

function AddExpense({
  transferEdit = null,
  handleSaveTransfer = null,
  isEdit = false,
}) {
  const { jwtToken } = useUser();
  const [budgets, setBudgets] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [transferDate, setTransferDate] = useState(
    dayjs().utc().startOf("day")
  );
  const [categories, setCategories] = useState([]);
  const [budgetId, setBudgetId] = useState();
  const [transferId, setTransferId] = useState(0);
  const [accountId, setAccountId] = useState("");
  const [isValid, setIsValid] = useState({ isValid: true, errors: [] });
  const [splitRecords, setSplitRecords] = useState([
    {
      id: 0,
      categoryId: "",
      name: "",
      description: "",
      value: "",
      isActive: true,
    },
  ]);

  const { language } = useLanguage();

  const handleAddSplitRecord = () => {
    setSplitRecords([
      ...splitRecords,
      {
        id: 0,
        categoryId: "",
        name: "",
        description: "",
        value: "",
        isActive: true,
      },
    ]);
  };

  const handleDeleteSplitRecord = (index) => {
    if (splitRecords.length > 1) {
      const updatedRecords = [...splitRecords];
      updatedRecords.splice(index, 1);
      setSplitRecords(updatedRecords);
    }
  };

  const handleSplitRecordChange = (index, field, value) => {
    const updatedRecords = [...splitRecords];
    updatedRecords[index][field] = value;
    setSplitRecords(updatedRecords);
  };

  const handleAddTransferButtonClick = async () => {
    const transfer = {
      id: transferId,
      isActive: true,
      budgetId: budgetId,
      sourceAccountId: accountId,
      name: document.getElementById("transferName").value,
      description: document.getElementById("transferDescription").value,
      value: document.getElementById("transferValue").value,
      transferDate: transferDate,
      transferType: "Expense",
      splits: splitRecords.map((record) => ({
        id: record.id,
        isActive: record.isActive,
        categoryId: record.categoryId,
        name: document.getElementById(
          `splitName_${splitRecords.indexOf(record)}`
        ).value,
        description: document.getElementById(
          `splitDescription${splitRecords.indexOf(record)}`
        ).value,
        value: document.getElementById(
          `splitValue_${splitRecords.indexOf(record)}`
        ).value,
      })),
    };
    const validateNumber = (value) => {
      const regex = /^\d+(\.\d{1,2})?$/;
      return regex.test(value);
    };

    const validateNotEmpty = (value) => {
      if (typeof value === "string") {
        return value.trim() !== "";
      } else {
        return value !== undefined && value !== null;
      }
    };

    const validateGreaterThanZero = (value) => {
      return parseFloat(value) > 0;
    };

    const validateTransferFields = (transfer) => {
      const { name, value, splits } = transfer;
      const errors = [];

      if (!validateNotEmpty(budgetId)) {
        errors.push(translations[language].errValid_invalidBudgeId);
      }

      if (!validateNotEmpty(accountId)) {
        errors.push(translations[language].errValid_invalidAccountId);
      }

      if (!validateNotEmpty(name)) {
        errors.push(translations[language].errValid_transferName);
      }

      if (!validateNumber(value)) {
        errors.push(translations[language].errValid_transfeValue);
      }

      let splitsValueSum = 0;
      for (let i = 0; i < splits.length; i++) {
        const { categoryId, name, value } = splits[i];
        if (!validateGreaterThanZero(categoryId)) {
          errors.push(
            `${translations[language].errValid_invalidCategoryId} ${i + 1}.`
          );
        }
        if (!validateNotEmpty(name)) {
          errors.push(
            `${translations[language].errValid_nameOfSplit} ${i + 1} ${
              translations[language].errValid_cannotBeEmpty
            }`
          );
        }
        if (!validateNumber(value)) {
          errors.push(
            `${translations[language].errValid_valueOfSplit1} ${i + 1} ${
              translations[language].errValid_valueOfSplit2
            }}`
          );
        } else {
          splitsValueSum += parseFloat(value);
        }
      }

      if (splitsValueSum.toFixed(2) !== parseFloat(value).toFixed(2)) {
        errors.push(translations[language].errValid_sumOfSplit);
      }

      return { isValid: errors.length === 0, errors };
    };
    const validateResult = validateTransferFields(transfer);
    setIsValid(validateResult);

    const addTransferSuccessToast = () => {
      toast.success(translations[language].toast_addTransferSuccess, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        //transition: Bounce,
      });
    };

    if (validateResult.isValid && !isEdit) {
      try {
        await axios.post(
          `${config.API_BASE_URL}${config.API_ENDPOINTS.TRANSFERS}`,
          transfer,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        document.getElementById("transferName").value = "";
        document.getElementById("transferDescription").value = "";
        document.getElementById("transferValue").value = "";
        setTransferDate(dayjs().utc().startOf("day"));
        setAccountId();
        setIsValid({ isValid: true, errors: [] });
        setSplitRecords([
          {
            id: "",
            categoryId: "",
            name: "",
            description: "",
            value: "",
            isActive: true,
          },
        ]);
        addTransferSuccessToast();
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.length > 0
        ) {
          setIsValid({ isValid: false, errors: error.response.data });
        } else {
          setIsValid({ isValid: false, errors: [error.message] });
        }
      }
    } else if (validateResult.isValid && isEdit) {
      try {
        await axios.put(
          `${config.API_BASE_URL}${config.API_ENDPOINTS.TRANSFERS}`,
          transfer,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        handleSaveTransfer();
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.length > 0
        ) {
          setIsValid({ isValid: false, errors: error.response.data });
        } else {
          setIsValid({ isValid: false, errors: [error.message] });
        }
      }
    }
  };

  const handleDropdownBudgetChange = async (event) => {
    const { value } = event.target;
    setBudgetId(value);
    try {
      const url = config.API_ENDPOINTS.BUDGET_CATEGORIES.replace(
        "{budgetId}",
        value
      );
      const response = await axios.get(`${config.API_BASE_URL}${url}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching budgetCategories:", error);
    }
  };

  const handleCategoryChange = (index, value) => {
    const updatedRecords = [...splitRecords];
    updatedRecords[index].categoryId = value;

    const transferValue = document.getElementById("transferValue").value;

    if (index === 0 && transferValue) {
      updatedRecords[index].value = transferValue;
    }

    const categoryName = categories.find(
      (category) => category.id === value
    )?.name;
    if (categoryName) {
      updatedRecords[index].name = categoryName;
    }

    setSplitRecords(updatedRecords);
  };

  const handleDropdownAccountChange = (event) => {
    const { value } = event.target;
    setAccountId(value);
  };

  useEffect(() => {
    if (isEdit && transferEdit) {
      setTransferId(transferEdit.transferId);
      document.getElementById("transferName").value = transferEdit.transferName;
      document.getElementById("transferDescription").value =
        transferEdit.transferDescription;
      document.getElementById("transferValue").value =
        transferEdit.transferValue;
      setTransferDate(dayjs.utc(transferEdit.transferDate).startOf("day"));
      setAccounts(transferEdit.accounts);
      setAccountId(transferEdit.accountSourceId);
      setBudgetId(transferEdit.budgetId ?? 0);
      setCategories(transferEdit.categories);
      setSplitRecords(
        transferEdit.splits.map((split) => ({
          ...split,
        }))
      );
      return;
    }

    const fetchBudgets = async () => {
      try {
        const response = await axios.get(
          `${config.API_BASE_URL}${config.API_ENDPOINTS.BUDGETS}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        const defaultBudget = response.data.budgets.find(
          (budget) => budget.id === response.data.currentBudgetId
        );

        setBudgets(response.data.budgets);
        setCategories(response.data.currentBudgetCategories);
        setAccounts(response.data.currentBudgetAccounts);
        setBudgetId(defaultBudget ? defaultBudget.id : "");
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };
    fetchBudgets();
  }, [isEdit, transferEdit, jwtToken]);

  return (
    <>
      <ToastContainer />
      {!isValid.isValid && (
        <Paper elevation={3} sx={{ margin: "20px", color: "red" }}>
          <ul>
            {isValid.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Paper>
      )}
      <Paper elevation={3} sx={{ margin: { xs: "5px", sm: "20px" } }}>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          {!isEdit && (
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="budgetSelect">
                {translations[language].lbl_budget}
              </InputLabel>
              <Select
                labelId="budgetSelect"
                id="budgetSelect"
                value={budgetId ?? ""}
                label={translations[language].lbl_budget}
                name="budgetId"
                onChange={handleDropdownBudgetChange}
              >
                {budgets.map((budget) => (
                  <MenuItem key={budget.id} value={budget.id}>
                    {budget.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="accountSelect">
              {translations[language].lbl_account}
            </InputLabel>
            <Select
              labelId="accountSelect"
              id="accountSelect"
              value={accountId ?? ""}
              label={translations[language].lbl_account}
              name="accountId"
              onChange={handleDropdownAccountChange}
            >
              {accounts.map((account) => (
                <MenuItem key={account.id} value={account.id}>
                  {account.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            id="transferName"
            label={translations[language].txt_name}
            variant="outlined"
          />
          <TextField
            id="transferDescription"
            label={translations[language].txt_description}
            variant="outlined"
          />
          <TextField
            id="transferValue"
            label={translations[language].txt_value}
            variant="outlined"
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={translations[language].lbl_transferDate}
              value={transferDate ?? AdapterDayjs.date()}
              onChange={(newDate) => setTransferDate(newDate)}
            />
          </LocalizationProvider>
          <Button variant="outlined" onClick={handleAddTransferButtonClick}>
            {translations[language].btn_save}
          </Button>
        </Box>
      </Paper>
      <Paper
        elevation={3}
        sx={{
          margin: { xs: "5px", sm: "20px" },
          overflow: "hidden",
          padding: isEdit ? 2 : 0,
        }}
      >
        <Button variant="outlined" onClick={handleAddSplitRecord}>
          {translations[language].btn_addSplit}
        </Button>
        {splitRecords.map((record, index) => (
          <Box
            key={"key_splitBox_" + index}
            sx={{
              display: "flex",
              flexDirection: isEdit ? "column" : "row",
              "& > :not(style)": { m: 1, width: isEdit ? "100%" : "auto" },
              "@media (max-width:600px)": {
                flexDirection: "column",
              },
            }}
            noValidate
            autoComplete="off"
          >
            <IconButton
              aria-label="delete"
              onClick={() => handleDeleteSplitRecord(index)}
            >
              <DeleteIcon />
            </IconButton>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="categorySelect">
                {translations[language].lbl_category}
              </InputLabel>
              <Select
                labelId={`categorySelect_${index}`}
                id={`categorySelect_${index}`}
                value={splitRecords[index]?.categoryId ?? ""}
                label={translations[language].lbl_category}
                name={`categoryId_${index}`}
                onChange={(e) => handleCategoryChange(index, e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              id={"splitName_" + index}
              variant="outlined"
              label={translations[language].txt_name}
              value={splitRecords[index].name}
              onChange={(e) =>
                handleSplitRecordChange(index, "name", e.target.value)
              }
            />
            <TextField
              id={"splitDescription" + index}
              variant="outlined"
              label={translations[language].txt_description}
              value={record.description}
              onChange={(e) =>
                handleSplitRecordChange(index, "description", e.target.value)
              }
            />
            <TextField
              id={"splitValue_" + index}
              variant="outlined"
              label={translations[language].txt_value}
              value={splitRecords[index].value}
              onChange={(e) =>
                handleSplitRecordChange(index, "value", e.target.value)
              }
            />
          </Box>
        ))}
      </Paper>
    </>
  );
}

export default AddExpense;

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
//import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLanguage } from "../../contexts/languageContext";
import translations from "../../translations";
import { useUser } from "../../contexts/userContext";
import { Transfer, Split } from "../../types/split";
import { Budget } from "../../types/budget";
import { Category } from "../../types/category";
import { Account } from "../../types/account";
import { SelectChangeEvent } from "@mui/material";

dayjs.extend(utc);

interface AddExpenseProps {
  transferEdit?: Transfer | null;
  handleSaveTransfer?: () => void | null;
  isEdit?: boolean;
}

const AddExpense: React.FC<AddExpenseProps> = ({
  transferEdit = null,
  handleSaveTransfer = null,
  isEdit = false,
}) => {
  const { jwtToken } = useUser();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transferDate, setTransferDate] = useState<dayjs.Dayjs>(
    dayjs().utc().startOf("day")
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgetId, setBudgetId] = useState<number | null>(null);
  const [transferId, setTransferId] = useState<number | null>(null);
  const [accountId, setAccountId] = useState<number | null>(null);
  const [isValid, setIsValid] = useState<{
    isValid: boolean;
    errors: string[];
  }>({ isValid: true, errors: [] });
  const [splitRecords, setSplitRecords] = useState<Split[]>([
    {
      splitId: 0,
      categoryId: 0,
      splitName: "",
      splitDescription: "",
      splitValue: 0,
      isActive: true,
    },
  ]);

  const { language } = useLanguage();

  const handleAddSplitRecord = () => {
    setSplitRecords([
      ...splitRecords,
      {
        splitId: 0,
        categoryId: 0,
        splitName: "",
        splitDescription: "",
        splitValue: 0,
        isActive: true,
      },
    ]);
  };

  const handleDeleteSplitRecord = (index: number) => {
    if (splitRecords.length > 1) {
      const updatedRecords = [...splitRecords];
      updatedRecords.splice(index, 1);
      setSplitRecords(updatedRecords);
    }
  };

  const handleSplitRecordChange = (
    index: number,
    field: string,
    value: any
  ) => {
    const updatedRecords = [...splitRecords];
    if (field === "splitName" || field === "splitDescription") {
      updatedRecords[index][field] = value as string;
    } else if (field === "splitValue") {
      updatedRecords[index][field] = value as number;
    }

    setSplitRecords(updatedRecords);
  };

  const handleAddTransferButtonClick = async () => {
    const transfer = {
      id: transferId,
      isActive: true,
      budgetId: budgetId,
      sourceAccountId: accountId,
      name:
        (document.getElementById("transferName") as HTMLInputElement | null)
          ?.value || "",
      description:
        (
          document.getElementById(
            "transferDescription"
          ) as HTMLInputElement | null
        )?.value || "",
      value:
        (document.getElementById("transferValue") as HTMLInputElement | null)
          ?.value || "",
      transferDate: transferDate,
      transferType: "Expense",
      splits: splitRecords.map((record) => ({
        splitId: record.splitId,
        isActive: record.isActive,
        categoryId: record.categoryId,
        splitName:
          (
            document.getElementById(
              `splitName_${splitRecords.indexOf(record)}`
            ) as HTMLInputElement | null
          )?.value || "",
        splitDescription:
          (
            document.getElementById(
              `splitDescription${splitRecords.indexOf(record)}`
            ) as HTMLInputElement | null
          )?.value || "",
        splitValue: (
          document.getElementById(
            `splitValue_${splitRecords.indexOf(record)}`
          ) as HTMLInputElement | null
        )?.value
          ? parseFloat(
              (
                document.getElementById(
                  `splitValue_${splitRecords.indexOf(record)}`
                ) as HTMLInputElement
              ).value
            )
          : 0,
      })),
    };

    // const validateNumber = (value: string) => {
    //   const regex = /^\d+(\.\d{1,2})?$/;
    //   return regex.test(value);
    // };

    // const validateNotEmpty = (value: string) => {
    //   return value.trim() !== "";
    // };

    // const validateGreaterThanZero = (value: number) => {
    //   return value > 0;
    // };

    // const validateTransferFields = (transfer: Transfer) => {
    //   const { transferName, transferValue, splits } = transfer;
    //   const errors: string[] = [];

    //   if (!validateNotEmpty(transfer.budgetId)) {
    //     errors.push(translations[language].errValid_invalidBudgeId);
    //   }

    //   if (!validateNotEmpty(transfer.sourceAccountId)) {
    //     errors.push(translations[language].errValid_invalidAccountId);
    //   }

    //   if (!validateNotEmpty(name)) {
    //     errors.push(translations[language].errValid_transferName);
    //   }

    //   if (!validateNumber(value)) {
    //     errors.push(translations[language].errValid_transfeValue);
    //   }

    //   let splitsValueSum = 0;
    //   for (let i = 0; i < splits.length; i++) {
    //     const { categoryId, splitName, splitValue } = splits[i];
    //     if (!validateGreaterThanZero(splitValue)) {
    //       errors.push(
    //         `${translations[language].errValid_invalidCategoryId} ${i + 1}.`
    //       );
    //     }
    //     if (!validateNotEmpty(name)) {
    //       errors.push(
    //         `${translations[language].errValid_nameOfSplit} ${i + 1} ${
    //           translations[language].errValid_cannotBeEmpty
    //         }`
    //       );
    //     }
    //     if (!validateNumber(value)) {
    //       errors.push(
    //         `${translations[language].errValid_valueOfSplit1} ${i + 1} ${
    //           translations[language].errValid_valueOfSplit2
    //         }`
    //       );
    //     } else {
    //       splitsValueSum += parseFloat(value);
    //     }
    //   }

    //   if (splitsValueSum.toFixed(2) !== parseFloat(value).toFixed(2)) {
    //     errors.push(translations[language].errValid_sumOfSplit);
    //   }

    //   return { isValid: errors.length === 0, errors };
    // };
    // const validateResult = validateTransferFields(transfer);
    // setIsValid(validateResult);

    // const addTransferSuccessToast = () => {
    //   toast.success(translations[language].toast_addTransferSuccess, {
    //     position: "top-right",
    //     autoClose: 4000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: "colored",
    //     //transition: Bounce,
    //   });
    // };

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

        document.getElementById("transferName")?.setAttribute("value", "");
        document
          .getElementById("transferDescription")
          ?.setAttribute("value", "");
        document.getElementById("transferValue")?.setAttribute("value", "");
        setTransferDate(dayjs().utc().startOf("day"));
        setAccountId(null);
        setIsValid({ isValid: true, errors: [] });
        setSplitRecords([
          {
            splitId: 0,
            categoryId: 0,
            splitName: "",
            splitDescription: "",
            splitValue: 0,
            isActive: true,
          },
        ]);
        //addTransferSuccessToast();
      } catch (error: any) {
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
        handleSaveTransfer && handleSaveTransfer();
      } catch (error: any) {
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

  const handleDropdownBudgetChange = async (value: number) => {
    setBudgetId(value);
    try {
      const url = config.API_ENDPOINTS.BUDGET_CATEGORIES.replace(
        "{budgetId}",
        value.toString()
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

  const handleCategoryChange = (index: number, value: number) => {
    const updatedRecords = [...splitRecords];
    updatedRecords[index].categoryId = value;

    const transferValue: number =
      document.getElementById("transferValue")?.value || 0;

    if (index === 0 && transferValue) {
      updatedRecords[index].transferValue = transferValue;
    }

    const categoryName = categories.find(
      (category) => category.id === value
    )?.name;
    if (categoryName) {
      updatedRecords[index].categoryName = categoryName;
    }

    setSplitRecords(updatedRecords);
  };

  const handleDropdownAccountChange = (value: number) => {
    setAccountId(value);
  };

  useEffect(() => {
    if (isEdit && transferEdit) {
      setTransferId(transferEdit.transferId);
      document
        .getElementById("transferName")
        ?.setAttribute("value", transferEdit.transferName);
      document
        .getElementById("transferDescription")
        ?.setAttribute("value", transferEdit.transferDescription);
      document
        .getElementById("transferValue")
        ?.setAttribute("value", transferEdit.transferValue.toString());
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

        const defaultBudget: Budget = response.data.budgets.find(
          (budget: Budget) => budget.id === response.data.currentBudgetId
        );

        setBudgets(response.data.budgets);
        setCategories(response.data.currentBudgetCategories);
        setAccounts(response.data.currentBudgetAccounts);
        setBudgetId(defaultBudget ? defaultBudget.id : null);
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };
    fetchBudgets();
  }, [isEdit, transferEdit, jwtToken]);

  return (
    <>
      {/* <ToastContainer /> */}
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
                value={budgetId || ""}
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
              value={accountId || 0}
              label={translations[language].lbl_account}
              name="accountId"
              onChange={(e) =>
                handleDropdownAccountChange(Number(e.target.value))
              }
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
              value={transferDate}
              onChange={(newDate) => {
                if (newDate !== null) {
                  setTransferDate(newDate);
                }
              }}
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
                value={splitRecords[index]?.categoryId || 0}
                label={translations[language].lbl_category}
                name={`categoryId_${index}`}
                onChange={(e) =>
                  handleCategoryChange(index, Number(e.target.value))
                }
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
              value={splitRecords[index].splitName}
              onChange={(e) =>
                handleSplitRecordChange(index, "splitName", e.target.value)
              }
            />
            <TextField
              id={"splitDescription" + index}
              variant="outlined"
              label={translations[language].txt_description}
              value={record.splitDescription}
              onChange={(e) =>
                handleSplitRecordChange(
                  index,
                  "splitDescription",
                  e.target.value
                )
              }
            />
            <TextField
              id={"splitValue_" + index}
              variant="outlined"
              label={translations[language].txt_value}
              value={splitRecords[index].splitValue}
              onChange={(e) =>
                handleSplitRecordChange(index, "splitValue", e.target.value)
              }
            />
          </Box>
        ))}
      </Paper>
    </>
  );
};

export default AddExpense;

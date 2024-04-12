import React, { useState, useEffect } from "react";
import config from "../../config";
import axios from "axios";
import { useLanguage } from "../../LanguageContext";
import translations from "../../translations";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DataSaverOn } from "@mui/icons-material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import { Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BudgetPeriodCategories from "./BudgetPeriodCategories";
import { useCategories } from "./CategoriesContext";
import { useUser } from "../../UserContext";

function BudgetDetails({ budgetId, onBack, onSuccess, onError }) {
  const [isValid, setIsValid] = useState({ isValid: true, errors: [] });
  const [showInactive, setShowInactive] = useState(false);
  const [showInactive2, setShowInactive2] = useState(false);
  const { jwtToken } = useUser();
  const { categories } = useCategories();
  const { language } = useLanguage();
  const [budget, setBudget] = useState();
  const [editingBudgetPeriod, setEditingBudgetPeriod] = useState(null);
  const handleBackClick = () => {
    onBack();
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

  const isOneDayGreater = (dateFirst, dateSecond) => {
    if (!dateFirst || !dateSecond) return false;

    const date1 = new Date(dateFirst);
    const date2 = new Date(dateSecond);

    return date2 - date1 >= 86400000;
  };

  const validateBudget = (budget) => {
    const errors = [];

    if (!validateNotEmpty(budget.name)) {
      errors.push("budget name is empty");
    }

    if (!isOneDayGreater(budget.validFrom, budget.validTo)) {
      errors.push(
        "budget validTo must be minimum one day greather than budget validFrom"
      );
    }

    const activeBudgetCategories = budget.budgetCategories.filter(
      (category) => category.isActive
    );
    if (
      !budget.budgetCategories ||
      !Array.isArray(budget.budgetCategories) ||
      activeBudgetCategories.length === 0
    ) {
      errors.push(
        "budget categories cannot be empty and must contain at least one element"
      );
    } else {
      for (let index = 0; index < budget.budgetCategories.length; index++) {
        const category = budget.budgetCategories[index];
        if (category.isActive && !validateGreaterThanZero(category.maxValue)) {
          errors.push(`budget category ${index + 1} has maxValue = 0`);
        }
      }

      for (let index = 0; index < budget.budgetCategories.length; index++) {
        const category = budget.budgetCategories[index];
        if (
          category.isActive &&
          !validateGreaterThanZero(category.categoryId)
        ) {
          errors.push(`budget category ${index + 1} has no selected category`);
        }
      }
    }

    const activeBudgetPeriods = budget.budgetPeriods.filter(
      (period) => period.isActive
    );
    if (
      !budget.budgetPeriods ||
      !Array.isArray(budget.budgetPeriods) ||
      activeBudgetPeriods.length === 0
    ) {
      errors.push(
        "budget periods cannot be empty and must contain at least one element"
      );
    } else {
      for (let index = 0; index < budget.budgetPeriods.length; index++) {
        const period = budget.budgetPeriods[index];
        if (
          period.isActive &&
          !isOneDayGreater(period.validFrom, period.validTo)
        ) {
          errors.push(
            `budget period ${
              index + 1
            } validTo must be minimum one day greather than validFrom`
          );
        }
        if (period.isActive && period.validFrom < budget.validFrom) {
          errors.push(
            `budget period ${
              index + 1
            } validFrom is lower than budget validFrom`
          );
        }
        if (period.isActive && period.validTo > budget.validTo) {
          errors.push(
            `budget period ${index + 1} validTo is greather than budget validTo`
          );
        }
      }

      const indexedBudgetPeriods = budget.budgetPeriods.map(
        (period, index) => ({
          ...period,
          innerIndex: index,
        })
      );

      const sortedBudgetPeriods = indexedBudgetPeriods
        .filter((period) => period.isActive)
        .sort((a, b) => new Date(a.validFrom) - new Date(b.validFrom));

      for (let i = 0; i < sortedBudgetPeriods.length - 1; i++) {
        const currentPeriod = sortedBudgetPeriods[i];
        const nextPeriod = sortedBudgetPeriods[i + 1];

        if (currentPeriod.validTo !== nextPeriod.validFrom) {
          errors.push(
            `budget period ${
              currentPeriod.innerIndex + 1
            } validTo does not match the validFrom of the next period (${
              nextPeriod.innerIndex + 1
            })`
          );
        }
      }

      if (sortedBudgetPeriods[0].validFrom !== budget.validFrom) {
        errors.push(
          `The first budget period's validFrom (${sortedBudgetPeriods[0].validFrom}) does not match the budget's validFrom (${budget.validFrom})`
        );
      }
      if (
        sortedBudgetPeriods[sortedBudgetPeriods.length - 1].validTo !==
        budget.validTo
      ) {
        errors.push(
          `The last budget period's validTo (${
            sortedBudgetPeriods[sortedBudgetPeriods.length - 1].validTo
          }) does not match the budget's validTo (${budget.validTo})`
        );
      }

      sortedBudgetPeriods.forEach((period, index) => {
        const activePeriodCategories = period.budgetPeriodCategories
          .filter((category) => category.isActive)
          .map((category) => category.categoryId);
  
        if (activePeriodCategories.length !== activeBudgetCategories.length) {
          errors.push(
            `budget period ${
              period.innerIndex + 1
            } does not have the same number of active categories as the budget`
          );
        } else {
          const isSameCategories =
            activePeriodCategories.every((catId) =>
              activeBudgetCategories.includes(catId)
            ) &&
            activeBudgetCategories.every((catId) =>
              activePeriodCategories.includes(catId)
            );
  
          if (!isSameCategories) {
            errors.push(
              `budget period ${
                period.innerIndex + 1
              } does not have the exact same active categoryIds as the budget`
            );
          }
        }
      })
      
      const maxValueSums = new Map();
  
      activeBudgetCategories.forEach((category) => {
        maxValueSums.set(category.categoryId, 0);
      });
  
      sortedBudgetPeriods.forEach((period) => {
        period.budgetPeriodCategories
          .filter((category) => category.isActive)
          .forEach((category) => {
            if (maxValueSums.has(category.categoryId)) {
              maxValueSums.set(
                category.categoryId,
                maxValueSums.get(category.categoryId) +
                  parseFloat(category.maxValue)
              );
            }
          });
      });
  
      activeBudgetCategories.forEach((category) => {
        if (maxValueSums.get(category.categoryId) !== category.maxValue) {
          errors.push(
            `The total maxValue for category ID ${category.categoryId} across all budget periods does not match the budget category maxValue (${category.maxValue})`
          );
        }
      });
    }

    return { isValid: errors.length === 0, errors };
  };

  const handleBudgetSave = async () => {
    const validateResult = validateBudget(budget);
    setIsValid(validateResult);
    if (!isValid.isValid) return;

    try {
       await axios.put(
        `${config.API_BASE_URL}${config.API_ENDPOINTS.BUDGETS}`,
        budget,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      onSuccess(translations[language].toast_updateBudgetsSuccess);
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
      onError(translations[language].toast_updateBudgetsError);

    }
  };

  const updateBudgetPeriod = (updatedPeriod) => {
    setBudget((prevBudget) => {
      const updatedBudgetPeriods = prevBudget.budgetPeriods.map((period) => {
        if (period.id === updatedPeriod.id) {
          return updatedPeriod;
        }
        return period;
      });

      return { ...prevBudget, budgetPeriods: updatedBudgetPeriods };
    });

    setEditingBudgetPeriod(null);
  };

  const editBudgetPeriod = (record) => {
    setEditingBudgetPeriod(record);
  };

  const handleAddBudgetCategoryRecord = () => {
    if (budget) {
      const newBudgetCategory = {
        id: 0,
        categoryId: "",
        maxValue: "",
        isActive: true,
      };

      setBudget((prevBudget) => ({
        ...prevBudget,
        budgetCategories: [...prevBudget.budgetCategories, newBudgetCategory],
      }));
    }
  };

  const handleAddBudgetPeriodRecord = () => {
    if (budget) {
      const newBudgetPeriod = {
        id: 0,
        validFrom: "",
        validTo: "",
        isActive: true,
      };

      setBudget((prevBudget) => ({
        ...prevBudget,
        budgetPeriods: [...prevBudget.budgetPeriods, newBudgetPeriod],
      }));
    }
  };

  const handleBudgetChange = (name, value) => {
    if (budget) {
      let updatedBudget = { ...budget };
      updatedBudget[name] = value;
      setBudget(updatedBudget);
    }
  };

  const handleBudgetCategoryChange = (index, name, value) => {
    if (budget && budget.budgetCategories) {
      let updatedBudget = { ...budget };

      if (name === "isActive" && value === false) {
        if (updatedBudget.budgetCategories[index].id > 0) {
          updatedBudget.budgetCategories[index][name] = value;
        } else {
          updatedBudget.budgetCategories =
            updatedBudget.budgetCategories.filter((_, i) => i !== index);
        }
      } else {
        if (updatedBudget.budgetCategories[index]) {
          updatedBudget.budgetCategories[index][name] = value;
        }
      }

      setBudget(updatedBudget);
    }
  };

  const handleBudgetPeriodChange = (index, name, value) => {
    if (budget && budget.budgetPeriods) {
      let updatedBudget = { ...budget };

      if (name === "isActive" && value === false) {
        if (updatedBudget.budgetPeriods[index].id > 0) {
          updatedBudget.budgetPeriods[index][name] = value;
        } else {
          updatedBudget.budgetPeriods = updatedBudget.budgetPeriods.filter(
            (_, i) => i !== index
          );
        }
      } else {
        if (updatedBudget.budgetPeriods[index]) {
          updatedBudget.budgetPeriods[index][name] = value;
        }
      }

      setBudget(updatedBudget);
    }
  };

  useEffect(() => {
    const fetchBudgetDetails = async () => {
      try {
        const response = await axios.get(
          `${config.API_BASE_URL}${config.API_ENDPOINTS.BUDGETS}/${budgetId}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        setBudget(response.data);
      } catch (error) {
        console.error("Error fetching budget", error);
      }
    };
    fetchBudgetDetails();
  }, [budgetId, jwtToken]);

  if (editingBudgetPeriod) {
    return (
      <BudgetPeriodCategories
        budgetPeriod={editingBudgetPeriod}
        onBack={updateBudgetPeriod}
      />
    );
  }

  return (
    <div>
      Detale budżetu: {budgetId}
      <Button onClick={handleBackClick} variant="outlined">
        Powrót
      </Button>
      {!isValid.isValid && (
        <Paper elevation={3} sx={{ margin: "20px", color: "red" }}>
          <ul>
            {isValid.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Paper>
      )}
      {budget && (
        <>
          <Paper elevation={3} sx={{ margin: { xs: "5px", sm: "20px" } }}>
            <Box
              component="form"
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                gap: "20px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                flexWrap: "wrap",
              }}
              noValidate
              autoComplete="off"
            >
              <Typography
                variant="h6"
                component="h2"
                sx={{ marginBottom: "20px" }}
              >
                Szczegóły budżetu
              </Typography>
              <TextField
                id="budgetName"
                label={translations[language].txt_name}
                variant="outlined"
                value={budget.name}
                onChange={(e) => handleBudgetChange("name", e.target.value)}
              />
              <TextField
                id="budgetDescription"
                label={translations[language].txt_description}
                variant="outlined"
                value={budget.description}
                onChange={(e) =>
                  handleBudgetChange("description", e.target.value)
                }
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={translations[language].lbl_budgetValidFromDate}
                  value={dayjs(budget.validFrom).startOf('day')}
                  onChange={(newDate) =>
                    handleBudgetChange("validFrom", newDate)
                  }
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={translations[language].lbl_budgetValidToDate}
                  value={dayjs(budget.validTo).startOf('day')}
                  onChange={(newDate) => handleBudgetChange("validTo", newDate)}
                />
              </LocalizationProvider>
              <Button onClick={handleBudgetSave} variant="outlined">
                ZAPISZ
              </Button>
            </Box>
          </Paper>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              justifyContent: "center",
              alignItems: "flex-start",
              height: { sm: "100%" },
            }}
          >
            <Accordion sx={{ width: { xs: "auto", sm: "50%" }, my: 1, mx: 2 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="budgetDetails-budgetCategories-content"
                id="budgetDetails-budgetCategories-header"
              >
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ marginBottom: "10px" }}
                >
                  Lista Budget Categories
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Paper
                  elevation={3}
                  sx={{
                    margin: { xs: "5px", sm: "5px" },
                    padding: { xs: "5px", sm: "10px" },
                    overflow: "hidden",
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={handleAddBudgetCategoryRecord}
                  >
                    {translations[language].btn_addBudgetCategory}
                  </Button>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={showInactive}
                        onChange={(e) => setShowInactive(e.target.checked)}
                      />
                    }
                    label={translations[language].cbx_ShowInactive}
                  />
                  {budget.budgetCategories.map((record, index) => (
                    <Box
                      key={"key_budgetCategoryBox_" + index}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "3px",
                        gap: { xs: "5px", sm: "20px" },
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        flexWrap: "wrap",
                        width: "calc(100% - 4px)",
                        margin: "2px",
                        visibility:
                          !record.isActive && !showInactive
                            ? "hidden"
                            : "visible",
                        position:
                          !record.isActive && !showInactive
                            ? "absolute"
                            : "relative",
                        height: !record.isActive && !showInactive ? 0 : "auto",
                        overflow:
                          !record.isActive && !showInactive
                            ? "hidden"
                            : "visible",
                      }}
                      noValidate
                      autoComplete="off"
                    >
                      {record.isActive ? (
                        <IconButton
                          aria-label="delete"
                          onClick={() =>
                            handleBudgetCategoryChange(index, "isActive", false)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      ) : (
                        <IconButton
                          aria-label="restore"
                          onClick={() =>
                            handleBudgetCategoryChange(index, "isActive", true)
                          }
                        >
                          <DataSaverOn />
                        </IconButton>
                      )}
                      <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="categorySelect">
                          {translations[language].lbl_category}
                        </InputLabel>
                        <Select
                          labelId={`categorySelect_${index}`}
                          id={`categorySelect_${index}`}
                          value={
                            budget.budgetCategories[index]?.categoryId ?? ""
                          }
                          label={translations[language].lbl_category}
                          name={`categoryId_${index}`}
                          onChange={(e) =>
                            handleBudgetCategoryChange(
                              index,
                              "categoryId",
                              e.target.value
                            )
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
                        id={"budgetCategoryValue_" + index}
                        label={translations[language].txt_value}
                        variant="outlined"
                        value={record.maxValue}
                        onChange={(e) =>
                          handleBudgetCategoryChange(
                            index,
                            "maxValue",
                            e.target.value
                          )
                        }
                        sx={{
                          width: "auto",
                          flexGrow: 1,
                          maxWidth: { xs: "150px", sm: "200px" },
                        }}
                      />
                    </Box>
                  ))}
                </Paper>
              </AccordionDetails>
            </Accordion>
            <Accordion sx={{ width: { xs: "auto", sm: "50%" }, my: 1, mx: 2 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="budgetDetails-budgetPeriods-content"
                id="budgetDetails-budgetPeriods-header"
              >
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ marginBottom: "10px" }}
                >
                  Lista Budget Periods
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Paper
                  elevation={3}
                  sx={{
                    margin: { xs: "5px", sm: "5px" },
                    padding: { xs: "5px", sm: "10px" },
                    overflow: "hidden",
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={handleAddBudgetPeriodRecord}
                  >
                    {translations[language].btn_addBudgetPeriod}
                  </Button>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={showInactive2}
                        onChange={(e) => setShowInactive2(e.target.checked)}
                      />
                    }
                    label={translations[language].cbx_ShowInactive}
                  />
                  {budget.budgetPeriods.map((record, index) => (
                    <Box
                      key={"key_budgetPeriodBox_" + index}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "3px",
                        gap: { xs: "5px", sm: "20px" },
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        flexWrap: "wrap",
                        width: "calc(100% - 4px)",
                        margin: "2px",
                        visibility:
                          !record.isActive && !showInactive2
                            ? "hidden"
                            : "visible",
                        position:
                          !record.isActive && !showInactive2
                            ? "absolute"
                            : "relative",
                        height: !record.isActive && !showInactive2 ? 0 : "auto",
                        overflow:
                          !record.isActive && !showInactive2
                            ? "hidden"
                            : "visible",
                      }}
                      noValidate
                      autoComplete="off"
                    >
                      {record.isActive ? (
                        <IconButton
                          aria-label="delete"
                          onClick={() =>
                            handleBudgetPeriodChange(index, "isActive", false)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      ) : (
                        <IconButton
                          aria-label="restore"
                          onClick={() =>
                            handleBudgetPeriodChange(index, "isActive", true)
                          }
                        >
                          <DataSaverOn />
                        </IconButton>
                      )}
                      <IconButton
                        aria-label="edit"
                        onClick={() => editBudgetPeriod(record)}
                      >
                        <EditIcon />
                      </IconButton>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label={translations[language].lbl_budgetValidFromDate}
                          value={dayjs(record.validFrom).startOf('day')}
                          onChange={(newDate) =>
                            handleBudgetPeriodChange("validFrom", newDate)
                          }
                          sx={{ m: 1 }}
                        />
                      </LocalizationProvider>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label={translations[language].lbl_budgetValidToDate}
                          value={dayjs(record.validTo).startOf('day')}
                          onChange={(newDate) =>
                            handleBudgetPeriodChange("validTo", newDate)
                          }
                        />
                      </LocalizationProvider>
                    </Box>
                  ))}
                </Paper>
              </AccordionDetails>
            </Accordion>
          </Box>
        </>
      )}
    </div>
  );
}

export default BudgetDetails;

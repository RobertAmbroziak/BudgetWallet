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

function BudgetDetails({ budgetId, onBack }) {
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

  const editBudgetPeriod = (record) => {
    setEditingBudgetPeriod(record);
  };

  const onBudgetPeriodCategoryChange = (
    // ta metoda musi nie tylko przyjmować zmiany naistniejących budgetPeriodCategory
    // ale również dodawać nowe do kolekcji
    // usuwać te z id = 0
    budgetPeriodCategoryId,
    name,
    value
  ) => {
    let updatedBudget = {
      ...budget,
      budgetPeriods: budget.budgetPeriods.map((period) => ({
        ...period,
        budgetPeriodCategories: period.budgetPeriodCategories.map(
          (category) => ({ ...category })
        ),
      })),
    };

    updatedBudget.budgetPeriods.forEach((period) => {
      period.budgetPeriodCategories.forEach((category) => {
        if (category.id === budgetPeriodCategoryId) {
          category[name] = value;
        }
      });

      if (budgetPeriodCategoryId === 0) {
        period.budgetPeriodCategories.push(budgetPeriodCategoryId);
      }
    });

    setBudget(updatedBudget);
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


  const setBudgetValidFromDate = (validFrom) => {};

  const setBudgetValidToDate = (validTo) => {};

  const setBudgetPeriodValidFromDate = (validFrom) => {};

  const setBudgetPeriodValidToDate = (validTo) => {};

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
          updatedBudget.budgetPeriods =
            updatedBudget.budgetPeriods.filter((_, i) => i !== index);
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
  }, []);

  if (editingBudgetPeriod) {
    return (
      <BudgetPeriodCategories
        budgetPeriod={editingBudgetPeriod}
        onBudgetPeriodCategoryChange={onBudgetPeriodCategoryChange}
      />
    );
  }

  return (
    <div>
      Detale budżetu: {budgetId}
      <Button onClick={handleBackClick} variant="outlined">
        Powrót
      </Button>
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
              />
              <TextField
                id="budgetDescription"
                label={translations[language].txt_description}
                variant="outlined"
                value={budget.description}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={translations[language].lbl_budgetValidFromDate}
                  value={dayjs(budget.validFrom)}
                  onChange={(newDate) => setBudgetValidFromDate(newDate)}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={translations[language].lbl_budgetValidToDate}
                  value={dayjs(budget.validTo)}
                  onChange={(newDate) => setBudgetValidToDate(newDate)}
                />
              </LocalizationProvider>
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
                          value={dayjs(record.validFrom)}
                          onChange={(newDate) =>
                            setBudgetPeriodValidFromDate(newDate)
                          }
                          sx={{ m: 1 }}
                        />
                      </LocalizationProvider>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label={translations[language].lbl_budgetValidToDate}
                          value={dayjs(record.validTo)}
                          onChange={(newDate) =>
                            setBudgetPeriodValidToDate(newDate)
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

import React, { useState, useEffect } from "react";
import config from "../../config";
import axios from "axios";
import { useLanguage } from "../../contexts/languageContext";
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
//import BudgetPeriodCategories from "./budgetPeriodCategories";
import { useCategories } from "../../contexts/categoryContext";
import { useUser } from "../../contexts/userContext";
import utc from "dayjs/plugin/utc";
import { Budget } from "../../types/api/budget";
import { Category } from "../../types/api/category";
import { BudgetPeriod } from "../../types/api/budgetPeriod";
import { BudgetPeriodCategory } from "../../types/api/budgetPeriodCategory";
import { BudgetCategory } from "../../types/api/budgetCategory";
import { useSnackbar } from "../../contexts/toastContext";
import { AxiosError } from "axios";

dayjs.extend(utc);

interface BudgetDetailsProps {
  simpleBudget: Budget;
  onBack: () => void;
}

const BudgetDetails: React.FC<BudgetDetailsProps> = ({
  simpleBudget,
  onBack,
}) => {
  const [isValid, setIsValid] = useState<{
    isValid: boolean;
    errors: string[];
  }>({
    isValid: true,
    errors: [],
  });
  const [showInactive, setShowInactive] = useState(false);
  const [showInactive2, setShowInactive2] = useState(false);
  const { jwtToken } = useUser();
  const { categories } = useCategories();
  const { language } = useLanguage();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [editingBudgetPeriod, setEditingBudgetPeriod] =
    useState<BudgetPeriod | null>(null);
  const [editingBudgetPeriodIndex, setEditingBudgetPeriodIndex] = useState<
    number | null
  >(null);
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const { openSnackbar } = useSnackbar();

  const handleBackClick = () => {
    onBack();
  };

  const handleBudgetSave = async () => {
    try {
      const response = await axios.put(
        `${config.API_BASE_URL}${config.API_ENDPOINTS.BUDGETS}`,
        budget,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      setIsValid({ isValid: true, errors: [] });
      openSnackbar(translations[language].toast_updateBudgetsSuccess);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<any>;
        if (
          axiosError.response &&
          axiosError.response.data &&
          axiosError.response.data.length > 0
        ) {
          setIsValid({ isValid: false, errors: axiosError.response.data });
        } else {
          setIsValid({ isValid: false, errors: [axiosError.message] });
        }
        openSnackbar(translations[language].toast_updateBudgetsError);
      } else {
        console.error("Unhandled error:", error);
      }
    }
  };

  const updateBudgetPeriod = (
    updatedPeriod: BudgetPeriod,
    updatedPeriodIndex: number
  ) => {
    setBudget((prevBudget) => {
      if (!prevBudget) {
        return prevBudget;
      }
      const updatedBudgetPeriods = prevBudget?.budgetPeriods.map(
        (period, index) => {
          if (period.id > 0 && period.id === updatedPeriod.id) {
            return updatedPeriod;
          } else if (period.id === 0 && index === updatedPeriodIndex) {
            return updatedPeriod;
          }
          return period;
        }
      );

      return { ...prevBudget, budgetPeriods: updatedBudgetPeriods };
    });

    setEditingBudgetPeriod(null);
    setEditingBudgetPeriodIndex(null);
  };

  const editBudgetPeriod = (record: BudgetPeriod, index: number) => {
    setEditingBudgetPeriod(record);
    setEditingBudgetPeriodIndex(index);
  };

  const handleAddBudgetCategoryRecord = () => {
    if (budget) {
      const newBudgetCategory: BudgetCategory = {
        id: 0,
        budgetId: budget.id,
        categoryId: 0,
        maxValue: 0,
        isActive: true,
        category: { id: 0, name: "", description: "", isActive: false },
      };

      setBudget((prevBudget) => {
        if (!prevBudget) return null;
        const updatedBudgetCategories = [
          ...(prevBudget.budgetCategories ?? []),
          newBudgetCategory,
        ];
        const updatedBudget: Budget = {
          ...prevBudget,
          budgetCategories: updatedBudgetCategories,
        };
        return updatedBudget;
      });
    }
  };

  const handleAlignBudgetPeriods = () => {
    if (!budget) return;

    const updatedBudget = { ...budget };
    updatedBudget.budgetPeriods = updatedBudget.budgetPeriods.map((period) => {
      const newPeriodCategories = [...period.budgetPeriodCategories];

      updatedBudget.budgetCategories.forEach((category) => {
        let sameCategoryPeriods = newPeriodCategories.filter(
          (pCat) => pCat.categoryId === category.categoryId
        );

        if (sameCategoryPeriods.length === 0 && category.isActive) {
          newPeriodCategories.push({
            id: 0,
            budgetPeriodId: period.id,
            categoryId: category.categoryId,
            isActive: category.isActive,
            maxValue: 0,
            category: { id: 0, name: "", description: "", isActive: false },
          });
          sameCategoryPeriods = newPeriodCategories.filter(
            (pCat) => pCat.categoryId === category.categoryId
          );
        }

        if (sameCategoryPeriods.length > 0) {
          const eachValue = (
            category.maxValue / sameCategoryPeriods.length
          ).toFixed(2);
          let totalAssigned = 0;

          sameCategoryPeriods.forEach((pCat, index) => {
            pCat.isActive = category.isActive;

            if (index === sameCategoryPeriods.length - 1) {
              pCat.maxValue = Number(
                (category.maxValue - totalAssigned).toFixed(2)
              );
            } else {
              pCat.maxValue = Number(eachValue);
              totalAssigned += parseFloat(eachValue);
            }
          });
        }
      });
      return { ...period, budgetPeriodCategories: newPeriodCategories };
    });
    setBudget(updatedBudget);
  };

  const handleAddBudgetPeriodRecord = () => {
    if (budget) {
      const utcNow = dayjs().utc().startOf("day").toDate();
      const newBudgetPeriod: BudgetPeriod = {
        id: 0,
        budgetId: 0,
        name: "",
        validFrom: utcNow,
        validTo: utcNow,
        isActive: true,
        budgetPeriodCategories: [],
      };

      setBudget((prevBudget) => {
        if (!prevBudget) return null;
        const updatedBudgetPeriods = [
          ...(prevBudget.budgetPeriods ?? []),
          newBudgetPeriod,
        ];
        const updatedBudget: Budget = {
          ...prevBudget,
          budgetPeriods: updatedBudgetPeriods,
        };
        return updatedBudget;
      });
    }
  };

  const handleBudgetChange = (name: string, value: any) => {
    if (name === "validFrom" || name === "validTo") {
      const utcDate = value ? dayjs(value).utc().startOf("day").toDate() : null;
      setBudget((prevBudget) => {
        if (prevBudget === null) return null;
        return {
          ...prevBudget,
          [name]: utcDate,
        };
      });
    } else {
      setBudget((prevBudget) => {
        if (prevBudget === null) return null;
        return {
          ...prevBudget,
          [name]: value,
        };
      });
    }
  };

  const handleBudgetCategoryChange = (
    index: number,
    name: string,
    value: any
  ) => {
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
          if (name === "categoryId" || name === "maxValue")
            updatedBudget.budgetCategories[index][name] = value as number;
        }
      }

      setBudget(updatedBudget);
    }
  };

  const handleBudgetPeriodChange = (
    index: number,
    name: string,
    value: any
  ) => {
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
        if (name === "validFrom" || name === "validTo") {
          const utcDate = value
            ? dayjs(value).utc().startOf("day").toDate()
            : null;
          if (updatedBudget.budgetPeriods[index]) {
            updatedBudget.budgetPeriods[index][name] = utcDate ?? new Date();
          }
        } else {
          if (updatedBudget.budgetPeriods[index]) {
            if (name === "isActive")
              updatedBudget.budgetPeriods[index][name] = value as boolean;
          }
        }
      }
      setBudget(updatedBudget);
    }
  };

  useEffect(() => {
    const fetchBudgetDetails = async () => {
      try {
        const response = await axios.get(
          `${config.API_BASE_URL}${config.API_ENDPOINTS.BUDGETS}/${simpleBudget.id}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        const budget: Budget = response.data;
        setBudget(budget);

        const activeCategories = categories.filter((cat) => cat.isActive);
        const additionalCategories = budget.budgetCategories.reduce(
          (acc: Category[], cat: BudgetCategory) => {
            if (
              !activeCategories.concat(acc).some((c) => c.id === cat.categoryId)
            ) {
              acc.push({
                id: cat.categoryId,
                name: cat.category.name,
                description: cat.category.description,
                isActive: cat.category.isActive,
              });
            }
            return acc;
          },
          []
        );

        setFilteredCategories([...activeCategories, ...additionalCategories]);
      } catch (error) {
        console.error("Error fetching budget", error);
      }
    };
    if (simpleBudget.id > 0) {
      fetchBudgetDetails();
    } else {
      const activeCategories = categories.filter((cat) => cat.isActive);
      setFilteredCategories(activeCategories);
      setBudget({
        ...simpleBudget,
        budgetCategories:
          simpleBudget.budgetCategories?.length > 0
            ? simpleBudget.budgetCategories
            : [],
        budgetPeriods:
          simpleBudget.budgetPeriods?.length > 0
            ? simpleBudget.budgetPeriods
            : [],
      });
    }
  }, [simpleBudget.id, jwtToken, categories]);

  //   if (editingBudgetPeriod) {
  //     return (
  //       <BudgetPeriodCategories
  //         budgetPeriod={editingBudgetPeriod}
  //         budgetPeriodIndex={editingBudgetPeriodIndex}
  //         categories={filteredCategories}
  //         onBack={updateBudgetPeriod}
  //       />
  //     );
  //   }

  return (
    <div>
      {translations[language].lbl_budgetDetails}
      <Button onClick={handleBackClick} variant="outlined">
        {translations[language].btn_back}
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
                {translations[language].lbl_budgetDetails}
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
                  value={dayjs.utc(budget.validFrom).startOf("day")}
                  onChange={(newDate) =>
                    handleBudgetChange("validFrom", newDate)
                  }
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={translations[language].lbl_budgetValidToDate}
                  value={dayjs.utc(budget.validTo).startOf("day")}
                  onChange={(newDate) => handleBudgetChange("validTo", newDate)}
                />
              </LocalizationProvider>
              <Button onClick={handleBudgetSave} variant="outlined">
                {translations[language].btn_save}
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
                  {translations[language].lbl_budgetCategoryList}
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
                          {filteredCategories.map((category) => (
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
                  {translations[language].lbl_budgetPeriodList}
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
                  <Button variant="outlined" onClick={handleAlignBudgetPeriods}>
                    {translations[language].btn_alignBudgetPeriods}
                  </Button>
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
                        onClick={() => editBudgetPeriod(record, index)}
                      >
                        <EditIcon />
                      </IconButton>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label={translations[language].lbl_budgetValidFromDate}
                          value={dayjs.utc(record.validFrom).startOf("day")}
                          onChange={(newDate) =>
                            handleBudgetPeriodChange(
                              index,
                              "validFrom",
                              newDate
                            )
                          }
                          sx={{ m: 1 }}
                        />
                      </LocalizationProvider>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label={translations[language].lbl_budgetValidToDate}
                          value={dayjs.utc(record.validTo).startOf("day")}
                          onChange={(newDate) =>
                            handleBudgetPeriodChange(index, "validTo", newDate)
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
};

export default BudgetDetails;

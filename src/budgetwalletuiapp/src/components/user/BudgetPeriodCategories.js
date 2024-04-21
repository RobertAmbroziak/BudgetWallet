import React, { useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { DataSaverOn } from "@mui/icons-material";
import { useLanguage } from "../../LanguageContext";
import translations from "../../translations";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";

function BudgetPeriodCategories({ budgetPeriod, budgetPeriodIndex, categories, onBack }) {
  const [thisBudgetPeriod, setBudgetPeriod] = useState(budgetPeriod);
  const [thisBudgetPeriodIndex, setBudgetPeriodIndex] = useState(budgetPeriodIndex);
  const [showInactive, setShowInactive] = useState(false);
  const { language } = useLanguage();

  const handleBack = () => {
    onBack(thisBudgetPeriod, thisBudgetPeriodIndex);
  };

  const handleBudgetPeriodCategoryChange = (index, name, value) => {
    if (thisBudgetPeriod) {
      let updatedBudgetPeriod = { ...thisBudgetPeriod };

      if (name === "isActive" && value === false) {
        if (updatedBudgetPeriod.budgetPeriodCategories[index].id > 0) {
          updatedBudgetPeriod.budgetPeriodCategories[index][name] = value;
        } else {
          updatedBudgetPeriod.budgetPeriodCategories =
            updatedBudgetPeriod.budgetPeriodCategories.filter(
              (_, i) => i !== index
            );
        }
      } else {
        if (updatedBudgetPeriod.budgetPeriodCategories[index]) {
          updatedBudgetPeriod.budgetPeriodCategories[index][name] = value;
        }
      }

      setBudgetPeriod(updatedBudgetPeriod);
    }
  };

  const handleAddBudgetPeriodCategoryRecord = () => {

    const newBudgetPeriodCategory = {
      id: 0,
      budgetPeriodId: budgetPeriod.id,
      categoryId: "",
      maxValue: "",
      isActive: true,
    };

    setBudgetPeriod((prevBudgetPeriod) => ({
      ...prevBudgetPeriod,
      budgetPeriodCategories: [...prevBudgetPeriod.budgetPeriodCategories, newBudgetPeriodCategory],
    }));
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleAddBudgetPeriodCategoryRecord}>
        {translations[language].btn_addBudgetPeriodCategory}
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
      <Button onClick={handleBack} variant="outlined">
      Powrót
    </Button>
      {thisBudgetPeriod.budgetPeriodCategories.map((record, index) => (
        <Box
          key={"key_budgetPeriodCategoryBox_" + index}
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
              !record.isActive && !showInactive ? "hidden" : "visible",
            position:
              !record.isActive && !showInactive ? "absolute" : "relative",
            height: !record.isActive && !showInactive ? 0 : "auto",
            overflow: !record.isActive && !showInactive ? "hidden" : "visible",
          }}
          noValidate
          autoComplete="off"
        >
          <IconButton
            aria-label={record.isActive ? "delete" : "restore"}
            onClick={() =>
              handleBudgetPeriodCategoryChange(
                index,
                "isActive",
                !record.isActive
              )
            }
          >
            {record.isActive ? <DeleteIcon /> : <DataSaverOn />}
          </IconButton>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id={`categorySelectLabel_${index}`}>
              {translations[language].lbl_category}
            </InputLabel>
            <Select
              labelId={`categorySelectLabel_${index}`}
              id={`categorySelect_${index}`}
              value={record.categoryId ?? ""}
              label={translations[language].lbl_category}
              name={`categoryId_${index}`}
              onChange={(e) =>
                handleBudgetPeriodCategoryChange(
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
            id={`budgetPeriodCategoryValue_${index}`}
            label={translations[language].txt_value}
            variant="outlined"
            value={record.maxValue || ""}
            sx={{
              width: "auto",
              flexGrow: 1,
              maxWidth: { xs: "150px", sm: "200px" },
            }}
            onChange={(e) =>
              handleBudgetPeriodCategoryChange(
                index,
                "maxValue",
                e.target.value
              )
            }
          />
        </Box>
      ))}
    </div>
  );
}

export default BudgetPeriodCategories;

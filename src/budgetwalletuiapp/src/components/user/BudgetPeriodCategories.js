import React, {useState} from "react";
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
import { useUser } from '../../UserContext';
import { useCategories } from './CategoriesContext';

function BudgetPeriodCategories({ budgetPeriod, onBudgetPeriodCategoryChange }) {
  const [showInactive, setShowInactive] = useState(false);
  const { categories } = useCategories();
  const { jwtToken } = useUser(); 
  const { language } = useLanguage();
  const handleBudgetPeriodCategoryChange = (index, name, value) => {
    onBudgetPeriodCategoryChange(index, name, value);
  };

  

  return (
    <div>
      {budgetPeriod.budgetPeriodCategories.map((record, index) => (
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

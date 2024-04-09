import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import { useLanguage } from "../../LanguageContext";
import translations from "../../translations";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataSaverOn } from "@mui/icons-material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useCategories } from './CategoriesContext';
import { useUser } from '../../UserContext';

function Categories({ onSuccess, onError }) {
  const { jwtToken } = useUser(); 
  const { language } = useLanguage();
  const { categories: globalCategories, fetchCategories, updateCategories: updateGlobalCategories } = useCategories();
  const [localCategories, setLocalCategories] = useState([]);
  const [showInactive, setShowInactive] = useState(false);
  
  useEffect(() => {
    setLocalCategories(globalCategories);
  }, [globalCategories]);

  const handleCategoryRecordChange = (index, field, value) => {
    const updatedRecords = [...localCategories];
    updatedRecords[index][field] = value;
    setLocalCategories(updatedRecords);
  };

  const handleDeleteCategoryRecord = (index) => {
    const updatedRecords = [...localCategories];
    if (updatedRecords[index].id > 0) {
      updatedRecords[index].isActive = false;
    } else {
      updatedRecords.splice(index, 1);
    }
    setLocalCategories(updatedRecords);
  };

  const handleRestoreCategoryRecord = (index, field, value) => {
    const updatedRecords = [...localCategories];
    updatedRecords[index][field] = value;
    setLocalCategories(updatedRecords);
  };

  const handleAddCategoryRecord = () => {
    const newCategory = { id: 0, name: "", description: "", isActive: true };
    setLocalCategories([...localCategories, newCategory]);
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(
        `${config.API_BASE_URL}${config.API_ENDPOINTS.CATEGORIES}`,
        localCategories,
        { headers: { Authorization: `Bearer ${jwtToken}` } }
      );
      updateGlobalCategories(localCategories);
      onSuccess(translations[language].toast_updateCategoriesSuccess);
    } catch (error) {
      console.error("Failed to save categories:", error);
      onError(translations[language].toast_updateCategoriesError);
    }
  };

  const handleGetDefault = async () => {
    try {
      const response = await axios.post(
        `${config.API_BASE_URL}${config.API_ENDPOINTS.CATEGORIES}/default`,
        {},
        { headers: { Authorization: `Bearer ${jwtToken}` } }
      );
      setLocalCategories([...localCategories, ...response.data]);
    } catch (error) {
      console.error("Error fetching default categories:", error);
    }
  };

  return (
    <>
      <Button variant="outlined" onClick={handleAddCategoryRecord}>
        {translations[language].btn_addCategory}
      </Button>
      <Button variant="outlined" onClick={handleSaveChanges}>
        {translations[language].btn_save}
      </Button>
      <Button variant="outlined" onClick={handleGetDefault}>
        {translations[language].btn_Default}
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
      {localCategories.map((record, index) => (
        <Box
          key={`key_categoryBox_${index}`}
          sx={{
            display: "flex",
            flexDirection: "row",
            "& > :not(style)": { m: 1, width: "auto" },
            "@media (max-width:600px)": {
              flexDirection: "column",
            },
            visibility: !record.isActive && !showInactive ? "hidden" : "visible",
            position: !record.isActive && !showInactive ? "absolute" : "relative",
            height: !record.isActive && !showInactive ? 0 : "auto",
            overflow: !record.isActive && !showInactive ? "hidden" : "visible",
          }}
          noValidate
          autoComplete="off"
        >
          {record.isActive ? (
            <IconButton
              aria-label="delete"
              onClick={() => handleDeleteCategoryRecord(index)}
            >
              <DeleteIcon />
            </IconButton>
          ) : (
            <IconButton
              aria-label="restore"
              onClick={() => handleRestoreCategoryRecord(index, "isActive", true)}
            >
              <DataSaverOn />
            </IconButton>
          )}

          <TextField
            id={`categoryName_${index}`}
            variant="outlined"
            label={translations[language].txt_name}
            value={record.name}
            onChange={(e) => handleCategoryRecordChange(index, "name", e.target.value)}
          />
          <TextField
            id={`categoryDescription_${index}`}
            variant="outlined"
            label={translations[language].txt_description}
            value={record.description}
            onChange={(e) => handleCategoryRecordChange(index, "description", e.target.value)}
          />
        </Box>
      ))}
    </>
  );
}

export default Categories;

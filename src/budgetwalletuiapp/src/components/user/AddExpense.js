import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Paper from "@mui/material/Paper";

function AddExpense({ jwtToken }) {
  const [transferDate, setTransferDate] = useState(null);
  const [splitRecords, setSplitRecords] = useState([
    { name: "", description: "", value: "" },
  ]);

  const handleAddSplitRecord = () => {
    setSplitRecords([
      ...splitRecords,
      { name: "", description: "", value: "" },
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
  const handleAddTransferButtonClick = () => {
    console.log("Here will be save of new transfer with splits");
  };

  return (
    <>
      <Paper elevation={3} sx={{ margin: "20px" }}>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField id="outlined-basic" label="Nazwa" variant="outlined" />
          <TextField id="outlined-basic" label="Opis" variant="outlined" />
          <TextField id="outlined-basic" label="Wartość" variant="outlined" />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Data Transferu"
              value={transferDate}
              onChange={(newDate) => setTransferDate(newDate)}
            />
          </LocalizationProvider>
          <Button variant="outlined" onClick={handleAddTransferButtonClick}>
            Zapisz
          </Button>
        </Box>
      </Paper>
      <Paper elevation={3} sx={{ margin: "20px" }}>
        <Button variant="outlined" onClick={handleAddSplitRecord}>
          Dodaj Split
        </Button>
        {splitRecords.map((record, index) => (
          <Box
            sx={{
              display: "flex",
              whiteSpace: "nowrap",
              "& > :not(style)": { m: 1 },
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
            <TextField
              id="outlined-basic"
              variant="outlined"
              label="Nazwa"
              value={record.name}
              onChange={(e) =>
                handleSplitRecordChange(index, "name", e.target.value)
              }
            />
            <TextField
              id="outlined-basic"
              variant="outlined"
              label="Opis"
              value={record.description}
              onChange={(e) =>
                handleSplitRecordChange(index, "description", e.target.value)
              }
            />
            <TextField
              id="outlined-basic"
              variant="outlined"
              label="Wartość"
              value={record.value}
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

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
import { useLanguage } from "../../contexts/languageContext";
import translations from "../../translations";
import { useUser } from "../../contexts/userContext";
import { Account } from "../../types/api/account";

dayjs.extend(utc);

function Accounts() {
  const { jwtToken } = useUser();
  const { language } = useLanguage();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isValid, setIsValid] = useState<{
    isValid: boolean;
    errors: string[];
  }>({
    isValid: true,
    errors: [],
  });
  const [accountId, setAccountId] = useState<number | null>(null);
  const [transferDate, setTransferDate] = useState<dayjs.Dayjs>(
    dayjs().utc().startOf("day")
  );

  const handleAddTransferButtonClick = async () => {};
  const handleDropdownAccountSourceChange = async () => {};
  const handleDropdownAccountDestinationChange = async () => {};
  /*
    w tym widoku będzie lista aktywnych kont bez możliwości ich edycji ,ale pokaże się  ich nazwa opis, minValue i aktualny stan
    wyliczany z sumy transferów wydatków, przychodów i transferów pomiędzy kontami - tylko aktywne transfery - bez splitów, bo sa zbędne

    lista transferów bez wydatków - tylko zasilenia i międzykontami

    można będzie dodać nowy transfer zasilający (np wypłata, zwrot podatku, spadek, bliczki od znajomych)
    można będzie dodać nowy transfer między kontami

    można będzie wyedytować istniejący transfer: nazwa , opis, data, wartość, sourceAccountId, DestinationAccountId

  */

  return (
    <>
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
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="accountSourceSelect">
              {translations[language].lbl_sourceAccount}
            </InputLabel>
            <Select
              labelId="accountSourceSelect"
              id="accountSourceSelect"
              value={accountId ?? ""}
              label={translations[language].lbl_sourceAccount}
              name="accountSourceId"
              onChange={handleDropdownAccountSourceChange}
            >
              {accounts.map((account) => (
                <MenuItem key={account.id} value={account.id}>
                  {account.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="accountDestinationSelect">
              {translations[language].lbl_destinationAccount}
            </InputLabel>
            <Select
              labelId="accountDestinationSelect"
              id="accountDestinationSelect"
              value={accountId ?? ""}
              label={translations[language].lbl_destinationAccount}
              name="accountDestinationId"
              onChange={handleDropdownAccountDestinationChange}
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
              value={transferDate ?? dayjs().utc().startOf("day")}
              onChange={(newDate) => setTransferDate(newDate!)}
            />
          </LocalizationProvider>
          <Button variant="outlined" onClick={handleAddTransferButtonClick}>
            {translations[language].btn_save}
          </Button>
        </Box>
      </Paper>
    </>
  );
}

export default Accounts;

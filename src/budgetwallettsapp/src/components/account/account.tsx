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
import { PostTransfer } from "../../types/api/postTransfer";
import { useSnackbar } from "../../contexts/toastContext";
import { Severity } from "../../types/enums/severity";

dayjs.extend(utc);

function Accounts() {
  const { jwtToken } = useUser();
  const { language } = useLanguage();
  const [sourceAccounts, setSourceAccounts] = useState<Account[]>([]);
  const [destinationAccounts, setDestinationAccounts] = useState<Account[]>([]);
  const [transferName, setTransferName] = useState<string>("");
  const [transferDescription, setTransferDescription] = useState<string>("");
  const [transferValue, setTransferValue] = useState<number>(0);
  const { openSnackbar } = useSnackbar();
  const [isValid, setIsValid] = useState<{
    isValid: boolean;
    errors: string[];
  }>({
    isValid: true,
    errors: [],
  });
  const [sourceAccountId, setSourceAccountId] = useState<number | null>(null);
  const [destinationAccountId, setDestinationAccountId] = useState<
    number | null
  >(null);
  const [transferDate, setTransferDate] = useState<dayjs.Dayjs>(
    dayjs().utc().startOf("day")
  );

  const handleAddTransferButtonClick = async () => {
    const transfer: PostTransfer = {
      id: 0,
      isActive: true,
      budgetId: null,
      sourceAccountId: sourceAccountId,
      destinationAccountId: destinationAccountId,
      name: transferName,
      description: transferDescription,
      value: transferValue,
      transferDate: transferDate.toDate(),
      transferType: sourceAccountId === null ? "Deposit" : "InternalTransfer",
      splits: [],
    };

    try {
      await axios.post(
        `${config.API_BASE_URL}${config.API_ENDPOINTS.TRANSFERS}/internal`,
        transfer,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      setTransferDescription("");
      setTransferName("");
      setTransferValue(0);
      setTransferDate(dayjs().utc().startOf("day"));
      setSourceAccountId(null);
      setDestinationAccountId(null);
      setIsValid({ isValid: true, errors: [] });

      openSnackbar(
        translations[language].toast_addTransferSuccess,
        Severity.SUCCESS
      );
    } catch (error: any) {
      console.log(error);
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
  };

  const handleDropdownAccountSourceChange = (value: number) => {
    setSourceAccountId(value);
  };
  const handleDropdownAccountDestinationChange = (value: number) => {
    setDestinationAccountId(value);
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get(
          `${config.API_BASE_URL}${config.API_ENDPOINTS.ACCOUNTS}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        const externalSource: Account = {
          id: 0,
          name: translations[language].lbl_externalSource,
          description: "",
          isActive: false,
          minValue: 0,
        };
        const updatedSourceAccounts = [externalSource, ...response.data];

        setSourceAccounts(updatedSourceAccounts);
        setDestinationAccounts(response.data);
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };
    fetchAccounts();
  }, [jwtToken]);

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
              value={sourceAccountId ?? ""}
              label={translations[language].lbl_sourceAccount}
              name="accountSourceId"
              onChange={(e) =>
                handleDropdownAccountSourceChange(Number(e.target.value))
              }
            >
              {sourceAccounts.map((account) => (
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
              value={destinationAccountId ?? ""}
              label={translations[language].lbl_destinationAccount}
              name="accountDestinationId"
              onChange={(e) =>
                handleDropdownAccountDestinationChange(Number(e.target.value))
              }
            >
              {destinationAccounts.map((account) => (
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
            value={transferName}
            onChange={(e) => setTransferName(e.target.value)}
          />
          <TextField
            id="transferDescription"
            label={translations[language].txt_description}
            variant="outlined"
            value={transferDescription}
            onChange={(e) => setTransferDescription(e.target.value)}
          />
          <TextField
            id="transferValue"
            label={translations[language].txt_value}
            variant="outlined"
            value={transferValue}
            onChange={(e) => setTransferValue(Number(e.target.value))}
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

import { useState, useEffect } from "react";
import config from "../../config";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from "@mui/material/Button";
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
import { Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import "../expenses/splitTable.css";
import { AccountState } from "../../types/api/accountState";
import { InternalDepositTransfer } from "../../types/api/internalDepositTransfer";

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
  const [isTransferSaved, setIsTransferSaved] = useState<boolean>(false);
  const [sourceAccountId, setSourceAccountId] = useState<number | null>(null);
  const [destinationAccountId, setDestinationAccountId] = useState<
    number | null
  >(null);
  const [transferDate, setTransferDate] = useState<dayjs.Dayjs>(
    dayjs().utc().startOf("day")
  );

  const [accountStates, setAccountStates] = useState<AccountState[]>([]);
  const [transfers, setTransfers] = useState<InternalDepositTransfer[]>([]);

  const handleAddTransferButtonClick = async () => {
    const transfer: PostTransfer = {
      id: 0,
      isActive: true,
      budgetId: null,
      sourceAccountId: sourceAccountId === 0 ? null : sourceAccountId,
      destinationAccountId: destinationAccountId,
      name: transferName,
      description: transferDescription,
      value: transferValue,
      transferDate: transferDate.toDate(),
      transferType:
        sourceAccountId === null || sourceAccountId === 0
          ? "Deposit"
          : "InternalTransfer",
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
      setIsTransferSaved(true);
      openSnackbar(
        translations[language].toast_addTransferSuccess,
        Severity.SUCCESS
      );
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
        console.error("Error fetching accounts:", error);
      }
    };
    fetchAccounts();
  }, [jwtToken]);

  const fetchAccountStates = async () => {
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}${config.API_ENDPOINTS.ACCOUNTS}/states`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      setAccountStates(response.data);
    } catch (error) {
      console.error("Error fetching accountStates:", error);
    }
  };

  const fetchTransfers = async () => {
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}${config.API_ENDPOINTS.TRANSFERS}/internal`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      setTransfers(response.data);
    } catch (error) {
      console.error("Error fetching transfers:", error);
    }
  };

  useEffect(() => {
    fetchAccountStates();
    fetchTransfers();
  }, [jwtToken]);

  useEffect(() => {
    if (isTransferSaved) {
      fetchAccountStates();
      setIsTransferSaved(false);
      fetchTransfers();
      setIsTransferSaved(false);
    }
  }, [isTransferSaved]);

  /*
   TODO: lista transferów internal i deposit nie posiada obecnie nazwy Source i DestinationAccount
   dodatkowo potrzebna możliwość edycji tych rekordów
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
      {/* <Paper elevation={3} sx={{ margin: { xs: "5px", sm: "20px" } }}>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "row",
            "& > :not(style)": { m: 1, width: "100%" },
            "@media (max-width:600px)": {
              flexDirection: "column",
              alignItems: "center",
              "& > :not(style)": {
                width: "calc(100% - 10px)",
                textAlign: "center",
              },
            },
            position: "relative",
            height: "auto",
            overflow: "visible",
          }}
          noValidate
          autoComplete="off"
        > */}
      <>
        <Accordion
          sx={{
            my: 1,
            mx: 2,
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="account-addTransfer-content"
            id="accout-addTransfer-header"
          >
            <Typography
              variant="h6"
              component="h2"
              sx={{ marginBottom: "10px" }}
            >
              {translations[language].lbl_addInternalDepositTransfer}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Paper
              elevation={3}
              sx={{
                margin: { xs: "5px", sm: "5px" },
                padding: { xs: "5px", sm: "10px" },
                overflow: "hidden",
                width: { xs: "95%", sm: "auto" },
              }}
            >
              <FormControl sx={{ m: 1, minWidth: 200 }}>
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
              <FormControl sx={{ m: 1, minWidth: 200 }}>
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
                    handleDropdownAccountDestinationChange(
                      Number(e.target.value)
                    )
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
                sx={{ m: 1 }}
                onChange={(e) => setTransferName(e.target.value)}
              />
              <TextField
                id="transferDescription"
                label={translations[language].txt_description}
                variant="outlined"
                value={transferDescription}
                sx={{ m: 1 }}
                onChange={(e) => setTransferDescription(e.target.value)}
              />
              <TextField
                id="transferValue"
                label={translations[language].txt_value}
                variant="outlined"
                value={transferValue}
                sx={{ m: 1 }}
                onChange={(e) => setTransferValue(Number(e.target.value))}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={translations[language].lbl_transferDate}
                  value={transferDate ?? dayjs().utc().startOf("day")}
                  sx={{ m: 1 }}
                  onChange={(newDate) => setTransferDate(newDate!)}
                />
              </LocalizationProvider>
              <Button
                variant="outlined"
                sx={{ m: 1 }}
                onClick={handleAddTransferButtonClick}
              >
                {translations[language].btn_save}
              </Button>
            </Paper>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ my: 1, mx: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="account-accountState-content"
            id="accout-accountState-header"
          >
            <Typography
              variant="h6"
              component="h2"
              sx={{ marginBottom: "10px" }}
            >
              {translations[language].lbl_accountStates}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Paper
              elevation={3}
              sx={{
                margin: { xs: "5px", sm: "5px" },
                padding: { xs: "5px", sm: "10px" },
                overflow: "hidden",
                width: { xs: "95%", sm: "auto" },
              }}
            >
              <Table className="bwtable">
                <Thead>
                  <Tr>
                    <Th>{translations[language].lbl_accountName}</Th>
                    <Th>{translations[language].lbl_accountDescription}</Th>
                    <Th>{translations[language].lbl_minValue}</Th>
                    <Th>{translations[language].lbl_isActive}</Th>
                    <Th>{translations[language].lbl_accountState}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {accountStates.map((accountState, index) => (
                    <Tr key={index}>
                      <Td>
                        <span>{accountState.account.name}</span>
                      </Td>
                      <Td>
                        <span>{accountState.account.description}</span>
                      </Td>
                      <Td>
                        <span>{accountState.account.minValue}</span>
                      </Td>
                      <Td>
                        <span>
                          {accountState.account.isActive ? "Tak" : "Nie"}
                        </span>
                      </Td>
                      <Td>
                        <span>{accountState.currentState}</span>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Paper>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ my: 1, mx: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="account-transfers-content"
            id="accout-transfers-header"
          >
            <Typography
              variant="h6"
              component="h2"
              sx={{ marginBottom: "10px" }}
            >
              {translations[language].lbl_internalDepositTransfers}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Paper
              elevation={3}
              sx={{
                margin: { xs: "5px", sm: "5px" },
                padding: { xs: "5px", sm: "10px" },
                overflow: "hidden",
                width: { xs: "95%", sm: "auto" },
              }}
            >
              <Table className="bwtable">
                <Thead>
                  <Tr>
                    {/* <Th>{translations[language].lbl_sourceAccount}</Th>
                    <Th>{translations[language].lbl_destinationAccount}</Th> */}
                    <Th>{translations[language].lbl_transferType}</Th>
                    <Th>{translations[language].lbl_transferName}</Th>
                    <Th>{translations[language].lbl_transferValue}</Th>
                    <Th>{translations[language].lbl_transferDate}</Th>
                    <Th>{translations[language].lbl_isActive}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {transfers.map((transfer, index) => (
                    <Tr key={index}>
                      <Td>
                        <span>{transfer.transferType}</span>
                      </Td>
                      <Td>
                        <span>{transfer.name}</span>
                      </Td>
                      <Td>
                        <span>{transfer.value}</span>
                      </Td>
                      <Td>
                        <span>{transfer.transferDate.toString()}</span>
                      </Td>
                      <Td>
                        <span>{transfer.isActive ? "Tak" : "Nie"}</span>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Paper>
          </AccordionDetails>
        </Accordion>
      </>
      {/* </Box>
      </Paper> */}
    </>
  );
}

export default Accounts;

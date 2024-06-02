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
import "../expenses/splitTable.css";
import { InternalDepositTransfer } from "../../types/api/internalDepositTransfer";

interface AddInternalTransferProps {
  transfer?: InternalDepositTransfer | null;
  setAccountStates: (data: any) => void;
  setTransfers: (data: any) => void;
}

dayjs.extend(utc);

const AddInternalTransfer: React.FC<AddInternalTransferProps> = ({
  transfer = null,
  setAccountStates,
  setTransfers,
}) => {
  const { jwtToken } = useUser();
  const { language } = useLanguage();
  const [sourceAccounts, setSourceAccounts] = useState<Account[]>([]);
  const [destinationAccounts, setDestinationAccounts] = useState<Account[]>([]);
  const [transferName, setTransferName] = useState<string>("");
  const [transferDescription, setTransferDescription] = useState<string>("");
  const [transferValue, setTransferValue] = useState<number>(0);
  const [transferId, setTransferId] = useState<number | null>(null);
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

  //   const [accountStates, setAccountStates] = useState<AccountState[]>([]);
  //   const [transfers, setTransfers] = useState<InternalDepositTransfer[]>([]);

  const handleTransferValueChange = (value: any) => {
    setTransferValue(value as number);
  };

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
    if (transfer) {
      setTransferId(transfer.id);
      setTransferName(transfer.name || "");
      setTransferDescription(transfer.description || "");
      setTransferValue(Number(transfer.value) || 0);
      setTransferDate(dayjs.utc(transfer.transferDate).startOf("day"));
      setSourceAccountId(transfer.sourceAccountId);
      setDestinationAccountId(transfer.destinationAccountId);
    }
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
          onChange={(e) => handleTransferValueChange(e.target.value)}
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
    </>
  );
};

export default AddInternalTransfer;

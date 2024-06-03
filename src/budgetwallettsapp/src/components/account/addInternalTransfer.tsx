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
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";

interface AddInternalTransferProps {
  transfer?: InternalDepositTransfer | null;
  fetchAccountStates: () => void;
  fetchTransfers: () => void;
  sourceAccounts: Account[];
  destinationAccounts: Account[];
  handleCloseModal: () => void | null;
  isEdit: boolean;
}

dayjs.extend(utc);

const AddInternalTransfer: React.FC<AddInternalTransferProps> = ({
  transfer = null,
  fetchAccountStates,
  fetchTransfers,
  sourceAccounts,
  destinationAccounts,
  handleCloseModal,
  isEdit,
}) => {
  const { jwtToken } = useUser();
  const { language } = useLanguage();

  const [transferName, setTransferName] = useState<string>("");
  const [transferDescription, setTransferDescription] = useState<string>("");
  const [transferValue, setTransferValue] = useState<number>(0);
  const [transferId, setTransferId] = useState<number | null>(null);
  const [transferIsActive, setTransferIsActive] = useState<boolean>(true);
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

  const handleTransferValueChange = (value: any) => {
    setTransferValue(value as number);
  };

  const handleAddTransferButtonClick = async () => {
    const transfer: PostTransfer = {
      id: transferId ?? 0,
      isActive: transferIsActive,
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

    const url = `${config.API_BASE_URL}${config.API_ENDPOINTS.TRANSFERS}/internal`;

    try {
      if (isEdit) {
        await axios.put(url, transfer, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
      } else {
        await axios.post(url, transfer, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
      }

      setTransferIsActive(true);
      setTransferId(null);
      setTransferDescription("");
      setTransferName("");
      setTransferValue(0);
      setTransferDate(dayjs().utc().startOf("day"));
      setSourceAccountId(null);
      setDestinationAccountId(null);
      setIsValid({ isValid: true, errors: [] });
      setIsTransferSaved(true);
      if (handleCloseModal) {
        handleCloseModal();
      }
      openSnackbar(
        translations[language].toast_addTransferSuccess,
        Severity.SUCCESS
      );
      fetchAccountStates();
      fetchTransfers();
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
      setSourceAccountId(transfer.sourceAccountId ?? 0);
      setDestinationAccountId(transfer.destinationAccountId);
      setTransferIsActive(transfer.isActive);
    }
  }, [transfer]);

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
      <Paper elevation={3} sx={{ margin: { xs: "5px", sm: "20px" } }}>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          {transfer && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={transferIsActive}
                  onChange={(e) => setTransferIsActive(e.target.checked)}
                />
              }
              label={translations[language].cbx_IsActive}
            />
          )}
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
        </Box>
      </Paper>
    </>
  );
};

export default AddInternalTransfer;

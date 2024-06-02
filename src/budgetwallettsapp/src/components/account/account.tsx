import { useState, useEffect } from "react";
import config from "../../config";
import axios from "axios";
import Paper from "@mui/material/Paper";
import { useLanguage } from "../../contexts/languageContext";
import translations from "../../translations";
import { useUser } from "../../contexts/userContext";
import { Account } from "../../types/api/account";
import { Typography, Button } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import "../expenses/splitTable.css";
import { AccountState } from "../../types/api/accountState";
import { InternalDepositTransfer } from "../../types/api/internalDepositTransfer";
import Tooltip from "@mui/material/Tooltip";
import AddInternalTransfer from "./addInternalTransfer";
import EditIcon from "@mui/icons-material/Edit";
import EditInternalTransfer from "./editInternalTransfer";

function Accounts() {
  const { jwtToken } = useUser();
  const { language } = useLanguage();
  const [isTransferSaved, setIsTransferSaved] = useState<boolean>(false);

  const [accountStates, setAccountStates] = useState<AccountState[]>([]);
  const [transfers, setTransfers] = useState<InternalDepositTransfer[]>([]);
  const [currentTransfer, setCurrentTransfer] =
    useState<InternalDepositTransfer | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleOpenModal = (transfer: InternalDepositTransfer) => {
    setCurrentTransfer(transfer);
    setOpenModal(true);
  };
  const handleCloseModal = () => setOpenModal(false);

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

        //setSourceAccounts(updatedSourceAccounts);
        //setDestinationAccounts(response.data);
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
            <AddInternalTransfer
              setAccountStates={setAccountStates}
              setTransfers={setTransfers}
            />
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
                    <Th className="editColumn">
                      {translations[language].hdr_Edit}
                    </Th>
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
                      <Td className="editColumn">
                        <Button onClick={() => handleOpenModal(transfer)}>
                          <EditIcon />
                        </Button>
                      </Td>
                      <Td>
                        <span>{transfer.transferType}</span>
                      </Td>
                      <Td>
                        <Tooltip title={transfer.description || ""}>
                          <span>{transfer.name}</span>
                        </Tooltip>
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
      {currentTransfer && (
        <EditInternalTransfer
          openModal={openModal}
          handleCloseModal={handleCloseModal}
          setAccountStates={setAccountStates}
          setTransfers={setTransfers}
          currentTransfer={currentTransfer}
        />
      )}
    </>
  );
}

export default Accounts;

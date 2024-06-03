import React from "react";
import { useLanguage } from "../../contexts/languageContext";
import translations from "../../translations";
import { Modal, Box, Typography, Button } from "@mui/material";
import AddInternalTransfer from "./addInternalTransfer";
import { InternalDepositTransfer } from "../../types/api/internalDepositTransfer";
import { Account } from "../../types/api/account";

interface TransferEditProps {
  openModal: boolean;
  handleCloseModal: () => void;
  fetchAccountStates: () => void;
  fetchTransfers: () => void;
  currentTransfer: InternalDepositTransfer;
  sourceAccounts: Account[];
  destinationAccounts: Account[];
}

const EditInternalTransfer: React.FC<TransferEditProps> = ({
  openModal,
  handleCloseModal,
  fetchAccountStates,
  fetchTransfers,
  currentTransfer,
  sourceAccounts,
  destinationAccounts,
}) => {
  const { language } = useLanguage();

  const editTransferBoxStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    overflowY: "auto",
    maxHeight: "90vh",
  };

  return (
    <Modal
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="modal-editTransfer-title"
      aria-describedby="modal-editTransfer-description"
    >
      <Box sx={editTransferBoxStyle}>
        <Typography id="modal-editTransfer-title" variant="h6" component="h2">
          {translations[language].lbl_TransferEdition}
        </Typography>
        <Typography id="modal-editTransfer-description" sx={{ mt: 2 }}>
          {translations[language].lbl_TransferEditionFor}{" "}
          {currentTransfer?.name}
        </Typography>
        <AddInternalTransfer
          transfer={currentTransfer}
          fetchAccountStates={fetchAccountStates}
          fetchTransfers={fetchTransfers}
          sourceAccounts={sourceAccounts}
          destinationAccounts={destinationAccounts}
          handleCloseModal={handleCloseModal}
          isEdit={true}
        />
        <Button onClick={handleCloseModal}>
          {translations[language].btn_Close}
        </Button>
      </Box>
    </Modal>
  );
};

export default EditInternalTransfer;

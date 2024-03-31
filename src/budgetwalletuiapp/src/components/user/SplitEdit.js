import React from "react";
import { useLanguage } from "../../LanguageContext";
import translations from "../../translations";
import { Modal, Box, Typography, Button } from "@mui/material";
import AddExpense from "./AddExpense";

function SplitEdit({
  jwtToken,
  openModal,
  handleCloseModal,
  handleSaveSplit,
  currentSplit,
  accounts,
  categories,
}) {
  const { language } = useLanguage();
  const editSplitBoxStyle = {
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
    <>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-editSplit-title"
        aria-describedby="modal-editSplit-description"
      >
        <Box sx={editSplitBoxStyle}>
          {/* 
               praktycznie formularz, który potrzebuje do edycji splitu/transferu
               to dokładnie to co jest w AddExpense
               użyje więc tego komponentu, trzeba go zmodyfikować tak aby nie tylko obsługiwał dodanie nowego
               ale edycję istniejącego splitu/Transferu
              */}
          <Typography id="modal-editSplit-title" variant="h6" component="h2">
            {translations[language].lbl_SplitEdition}
          </Typography>
          <Typography id="modal-editSplit-description" sx={{ mt: 2 }}>
            {translations[language].lbl_SplitEditionFor}{" "}
            {currentSplit?.splitName}
          </Typography>
          <AddExpense jwtToken={jwtToken} inModal={true} />
          <Button onClick={handleCloseModal}>
            {translations[language].btn_Close}
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default SplitEdit;

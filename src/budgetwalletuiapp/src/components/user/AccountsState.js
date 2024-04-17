import React, { useState, useEffect } from "react";
import config from "../../config";
import axios from "axios";
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
import { useUser } from '../../UserContext';

function AccountsState() {
  const { jwtToken } = useUser(); 
  const { language } = useLanguage();

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
    <div>
    Stan Kont i operacje na nich (oprócz wydatków) 
    </div>
    </>
  );
}

export default AccountsState;

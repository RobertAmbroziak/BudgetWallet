import Login from './Login';
import React, {useState} from 'react';
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from 'mdb-react-ui-kit';
import { useLanguage } from '../../LanguageContext';
import translations from '../../translations';

export default function LoginModal({ isOpen, handleClose, onSetToken }) {
    const { language } = useLanguage();
    const [showRegister, setShowRegister] = useState(false);

    const toggleOpen = () => {
        setShowRegister(false);
        handleClose();
        };
    
    const handleSetToken = (token) => {
      onSetToken(token);
    };    

  return (
    <>
      <MDBModal open={isOpen} tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>{translations[language].lbl_userAccount}</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
                <Login onClose={handleClose} onSetToken={handleSetToken} showRegister={showRegister} setShowRegister={setShowRegister}/>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={toggleOpen}>
              {translations[language].btn_close}
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}
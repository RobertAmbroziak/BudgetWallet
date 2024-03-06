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
    const [registerAlerts, setRegisterAlerts] = useState([]);

    const toggleOpen = () => {
        setShowRegister(false);
        clearRegisterAlerts();
        handleClose();
        };
    
    const handleSetToken = (token) => {
      onSetToken(token);
    };
    
    const clearRegisterAlerts = () => {
      setRegisterAlerts([]);
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
                <Login 
                  onClose={handleClose}
                  onSetToken={handleSetToken}
                  showRegister={showRegister}
                  setShowRegister={setShowRegister}
                  setRegisterAlerts = {setRegisterAlerts}
                  registerAlerts = {registerAlerts}
                />
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
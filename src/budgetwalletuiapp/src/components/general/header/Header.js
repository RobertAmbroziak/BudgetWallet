import LoginModal from '../../login/LoginModal';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  MDBNavbar,
  MDBContainer,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBNavbarToggler,
  MDBNavbarBrand,
  MDBCollapse,
  MDBBtn
} from 'mdb-react-ui-kit';
import { googleLogout } from "@react-oauth/google";
import {useNavigate} from 'react-router-dom';
import {jwtDecode} from "jwt-decode";
import { useLanguage } from '../../../LanguageContext';
import translations from '../../../translations';
import { useUser } from '../../../UserContext';

export default function Header() {
  const { jwtToken, handleSetToken, handleRemoveToken } = useUser();
  const [openNavColorSecond, setOpenNavColorSecond] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const location = useLocation();
  const { language } = useLanguage();

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };
  const navigate = useNavigate();

  const handleLogout = () => {
    googleLogout();
    handleRemoveToken();
    navigate('/');
  };
  
  const isValidToken = () =>{
    if (jwtToken) {
      const decodedToken = jwtDecode(jwtToken);
      const expirationDate = new Date(decodedToken.exp * 1000);
      const currentDate = new Date();

      if (currentDate < expirationDate) {
        return true;
      } else {
        return false;
      }
    }
    else{
      return false;
    }
  };

  return (
    <>
      <MDBNavbar expand='lg' dark bgColor='dark'>
        <MDBContainer fluid>
          <MDBNavbarBrand>Budget Wallet</MDBNavbarBrand>
          <MDBNavbarToggler
            type='button'
            data-target='#navbarColor02'
            aria-controls='navbarColor02'
            aria-expanded='false'
            aria-label='Toggle navigation'
            onClick={() => setOpenNavColorSecond(!openNavColorSecond)}
          >
          <MDBIcon icon='bars' fas />
          </MDBNavbarToggler>
          <MDBCollapse open={openNavColorSecond} navbar id='navbarColor02'>
            <MDBNavbarNav className='me-auto mb-2 mb-lg-0'>
              <MDBNavbarItem>
                <MDBNavbarLink className={location.pathname === '/' ? 'link-success' : ''} href='/'>{translations[language].lbl_homePage}</MDBNavbarLink>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <MDBNavbarLink className={location.pathname === '/user' ? 'link-success' : ''} href='/user'>{translations[language].lbl_applicationPanel}</MDBNavbarLink>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <MDBNavbarLink className={location.pathname === '/admin' ? 'link-success' : ''} href='/admin'>{translations[language].lbl_adminPanel}</MDBNavbarLink>
              </MDBNavbarItem>
            </MDBNavbarNav>
            <div className='d-flex input-group w-auto'>
              {jwtToken && isValidToken() ?
              (
                <MDBBtn color='primary' onClick={handleLogout}>{translations[language].btn_logout}</MDBBtn>
              ) 
              : 
              (
                <MDBBtn color='primary' onClick={openLoginModal}>{translations[language].btn_login}</MDBBtn>
              )}
            </div>
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>
      <LoginModal isOpen={isLoginModalOpen} handleClose={closeLoginModal} onSetToken={handleSetToken} />
    </>
  );
}
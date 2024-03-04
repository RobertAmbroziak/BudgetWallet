import React, {useState} from 'react';
import { useGoogleLogin } from "@react-oauth/google";
import {
  MDBContainer,
  MDBInput,
  MDBBtn,
  MDBIcon
}
from 'mdb-react-ui-kit';
import config from '../../config';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { useLanguage } from '../../LanguageContext';
import translations from '../../translations';

  function authenticate(token, onSetToken) {
    return axios.post(`${config.API_BASE_URL}${config.API_ENDPOINTS.GOOGLE_LOGIN}`, {token: token})
    .then(response => {
      onSetToken(response.data);
    })
    .catch(error => {
      throw error;
    });
  }

  function Login({onClose, onSetToken, showRegister, setShowRegister}) {
    
    const [emailOrUserName, setEmailOrUserName] = useState('');
    const [password, setPassword] = useState('');
    const { language } = useLanguage();

    const [registerUserName, setRegisterUserName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerRepeatPassword, setRegisterRepeatPassword] = useState('');

    
    const handleEmailOrUserNameChange = (event) => {
      setEmailOrUserName(event.target.value);
    };

    const handlePasswordChange = (event) => {
      setPassword(event.target.value);
    };

    const handleRegisterUserNameChange = (event) => {
      setRegisterUserName(event.target.value);
    };

    const handleRegisterEmailChange = (event) => {
      setRegisterEmail(event.target.value);
    };

    const handleRegisterPasswordChange = (event) => {
      setRegisterPassword(event.target.value);
    };

    const handleRegisterRepeatPasswordChange = (event) => {
      setRegisterRepeatPassword(event.target.value);
    };

    const navigate = useNavigate();
    const googleLogin = useGoogleLogin({
      onSuccess: async (tokenResponse) => 
      {
        try{
            await authenticate(tokenResponse.access_token, onSetToken);
            onClose();
            navigate('/user');
        } catch (error) {
            throw error;
        }
      },
    });

    const standardLogin = (() =>{
      return axios.post(`${config.API_BASE_URL}${config.API_ENDPOINTS.LOGIN}`, {emailOrUserName: emailOrUserName, password: password })
      .then(response => {
        onSetToken(response.data);
        onClose();
        navigate('/user');
      })
      .catch(error => {
        navigate('/');
      });
    });

    const handleRegisterClick = () => {
      setShowRegister(true);
    };

    const register = (() =>{
      return axios.post(`${config.API_BASE_URL}${config.API_ENDPOINTS.REGISTER}`, {userName: registerUserName, email: registerEmail, password: registerPassword })
      .then(response => {
        onSetToken(response.data);
        onClose();
        setShowRegister(false);
        // TODO: wyczyść formularz, wyświetl jakiś tooltip że poszedł mail
        navigate('/user');
      })
      .catch(error => {
        // TODO: tutaj powinno się pojawić info z błędu BadRequest Validatora
        if (error.response) {
          // Błąd odpowiedzi serwera z kodem statusu 4xx lub 5xx
          console.log('Kod statusu:', error.response.status);
          console.log('Treść błędu:', error.response.data);
        } else if (error.request) {
          // Brak odpowiedzi od serwera
          console.log('Brak odpowiedzi od serwera:', error.request);
        } else {
          // Inny rodzaj błędu
          console.log('Wystąpił inny rodzaj błędu:', error.message);
        }
        console.log('Konfiguracja błędu:', error.config);
        navigate('/');
      });
    });

    return (
      
      <MDBContainer className="p-3 my-5 d-flex flex-column w-60">
      {!showRegister ? (
        <>
          <MDBInput wrapperClass='mb-4' label={translations[language].lbl_emailOrUserName} id='form1' type='email' value={emailOrUserName} onChange={handleEmailOrUserNameChange}/>
          <MDBInput wrapperClass='mb-4' label={translations[language].lbl_password} id='form2' type='password' value={password} onChange={handlePasswordChange}/>

          <div className="d-flex justify-content-between mx-3 mb-4">
            <a href="!#">{translations[language].lbl_forgotPassword}</a>
          </div>

          <MDBBtn className="mb-4" onClick={() => standardLogin()}>{translations[language].lbl_signIn}</MDBBtn>

          <div className="text-center">
            <p>{translations[language].lbl_notMember} <a href="#!" onClick={handleRegisterClick}>{translations[language].lbl_register}</a></p>
            <p>{translations[language].lbl_signUpWith}</p>

            <div className='d-flex justify-content-between mx-auto' style={{width: '40%'}}>
              <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1', pointerEvents: 'none', opacity: '0.5' }}>
                <MDBIcon fab icon='facebook-f' size="sm"/>
              </MDBBtn>

              <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1', pointerEvents: 'none', opacity: '0.5' }}>
                <MDBIcon fab icon='twitter' size="sm"/>
              </MDBBtn>

              <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }} onClick={() => googleLogin()}>
                <MDBIcon fab icon='google' size="sm" />
              </MDBBtn>
              <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1', pointerEvents: 'none', opacity: '0.5' }}>
                <MDBIcon fab icon='github' size="sm"/>
              </MDBBtn>
            </div>
          </div>
        </>
      ) :(
        <>
          <MDBInput wrapperClass='mb-4' label={translations[language].lbl_userName} size='lg' id='form3' type='text' value={registerUserName} onChange={handleRegisterUserNameChange}/>
          <MDBInput wrapperClass='mb-4' label={translations[language].lbl_email} size='lg' id='form4' type='email'value={registerEmail} onChange={handleRegisterEmailChange}/>
          <MDBInput wrapperClass='mb-4' label={translations[language].lbl_password} size='lg' id='form5' type='password'value={registerPassword} onChange={handleRegisterPasswordChange}/>
          <MDBInput wrapperClass='mb-4' label={translations[language].lbl_repeatPassword} size='lg' id='form6' type='password' value={registerRepeatPassword} onChange={handleRegisterRepeatPasswordChange}/>
          <MDBBtn className="mb-4" onClick={() => register()}>{translations[language].lbl_register}</MDBBtn>
        </>
      )}
      </MDBContainer>
    );
  }

export default Login;
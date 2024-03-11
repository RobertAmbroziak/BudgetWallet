import React, {useState, useContext } from 'react';
import { useGoogleLogin } from "@react-oauth/google";
import {
  MDBContainer,
  MDBInput,
  MDBBtn,
  MDBIcon,
  MDBBadge
}
from 'mdb-react-ui-kit';
import config from '../../config';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { useLanguage } from '../../LanguageContext';
import translations from '../../translations';
import context from '../../context';

  async function authenticate(token, onSetToken) {
    return axios.post(`${config.API_BASE_URL}${config.API_ENDPOINTS.GOOGLE_LOGIN}`, {token: token})
    .then(response => {
      console.log('test5');
      onSetToken(response.data);
    })
    .catch(error => {
      console.log('test6');
      throw error;
    });
  }

  function Login({onClose, onSetToken, showRegister, setShowRegister, setRegisterAlerts, registerAlerts, setLoginAlerts, loginAlerts}) {
    
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
        console.log('test1');
        try{
            console.log('test2');
            await authenticate(tokenResponse.access_token, onSetToken);
            console.log('test3');
            onClose();
            navigate('/user');
        } catch (error) {
            throw error;
        }
      },
    });

    const standardLogin = (async () =>{
      try{
        const response = await axios.post(`${config.API_BASE_URL}${config.API_ENDPOINTS.LOGIN}`, {emailOrUserName: emailOrUserName, password: password })
        
        onSetToken(response.data);
        onClose();
        navigate('/user');
      }
      catch (error){
        if (error.response) {
          const errorMsg = error.response.data;
          setLoginAlerts(
            <div className="p-2 mb-2 bg-danger bg-gradient text-white rounded-5" style={{fontSize: "smaller"}}>{errorMsg}</div>
          );
        } else if (error.request) {
          const errorMsg = translations[language].err_noServerResponse;
          setLoginAlerts(
            <div className="p-2 mb-2 bg-danger bg-gradient text-white rounded-5" style={{fontSize: "smaller"}}>{errorMsg}</div>
          );
        } else {
          const errorMsg = translations[language].err_error + error.message;
          setLoginAlerts(
            <div className="p-2 mb-2 bg-danger bg-gradient text-white rounded-5" style={{fontSize: "smaller"}}>{errorMsg}</div>
          );
        }
      }
    });

    const handleRegisterClick = () => {
      setShowRegister(true);
    };

    const register = (async () =>{
      try
      {
        if (registerPassword !== registerRepeatPassword) {
          const passwordMismatchError = translations[language].err_passwordMismatch;
          setRegisterAlerts(
            <div className="p-2 mb-2 bg-danger bg-gradient text-white rounded-5" style={{fontSize: "smaller"}}>{passwordMismatchError}</div>
          );
          return;
        }

        const response = await axios.post(`${config.API_BASE_URL}${config.API_ENDPOINTS.REGISTER}`, { userName: registerUserName, email: registerEmail, password: registerPassword });
    
        onSetToken(response.data);
        clearRegisterForm();
        onClose();
        setShowRegister(false);
        navigate('/');
        notifyRegisterSuccess();
      } 
      catch (error)
      {
        if (error.response) {
          const errors = error.response.data;
          setRegisterAlerts(errors.map((item, index) => (
            <div key={index} className="p-2 mb-2 bg-danger bg-gradient text-white rounded-5" style={{fontSize: "smaller"}}>{item}</div>
          )));
        } else if (error.request) {
          const errors = translations[language].err_noServerResponse;
          setRegisterAlerts(
            <div className="p-2 mb-2 bg-danger bg-gradient text-white rounded-5" style={{fontSize: "smaller"}}>{errors}</div>
          );
        } else {
          const errors = translations[language].err_error + error.message;
          setRegisterAlerts(
            <div className="p-2 mb-2 bg-danger bg-gradient text-white rounded-5" style={{fontSize: "smaller"}}>{errors}</div>
          );
        }
      }
    });

    const clearRegisterForm = () => {
      setRegisterUserName('');
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterRepeatPassword('');
    };

    const { registerSuccessToast } = useContext(context);

    const notifyRegisterSuccess = () => {
        registerSuccessToast();
    };

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
          <div id='loginAlerts'>{loginAlerts}</div>
        </>
      ) :(
        <>
          <MDBInput wrapperClass='mb-4' label={translations[language].lbl_userName} size='lg' id='form3' type='text' value={registerUserName} onChange={handleRegisterUserNameChange}/>
          <MDBInput wrapperClass='mb-4' label={translations[language].lbl_email} size='lg' id='form4' type='email'value={registerEmail} onChange={handleRegisterEmailChange}/>
          <MDBInput wrapperClass='mb-4' label={translations[language].lbl_password} size='lg' id='form5' type='password'value={registerPassword} onChange={handleRegisterPasswordChange}/>
          <MDBInput wrapperClass='mb-4' label={translations[language].lbl_repeatPassword} size='lg' id='form6' type='password' value={registerRepeatPassword} onChange={handleRegisterRepeatPasswordChange}/>
          <MDBBtn className="mb-4" onClick={() => register()}>{translations[language].lbl_register}</MDBBtn>
          <div id='registerAlerts'>{registerAlerts}</div>
        </>
      )}
      </MDBContainer>
    );
  }

export default Login;
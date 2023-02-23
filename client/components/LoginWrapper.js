/* eslint-disable */
import React, {useState} from 'react';
import Login from './Login';
import Signup from './Signup';
import CreatePet from './CreatePet';
import '../styles/LoginWrapper.css';

function LoginWrapper (props) {
  // const [userIsLoggingIn, setUserIsLoggingIn] = useState(true);
  const [createPetOnSignUp, setCreatePetOnSignUp] = useState(false);
  const [loginState, setLoginState] = useState('Login');

  let singleRender;
  
  switch (loginState) {
    case 'Login':
      singleRender = <Login 
      setUserInfo={props.setUserInfo} 
      setLoggedIn={props.setLoggedIn}
      setUserPet={props.setUserPet}
      setLoginState={setLoginState}  
      />;
      break;
  
    case 'Signup':
      singleRender = <Signup 
      setLoggedIn={props.setLoggedIn} 
      setUserInfo={props.setUserInfo} 
      setLoginState={setLoginState}    
      />
      break;
  
    case 'CreatePet':
      singleRender = <CreatePet 
        UserInfo={props.UserInfo}
      />;
      break;
    }

    {/* {userIsLoggingIn ? 
    <Login setUserInfo={props.setUserInfo} setUserIsLoggingIn={setUserIsLoggingIn} setLoggedIn={props.setLoggedIn}/> : 
    <Signup setLoggedIn={props.setLoggedIn} setUserIsLoggingIn={setUserIsLoggingIn} setUserInfo={props.setUserInfo} />} */}
  return (
    <div className='loginWrapper'>
      {singleRender}
    </div>
  );
}

export default LoginWrapper;
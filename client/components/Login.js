/* eslint-disable */
import React, {useState} from 'react';
import '../styles/Login.css';
import '../styles/Signup.css'

function Login(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const submitFormHandler = async(e) => {
    e.preventDefault();
    // const data = await fetch(`/user/login/${username}&${password}`);
    const data = await fetch('/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username, password})
    });
    const userData = await data.json();
    if (userData.err) {
      setErrorMessage(userData.err);
      return;
    }
    props.setUserInfo(userData);
    props.setLoggedIn(true);
    props.setUserPet(true);
  }

  const formSwitchHandler = e => {
    props.setLoginState('Signup');
  }

  return <form className='loginForm' onSubmit={submitFormHandler}>
    <label>Username: <input type='text' id='username' name='username' onChange={(e) => setUsername(e.target.value)} required className="signup-input"></input></label>
    <label>Password: <input type='password' id='password' name='password' onChange={(e) => setPassword(e.target.value)} required className="signup-input"></input></label>
    <button
      type='submit' 
      className="signup-button"
    >Login</button>
    {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
    <p>Don't have an account? Create an account <a onClick={formSwitchHandler} className="switch-forms">here.</a></p>
  </form>
}

export default Login;

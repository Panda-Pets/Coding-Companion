/* eslint-disable */
import React, {useState} from 'react';
import '../styles/Signup.css'

function Signup (props) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [leetcodeUsername, setLeetcodeUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [passwordIsNotStrong, setPasswordIsNotStrong] = useState(false);

    async function obtainInfo (e) {
      e.preventDefault();
        if (!checkPassword(password)) {
          setPasswordIsNotStrong(true);
          return;
        }
        const response = await fetch('/user/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({username, password, leetcodeUsername})
        });
        const userData = await response.json();
        console.log(userData);
        if (userData.err) {
          setErrorMessage(userData.err);
          return;
        }
        props.setUserInfo(userData);
        props.setLoggedIn(true);
        props.setLoginState('CreatePet');
    }
  // TODO: Comment this back in!
  function checkPassword (password) {
    // const regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    // return regex.test(password);
    return true;
  }

  function formSwitchHandler (e) {
    props.setLoginState('Login');
  }

    return (
          <form onSubmit={obtainInfo} className="signup-form"> 
              <label>Create username: <input onChange = {(e)=>setUsername(e.target.value)} required className="signup-input"></input></label>
              <label>Create password: <input onChange = {(e)=>setPassword(e.target.value)} required type="password" className="signup-input"></input></label>
              {passwordIsNotStrong && <p style={{color: 'red'}}>Password is not strong enough. Please try again with a password minimum 8 characters long and including number, symbols, and uppercase and lowercase letters.</p>}
              <label>Leetcode username (case sensitive!): <input onChange = {(e)=>setLeetcodeUsername(e.target.value)} required className="signup-input"></    input></label>
              <button type="submit" className="signup-button">Submit</button>
              {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
              <p>Already have an account? Login <a onClick={formSwitchHandler} className="switch-forms">here</a>.</p>
          </form>
    )
}

export default Signup;
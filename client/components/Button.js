/* eslint-disable react/prop-types */
import React from 'react';
import '../styles/Button.css';

//styles for main container will be set to false unless user is logged in.

function Button(props) {
  const { name, handleClick } = props;
  console.log('name', name);
  console.log('handleClick', handleClick);
  return(
    <button value={name} id={`${name}`} className="button" onClick={handleClick}>{name}</button>
  ); 
}

export default Button;
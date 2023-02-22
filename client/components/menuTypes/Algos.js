/* eslint-disable react/prop-types */
import React from 'react';
import '../../styles/PopupDisplay.css';

function Algos(props) {
  const { name } = props;
  // let popupToRender = 'Nothing';
  console.log('Here is all the info: ', props.userInfo);

  return(
    <div className="popupDisplay">
      <h1 className="menuHeader">{name}</h1>
      <ul className="stats">
        <li>Easy: {props.userInfo.easycount} solved</li>
        <li>Medium: {props.userInfo.medcount} solved</li>
        <li>Hard: {props.userInfo.hardcount} solved</li>
      </ul>
    </div>
  ); 
}
export default Algos;
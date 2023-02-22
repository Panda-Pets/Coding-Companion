/* eslint-disable react/prop-types */
import React from 'react';
import '../../styles/PopupDisplay.css';

function PetStats(props) {
  // const { name, age, size, happiness } = props; //add correct props
  // let popupToRender = 'Nothing';
  const { userInventory, name } = props;
  console.log('userInventory: ',userInventory);
  return(
    <div className="popupDisplay">
      <h1 className="menuHeader">{name}</h1>
      <ul className='stats'>
        <li>Name: {userInventory.pets[0].name} </li>
        <li>Age: {userInventory.pets[0].age}</li>
        <li>Size: {userInventory.pets[0].size}</li>
        <li>Happiness: {userInventory.pets[0].happiness}</li>
      </ul>
    </div>
  ); 
}
export default PetStats;
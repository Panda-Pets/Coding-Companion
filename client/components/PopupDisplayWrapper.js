/* eslint-disable react/prop-types */
import React, {useState, useEffect} from 'react';
import '../styles/PopupDisplayWrapper.css';
// import PopupDisplay from '../components/PopupDisplay.js';
import Algos from '../components/menuTypes/Algos.js';
import Inventory from '../components/menuTypes/Inventory.js';
import PetStats from '../components/menuTypes/PetStats.js';
import Store from '../components/menuTypes/Store.js';

// props.userInfo.currentUser.user_id

function PopupDisplayWrapper(props) {
  let singleRender;

  const { popupToRender, userInfo, userInventory } = props;
  console.log('rendered in display wrapper', popupToRender);
  console.log('userInfo: ', userInfo);
	
	
  const [storeInventory, setStoreInventory] = useState(null);
  const [userCurrency, setUserCurrency] = useState(userInfo.currentUser.currency);
	
  useEffect(function() {
    async function getStoreInventory() {
      let response = await fetch('/inventory');
      let storeInventory = await response.json();
      console.log('storeInventory: ', storeInventory);
      setStoreInventory(storeInventory);
    }
    try{
      getStoreInventory();
    } catch (error) {
      console.error(error);
    }
  }, []);

  console.log(userInventory);

  // const [currentDisplay, setCurrentDisplay] = useState(popupToRender);
  //controls which popup menu is displayed when the corresponding button is clicked
  switch (popupToRender) {
  case 'Nothing':
    singleRender = false;
    break;

  case 'Inventory':
    singleRender = <Inventory 
      name='Inventory'
      inventory={userInventory}
    />;
    break;

  case 'Algos':
    singleRender = <Algos 
      name='Algos'
      userInfo={userInfo.currentUser}
    />;
    break;

  case 'Store':
    singleRender = <Store 
      name='Store'
      storeItems={storeInventory}
      userInfo={props.userInfo.currentUser}
      setUserCurrency={setUserCurrency}
    />;
    break;

  case 'Pet Stats':
    singleRender = <PetStats 
      name='Pet Stats'
      userInventory={userInventory}
    />;
    break;

  default:
    singleRender = false;
  }
  return(
    <div className={`popupDisplayWrapper ${singleRender ? 'visible': ''}`}>
      <p className='currency'> <img className='coin' src='https://i.gifer.com/origin/e0/e02ce86bcfd6d1d6c2f775afb3ec8c01_w200.gif' alt='coin' /> {userCurrency}</p>
      {singleRender}
    </div>
  ); 
}

export default PopupDisplayWrapper;
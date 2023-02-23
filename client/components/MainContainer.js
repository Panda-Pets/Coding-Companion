import React, { useState, Fragment, useEffect } from 'react';
import '../styles/MainContainer.css';
import ButtonWrapper from './ButtonWrapper.js';
import PopupDisplayWrapper from './PopupDisplayWrapper.js';
import LoginWrapper from './LoginWrapper.js';
import Pet from './Pet';

//styles for main container will be set to false unless user is logged in.

function MainContainer(props) {
  //will display the PopupDisplayWrapper and corresponding MenuType depending on which state it is set to
  const [popupToRender, setPopupToRender] = useState('Nothing');
  //checks if the user is logged in. defaulted to false
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //keeps track of the leetcode information as well as progress and total leetbux
  const [userInfo, setUserInfo] = useState(null);
  //keeps track of the signed in user's inventory including, backgrounds, pets, toys, foods
  const [userInventory, setUserInventory] = useState(null);
  // keeps track of whether or not each pet is showing
  const [petsShowing, setPetsShowing] = useState(null);

  const [userPet, setUserPet] = useState(false);

  //will run whenever the state changes relating to when user is logged in
  useEffect(
    function () {
      //perform cond to check if userInfo is null
      if (!userInfo) return;
      //define anon async function
      async function getInventory() {
        //declare variable to be assiged to the async fetch request to get the logged in users inventory
        const response = await fetch(`/inventory/${userInfo.currentUser.user_id}`);
        //decl var to be assigned to the returned async response
        const inventory = await response.json();
        //change state relating to user inventory
        setUserInventory(inventory);
        // populate petsShowing, initially all true
        if(petsShowing === null){
          const pets = {};
          inventory.pets.forEach((pet) => (pets[pet.unique_pet_id] = true));
          setPetsShowing(pets);
        }
      }
      //try and catch block - invoke async func above
      try {
        getInventory();
      } catch (error) {
        console.error(error);
      }
    },
    [isLoggedIn]
  );

  //takes in the UI click event
  const handleMenuClick = (event) => {
    //if the clicked menu is already open, then close
    if (event.target.id === popupToRender) {
      setPopupToRender('Nothing');
      // otherwise, open the clicked menu
    } else {
      setPopupToRender(event.target.id);
    }
  };

  const handleMenuPetClick = (pet_id) => {
    setPetsShowing({ ...petsShowing, [pet_id]: !petsShowing[pet_id] });
  };

  return (
    <div className="mainContainer">
      {isLoggedIn && userInfo && userInventory && userPet ? (
        <Fragment>
          <ButtonWrapper handleClick={handleMenuClick} />
          <PopupDisplayWrapper
            userInfo={userInfo}
            popupToRender={popupToRender}
            userInventory={userInventory}
            setUserInfo={setUserInfo}
            setUserInventory={setUserInventory}
            handleMenuPetClick={handleMenuPetClick}
          />
          {userInventory.pets.map((pet) => (
            <Pet pet={pet} key={pet.unique_pet_id} visible={petsShowing[pet.unique_pet_id]} />
          ))}
        </Fragment>
      ) : (
        <LoginWrapper
          setUserInfo={setUserInfo}
          setLoggedIn={setIsLoggedIn}
          setUserPet={setUserPet}
          userInfo={userInfo}
        />
      )}
    </div>
  );
}

export default MainContainer;

{
  /* <Component {...props}/> */
}

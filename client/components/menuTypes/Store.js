import React from 'react';
import Cat from '../../assets/images/pets/cat/cat_idle.gif';
import Dog from '../../assets/images/pets/dog/dog_idle.gif';
import Trex from '../../assets/images/pets/trex/trex_idle.gif';

import '../../styles/PopupDisplay.css';


const foods = require.context('../../assets/images/food', false, /\.(png|jpe?g|svg)$/);
const toys = require.context('../../assets/images/toys', false, /\.(png|jpe?g|svg)$/);


function Store(props) {
  const { name, setUserInfo, userInfo, storeItems, setUserInventory, userInventory, setUserCurrency } = props;
  // const petArr = [cat, dog, trex];
  // const petStringArr = ['Cat', 'Dog', 'T-Rex'];
  // console.log(userInfo);


  /*
	confirmedPurchase = {err: "An error occurred"}
	this async request is failing to purchase food items this error is vague so not sure where to pinpoint where in the backend this is failing 
	
	food purchase if failing 
	 */

  //event handler for when an item is purchased
  //async function definition is declared
  //store the response of a fetch request the client makes to the backend server 
  //then that server will invoke the game router -> game router will invoke addInventory middleware which is the func
  // that makes a sql queries to the database (updateCurrency, addItem) -> update db -> return these array values back to the client 


  //send along in request body the purchasedItem props
  //a confirmed purchased var will store an array with the SQL query commands  
  const handlePurchase = (purchasedItem) => {
    console.log('purchasedItem ',purchasedItem);
    async function purchaseFoodOrToy() {
      const response = await fetch(`/inventory/${userInfo.user_id}`, 
        {method : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(purchasedItem) });
      const confirmedPurchase = await response.json();
      console.log('confirmed purchase: ', confirmedPurchase);
      setUserCurrency(purchasedItem.currencyVal);
    }

    async function purchasePet() {
      console.log('PURCHASE PET: ', purchasedItem);
      const response = await fetch('/user/adoptAPet', 
        {method : 'POST',           
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(purchasedItem) });
      const confirmedPurchase = await response.json();
      setUserInventory({...userInventory, pets: [...userInventory.pets, confirmedPurchase.newPet]});
      console.log('confirmed purchase: ', confirmedPurchase);
      setUserCurrency(confirmedPurchase.currency);
    }
    try{
      if(purchasedItem.type === 'pet') purchasePet();
      else purchaseFoodOrToy();

    } catch (error) {
      console.error(error);
    }
  };
  console.log('storeItems: ',storeItems);

  const foodObj = {
    kibble: './Kibble.png',
    tbone: './T-bone.png',
    milksaucer: './Milk.png',
    tuna: './Tuna.png',
    goatleg: './Goat Leg.png',
    livecow: './Cow.png'
  };
  const foodItems = storeItems.food.map((food, index) => 
  {
    const foodName = food.name;
    const foodCost = food.cost;
    const image = foodObj[foodName];
    const slicedImageName = image.slice(2,-4);
    return (
      <section key={index} onClick={() => {
        const boughtItem = {
          currencyVal: userInfo.currency - food.cost,
          cost: food.cost,
          toy_stat: 0,
          food_stat: food.stat,
          type: 'food',
          file_id: food.name,
          user_id: userInfo.user_id
        };
        handlePurchase(boughtItem);
      }}>
        <img src={foods(image)} alt={`Image ${index}`} onClick={() => handlePurchase(foodName, foodCost)}/>
        <p>{slicedImageName}</p>
        <p>cost: {foodCost} </p>
      </section>
    );
  });

  const toyObj = {
    ball: './Ball.png',
    bone: './Bone.png',
    mouse: './Mouse.png',
    catnip: './Catnip.png',
    lawyer: './Lawyer.png',
    gallimimus: './Gallimimus.png'
  };
  //just to map and render all toys in the store
  const toyItems = storeItems.toys.map((toy, index) => {
    const toyName = toy.name;
    const toyCost = toy.cost;
    const image = toyObj[toyName];
    const slicedImageName = image.slice(2,-4);
    return (
      <section key={index} onClick={() => {
        const boughtItem = {
          currencyVal: userInfo.currency - toy.cost,
          cost: toy.cost,
          toy_stat: toy.toyStat,
          food_stat: 0,
          type: 'toy',
          file_id: toy.name,
          user_id: userInfo.user_id
        };
        handlePurchase(boughtItem);
      }}>
        <img src={toys(image)} alt={`Image ${index}`}/>
        <p>{slicedImageName}</p>
        <p>cost: {toyCost} </p>
      </section>
    );
  });
  const petObj = {
    cat: Cat,
    dog: Dog,
    trex: Trex
  };
	
  const petItems = storeItems.pets.map((pet, index) => {
    const petBreed = pet.file_id;
    const petType = pet.type;
    const petCost = pet.cost;
    const image = petObj[petBreed];
    const petStr = `${petBreed[0].toUpperCase()}${petBreed.slice(1)}`;
    console.log('PET: ',pet);

    //TODO: implement functionality to name pet. defaulted to Steve atm
    return (
      <section key={index} onClick={() => {
        const boughtItem = {
          currencyVal: userInfo.currency - pet.cost,
          petName: 'Steve',
          cost: pet.cost,
          petBreed: petBreed,
          type: pet.type,
          user_id: userInfo.user_id,
          firstPet: false
        };
        handlePurchase(boughtItem);
      }}>
        <img src={image} alt={`Image ${index}`}/>
        <p>{petStr}</p>
        <p>cost: {petCost}</p>
      </section>
    );
  });

  return(
    <div className="popupDisplay">
			
      <h1 className="menuHeader">{name}</h1>
		
      <div className='menuSection'>
        <h2>Food</h2>
        <div className="items food">
          {foodItems}
        </div>				
      </div>
      <div className='menuSection'>
        <h2>Toys</h2>
        <div className="items toys">
          {toyItems}
        </div>				
      </div>
      <div className='menuSection'>
        <h2>Pets</h2>
        <div className="items pets">
          {petItems}
        </div>				
      </div>
    </div>
  ); 
}

// client/assets/images/food/cow.png
export default Store;
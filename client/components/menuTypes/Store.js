import React from 'react';
import Cat from '../../assets/images/pets/cat/cat_idle.gif';
import Dog from '../../assets/images/pets/dog/dog_idle.gif';
import Trex from '../../assets/images/pets/trex/trex_idle.gif';

import '../../styles/PopupDisplay.css';


const foods = require.context('../../assets/images/food', false, /\.(png|jpe?g|svg)$/);
const toys = require.context('../../assets/images/toys', false, /\.(png|jpe?g|svg)$/);


function Store(props) {
  const { name, userInfo, storeItems } = props;
  // const petArr = [cat, dog, trex];
  // const petStringArr = ['Cat', 'Dog', 'T-Rex'];
  // console.log(userInfo);


  /*
	confirmedPurchase = {err: "An error occurred"}
	this async request is failing to purchase food items this error is vague so not sure where to pinpoint where in the backend this is failing 
	
	food purchase if failing 
	 */
  console.log('store props:', props);

  //event handler for when an item is purchased
  //async function definition is declared
  //store the response of a fetch request the client makes to the backend server 
  //then that server will invoke the game router -> game router will invoke addInventory middleware which is the func
  // that makes a sql queries to the database (updateCurrency, addItem) -> update db -> return these array values back to the client 


  //send along in request body the purchasedItem props
  //a confirmed purchased var will store an array with the SQL query commands  
  const handlePurchase = (purchasedItem) => {
    async function purchaseFromStore() {
      const response = await fetch(`/inventory/${userInfo.user_id}`, 
        {method : 'POST',           
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(purchasedItem) });
      const confirmedPurchase = await response.json();
      console.log('confirmed purchase: ', confirmedPurchase);
      props.setUserCurrency(purchasedItem.currencyVal);
    }
    try{
      purchaseFromStore();
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
      <section key={index}>
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
    const petName = pet.file_id;
    const petCost = pet.cost;
    const image = petObj[petName];
    const petStr = `${petName[0].toUpperCase()}${petName.slice(1)}`;
    console.log(petName);
    return (
      <section key={index} >
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
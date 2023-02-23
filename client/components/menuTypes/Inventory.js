import React from 'react';
import Cat from '../../assets/images/pets/cat/cat_idle.gif';
import Dog from '../../assets/images/pets/dog/dog_idle.gif';
import Trex from '../../assets/images/pets/trex/trex_idle.gif';

import '../../styles/PopupDisplay.css';

//context with files from the assests directory that can be required wih a request ending with png/jpe/svg
//inventory objects for food and toy images
const foods = require.context('../../assets/images/food', false, /\.(png|jpe?g|svg)$/);
const toys = require.context('../../assets/images/toys', false, /\.(png|jpe?g|svg)$/);

function Inventory(props) {
  const { name, inventory, handleMenuPetClick } = props;

  const handleDblClick = (item) => {
    //console.log('i\'ve been clicked! ', item);
  };
  //declare a foodObject with all food items : pictures
  const foodObj = {
    kibble: './Kibble.png',
    tbone: './T-bone.png',
    milksaucer: './Milk.png',
    tuna: './Tuna.png',
    goatleg: './Goat Leg.png',
    livecow: './Cow.png',
  };

  console.log('foodObj', foodObj);
  console.log('foods', foods);
  //map food items
  //console.log('inventory ',inventory);
  const foodItems = inventory.food.map((food, index) => {
    const foodName = food.file_id;
    //confusing bc str data type -> change the name to imageName
    const image = foodObj[foodName];
    //the slice at 2 and -4 removes the './' and 'png' -> set to key and not value
    const slicedImageName = image.slice(2, -4);
    //console.log(typeof slicedImageName, `sliceImageName`, slicedImageName);
    return (
      <section key={index}>
        <img
          src={foods(image)}
          alt={`Image ${index}`}
          onClick={(foodName) => handleClick(foodName)}
        />
        <p>{slicedImageName}</p>
      </section>
    );
  });

  const toyObj = {
    ball: './Ball.png',
    bone: './Bone.png',
    mouse: './Mouse.png',
    catnip: './Catnip.png',
    lawyer: './Lawyer.png',
    gallimimus: './Gallimimus.png',
  };

  const toyItems = inventory.toys.map((toy, index) => {
    const toyName = toy.file_id;
    const image = toyObj[toyName];
    // console.log(image);
    const slicedImageName = image.slice(2, -4);
    return (
      <section key={index} onClick={() => handleClick()}>
        <img src={toys(image)} alt={`Image ${index}`} />
        <p>{slicedImageName}</p>
      </section>
    );
  });

  const petObj = {
    cat: Cat,
    dog: Dog,
    trex: Trex,
  };
  // console.log(inventory.pets);
  console.log('inventory.pets: ', inventory.pets);
  const petItems = inventory.pets.map((pet, index) => {
    const petName = pet.file_id;
    const image = petObj[petName];
    const petStr = `${pet.name[0].toUpperCase()}${pet.name.slice(1)}`;
    const petUniqueId = pet.unique_pet_id;
    console.log('petID', petUniqueId);
    return (
      <section key={index} onClick={() => handleMenuPetClick(petUniqueId)}>
        <img src={image} alt={`Image ${index}`} />
        <p>{petStr}</p>
      </section>
    );
  });

  // useEffect(() => {
  // 	effect
  // 	return () => {
  // 		cleanup
  // 	};
  // }, []);

  return (
    <div className="popupDisplay">
      <h1 className="menuHeader">{name}</h1>

      <div className="menuSection">
        <h2>Food</h2>
        <div className="items food">{foodItems}</div>
      </div>
      <div className="menuSection">
        <h2>Toys</h2>
        <div className="items toys">{toyItems}</div>
      </div>
      <div className="menuSection">
        <h2>Pets</h2>
        <div className="items pets">{petItems}</div>
      </div>
    </div>
  );
}
export default Inventory;

// client/assets/images/food/cow.png

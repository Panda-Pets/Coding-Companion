import React, {useState, useEffect} from 'react';
import '../styles/pet.css';
import cat from '../assets/images/pets/cat/cat_idle.gif';
import walkingCat from '../assets/images/pets/cat/cat_walking.gif';
import dog from '../assets/images/pets/dog/dog_idle.gif';
import walkingDog from '../assets/images/pets/dog/dog_walking.gif';
import trex from '../assets/images/pets/trex/trex_idle.gif';
import walkingTrex from '../assets/images/pets/trex/trex_walking.gif';

function Pet(props) {
  const [petXPosition, setPetXPosition] = useState(50);
  const [petYPosition, setPetYPosition] = useState(50);
  const [petScale, setPetScale] = useState(100);
  const [petMoveState, setPetMoveState] = useState(false);
  const [flipPet, setFlipPet] = useState(false);
  const [pet, setPet] = useState(props.userInventory.pets[0].file_id);

  //objects to make conditional rendering and correct css easier to impliment
  const petGifPairs = {
    dog: walkingDog,
    cat: walkingCat,
    trex: walkingTrex,
  };

  const idleGifPairs = {
    dog: dog,
    cat: cat,
    trex: trex,
  };


	
  useEffect(() => {
    //controll pet position with arrow keys
    const handleKeyDown = (event) => {
      switch (event.key) {
      case 'ArrowUp':
        if(petYPosition > 35) setPetYPosition(petYPosition - 1);
        break;
      case 'ArrowDown':
        if(petYPosition < 84) setPetYPosition(petYPosition + 1);
        break;
      case 'ArrowRight':
        if(petXPosition < 90) setPetXPosition(petXPosition + 1);
        break;
      case 'ArrowLeft':
        if(petXPosition > 0) setPetXPosition(petXPosition - 1);
        setFlipPet(true);
        break;
		
      default:
        break;
      }

      //scale pet size based on change in position
      setPetScale(petYPosition * 2);

      //set move state to true
      setPetMoveState(true);			
    };

    //set pet move state to false on keyup
    const handleKeyUp = (event) => {
      const moveKeys = ['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'];
      if(moveKeys.includes(event.key)) {
        setPetMoveState(false);
        setFlipPet(false);
      }
    };
	
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
	
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [petXPosition, petYPosition]);

  //change pet type by clicking on it
  const handlePetClick = () => {
    if(pet === 'dog') setPet('trex');
    if(pet === 'trex') setPet('cat');
    if(pet === 'cat') setPet('dog');
  };
	const handlePetDoubleClick = () => {
		const [pet2XPosition, setPet2XPosition] = useState(30);
  		const [pet2YPosition, setPet2YPosition] = useState(30);
  		const [pet2Scale, setPet2Scale] = useState(100);
  		const [pet2MoveState, setPet2MoveState] = useState(false);
  		const [flipPet2, setFlipPet2] = useState(false);
  		const [pet2, setPet2] = useState(props.userInventory.pets[0].file_id);

 }
  //create newPet function 
  //initi new pet coordinates 


  return(
    <div 
      className="petStyle" 
      onClick={handlePetClick}
	  onDoubleClick={handlePetDoubleClick}
      style={
        {
          top: `${petYPosition}%`, 
          left: `${petXPosition}%`,
        }
      }>
      <img 
        src={petMoveState ? petGifPairs[pet] : idleGifPairs[pet]} 
        alt={pet}
        className={flipPet ? 'walkingLeft' : ''} 
        style={
          {
            height: `${petScale}px`,
            width: `${petScale}px`,
          }
        }/>

		<img 
        src={petMoveState ? petGifPairs[pet] : idleGifPairs[pet]} 
        alt={pet}
        className={flipPet ? 'walkingLeft' : ''} 
        style={
          {
            height: `75px`,
            width: `75px`,
          }
        }/>
		
    </div>
  ); 
}

export default Pet;
import React, {useState, useEffect} from 'react';
import '../styles/CreatePet.css';
import cat from '../assets/images/pets/cat/cat_idle.gif';
import walkingCat from '../assets/images/pets/cat/cat_walking.gif';
import dog from '../assets/images/pets/dog/dog_idle.gif';
import walkingDog from '../assets/images/pets/dog/dog_walking.gif';

function CreatePet(props) {
  const { userInfo, setUserPet } = props;
  const [petBreed, setPetBreed] = useState(null);
  const [petName, setPetName] = useState('');
  const [isHoveringCat, setIsHoveringCat] = useState(false);
  const [isHoveringDog, setIsHoveringDog] = useState(false);
  //populate 2 gifs of dog and cat
  //have name form
  //on submit, have a fetch request sent

  useEffect(() => {
    console.log(petBreed);
  }, [petBreed]);

  const handleSubmit = async () => {
    const body = {
      petBreed: petBreed,
      petName: petName,
      user_id: userInfo.currentUser.user_id,
      firstPet: true
    };
    await fetch('/user/adoptAPet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( body )
    });
    setUserPet(true);
  };

  const handleMouseEnter = (pet) => {
    if(pet === 'dog') setIsHoveringDog(true);
    else setIsHoveringCat(true);
  };

  const handleMouseLeave = (pet) => {
    if (pet === 'dog') setIsHoveringDog(false);
    else setIsHoveringCat(false);
  };

  return(
    <form className='loginForm' onSubmit={handleSubmit}>
      <div className='adoptPetBox'>
        <img
          className='adoptPetOption'
          src={(isHoveringCat) ? walkingCat : cat} 
          alt='cat'
          onMouseEnter={() => handleMouseEnter('cat')} 
          onMouseLeave={() => handleMouseLeave('cat')}
          onClick={() => setPetBreed('cat')}
        />
        <img
          className='adoptPetOption'
          src={(isHoveringDog) ? walkingDog : dog}
          alt='dog'
          onMouseEnter={() => handleMouseEnter('dog')}
          onMouseLeave={() => handleMouseLeave('dog')}
          onClick={() => setPetBreed('dog')}
        />
      </div>
      <label>Pet Name: <input onChange={(e) => setPetName(e.target.value)} required className="signup-input"></input></label>
      <button
        type='submit'
        className='createPet-button'
      >Create Pet!</button>
    </form>
  );
}

export default CreatePet;
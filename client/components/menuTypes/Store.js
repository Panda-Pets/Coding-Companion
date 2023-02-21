import React from 'react';
import cat from '../../assets/images/pets/cat/cat_idle.gif';
import dog from '../../assets/images/pets/dog/dog_idle.gif';
import trex from '../../assets/images/pets/trex/trex_idle.gif';

import '../../styles/PopupDisplay.css';


const food = require.context('../../assets/images/food', false, /\.(png|jpe?g|svg)$/);
const toys = require.context('../../assets/images/toys', false, /\.(png|jpe?g|svg)$/);


function Store(props) {
	const { name } = props;
	const petArr = [cat, dog, trex];
	const petStringArr = ['Cat', 'Dog', 'T-Rex'];

	const handleClick = (item, cost) => {

	};
	// fetch(`http://localhost:3000/inventory/:id`
	// method: post
	// include user_id in url
	// req.body: =>

	// expect => successful response
	return(
		<div className="popupDisplay">
			
			<h1 className="menuHeader">{ name }</h1>
		
			<div className='menuSection'>
				<h2>Food</h2>
				<div className="items food">
					{food.keys().map((image, index) => (
						<section key={index} onClick={handleClick(image.slice(2,-4),)}>
							<img src={food(image)} alt={`Image ${index}`}/>
							<p>{image.slice(2,-4)}</p>
							<p>cost: (fetch)</p>
						</section>
					))}
				</div>				
			</div>
			<div className='menuSection'>
				<h2>Toys</h2>
				<div className="items toys">
					{toys.keys().map((image, index) => (
						<section key={index}>
							<img key={index} src={toys(image)} alt={`Image ${index}`}/>
							<p>{image.slice(2,-4)}</p>
						</section>
					))}
				</div>				
			</div>
			<div className='menuSection'>
				<h2>Pets</h2>
				<div className="items pets">
					{petArr.map((image, index) => (
						<section key={index}>
							<img key={index} src={image} alt={`Image ${index}`}/>
							<p>{petStringArr[index]}</p>
						</section>
					))}
				</div>				
			</div>
		</div>
	); 
}

// client/assets/images/food/cow.png
export default Store;
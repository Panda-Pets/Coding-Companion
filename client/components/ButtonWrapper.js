/* eslint-disable react/prop-types */
import React, {useState} from 'react';
import '../styles/ButtonWrapper.css';
import Button from '../components/Button.js';

//styles for main container will be set to false unless user is logged in.

function ButtonWrapper(props) {
  const { handleClick } = props;

  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };
	
  const arr = ['Inventory', 'Algos', 'Store', 'Pet Stats'];
  const buttons = arr.map((el, i) => <Button key={i} name={el} handleClick={handleClick} value={el} />);

  return(
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={`buttonWrapper ${isHovering ? 'visible' : ''}`}>
      {buttons}
    </div>
  ); 
}
export default ButtonWrapper;
import React from 'react';
import AppContext from "../context";

const Info = ({ name, image, description}) => {
    const {setCartOpened} = React.useContext(AppContext);
  return (
    <div className="cartEmpty d-flex align-center justify-content flex-column flex">
        <img 
            className="mb-20" 
            width="120px" 
            src={image} 
            alt="empty" />
    <h2>{name}</h2>
    <p className="opacity-6">{description}</p>
    <button 
    onClick={() => setCartOpened(false)}
    className="greenButton">
      <img src="img/arrow.svg" alt="arrow"/>
        Вернуться назад
    </button>
  </div>
  )
}

export default Info;



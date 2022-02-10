import React from 'react';
import axios from "axios";

import Info from "./Info";
import {useCart} from "../hooks/useCart";


const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function Drawer({ onClose, onRemove, items = [] }) {
  const { cartItems, setCartItems, totalPrice } = useCart();
  const [orderId, setOrderId] = React.useState(null);
  const [isOrderComplete, setIsOrderComplete] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const tax = Math.round(totalPrice * 0.02);

    const onClickOrder = async () => {
      try {
        setIsLoading(true);
        const {data} = await axios.post('https://61f696c22e1d7e0017fd6e00.mockapi.io/order', {
          items: cartItems,
        });
       
        setOrderId(data.id);
        setIsOrderComplete(true);
        setCartItems([]);

      for (let i = 0; i < cartItems.length; i++) {
          const item = cartItems[i];
          await axios.delete('https://61f696c22e1d7e0017fd6e00.mockapi.io/cart' + item.id);
          await delay(1000);
      }

        } catch (error) {
          alert("Не удалось создать заказ :(")
        }
       setIsLoading(false); 
    }

    return (
    <div className="overlay">
        <div className="drawer">
        <h2 className="d-flex justify-between mb-30">Корзина 
        <img onClick={onClose}
        className="removeBtn cu-p" src="img/btn-remove.svg" alt="close" />
        </h2>

      {
        items.length > 0 ? (
          <div className="d-flex flex-column flex">
          <div className="items flex">
        {items.map((obj) => (
          <div key={obj.id} 
          className="cartItem d-flex align-center mb-20">
          <div style={{backgroundImage: `url(${obj.imageUrl})` }} 
          className="cartItemImg">
          </div>
        
          <div className="mr-20 flex">
            <p className="mb-5">{obj.name}</p>
            <b>{obj.price} грн.</b>
          </div>
            <img 
            onClick={() => onRemove(obj.id)}
            className="removeBtn" 
            src="img/btn-remove.svg" 
            alt="btnRemove"
             />
        </div>
        ))}              
    </div>
     <div className="cartTotalBlock">
     <ul>
       <li>
         <span>Итого:</span>
         <div></div>
         <b>{totalPrice} грн.</b>
       </li>
       <li>
         <span>Налог 2%:</span>
         <div></div>
         <b>{tax} грн.</b>
       </li>
     </ul>
     <button 
     disabled={isLoading}
     onClick={onClickOrder}
     className="greenButton">Оформить заказ
       <img src="img/arrow.svg" alt="arrow"/>
     </button>
     </div>
     </div>
         ) : (
           <Info 
           name={isOrderComplete ? "Заказ оформлен" : "Корзина пустая"} 
           description={isOrderComplete 
            ? `Ваш заказ #${orderId} скоро будет передан курьерской доставке` 
            : "Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ" }
           image={isOrderComplete ? "img/complete-order.jpg" : "img/empty-cart.jpg"} />
         )}
  
      </div>
      </div>
    );
}

export default Drawer;
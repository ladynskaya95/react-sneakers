import React from 'react';
import { Route } from "react-router-dom";
import axios from 'axios';

import Header from './components/Header';
import Drawer from './components/Drawer';

import Home from "./pages/Home";
import Orders from './pages/Orders';
import Favourites from "./pages/Favourites";

import AppContext from "./context";


function App() {
  const [items, setItems] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]);
  const [favourites, setFavourites] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState('');
  const [cartOpened, setCartOpened] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);


  React.useEffect(() => {
    async function fetchData() {
      
      try {
        const [cartResponse, favouritesResponse, itemsResponse] = await Promise.all([
         axios.get('https://61f696c22e1d7e0017fd6e00.mockapi.io/cart'),
         axios.get('https://61f696c22e1d7e0017fd6e00.mockapi.io/favourites'),
         axios.get('https://61f696c22e1d7e0017fd6e00.mockapi.io/items')
        ]);
        
        setIsLoading(false);
     
        setCartItems(cartResponse.data);
        setFavourites(favouritesResponse.data);
        setItems(itemsResponse.data);
      } catch (error) {
        alert('Ошибка при запросе данных ;(');
      }
    
    }
    fetchData();
  }, []);

  const onAddToCart = async (obj) => {
    try {
      const findItem = cartItems.find((item) => Number(item.parentId) === Number(obj.id));
      if (findItem) {
        setCartItems((prev) => prev.filter((item) => Number(item.parentId) !== Number(obj.id)));
        await axios.delete(`https://61f696c22e1d7e0017fd6e00.mockapi.io/cart/${findItem.id}`);
      } else {
        const {data} = await axios.post('https://61f696c22e1d7e0017fd6e00.mockapi.io/cart', obj);
        setCartItems((prev) => prev.map((item) => {
          if (item.parentId === data.parentId) {
            return {
            ...item,
            id: data.id
          };
        } return item;
        }));
     } 
    } catch (error) {
      alert('Ошибка при добавлении в корзину');
    }
    
   
  };

  const onRemoveItem = (id) => {
    try {
      axios.delete(`https://61f696c22e1d7e0017fd6e00.mockapi.io/cart/${id}`);
      setCartItems((prev) => prev.filter((item) => Number(item.id) !== Number(id)));
    } catch (error) {
      alert('Ошибка при удалении из корзины');
    }
  };

  const onAddToFavourite = async (obj) => {
  try {
    if (favourites.find((favObj) => Number(favObj.id) === Number(obj.id))) {
      axios.delete(`https://61f696c22e1d7e0017fd6e00.mockapi.io/favourites/${obj.id}`); 
      setFavourites((prev) => prev.filter((item) => Number(item.id) !== Number(obj.id)));
    } else {
      const { data } = await axios.post('https://61f696c22e1d7e0017fd6e00.mockapi.io/favourites', obj);
      setFavourites((prev) => [...prev, data]);
    }
  } catch (error) {
    alert('Не удалось добавить в фавориты');
  }
   
  };

   const onChangeSearchInput = (e) => {
    setSearchValue(e.target.value)
   }

   const isItemAdded = (id) => {
    return cartItems.some((obj) => Number(obj.parentId) === Number(id))
   };

  return (
  <AppContext.Provider 
  value={{ 
    cartItems, 
    favourites, 
    items, 
    isItemAdded, 
    onAddToFavourite, 
    onAddToCart,
    setCartOpened, 
    setCartItems }}>
    <div className="wrapper clear">
    {cartOpened && 
    <Drawer 
      items={cartItems}
      onClose={() => setCartOpened(false)} 
      onRemove={onRemoveItem}
      opened={cartOpened} />}
    <Header onClickCart={() => setCartOpened(true)}  />
      <Route path="/" exact>
        <Home 
        items={items} 
        searchValue={searchValue} 
        cartItems={cartItems}
        setSearchValue={setSearchValue} 
        onChangeSearchInput={onChangeSearchInput}
        onAddToFavourite={onAddToFavourite}
        onAddToCart={onAddToCart}
        isLoading={isLoading} />
      </Route>
      <Route path="/favourites" exact>
        <Favourites />
      </Route>

      <Route path="/orders" exact>
        <Orders />
      </Route>
   
  </div>
  </AppContext.Provider>
  );
}

export default App;

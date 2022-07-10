import React, { useState, useEffect, useContext } from 'react';
import { useCallback } from 'react';

const url = 'http://localhost:8080/api/public/foods';

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [foods, setFoods] = useState([]);

  
  const fetchFoods = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${url}${searchTerm}`);
      const data = await response.json();
      const { foods } = data;
      console.log(data);



      /*"foodId": 32,
        "name": "15",
        "price": 3333.3,
        "quantity": 100,
        "status": "AVAILABLE",
        "description": "description",
        "categoryId": 31,
        "images": [],
        "rate": 0.0 */



      if (foods) {
        const newFoods = foods.map((item) => {
          const { foodId, name, quantity, status, description, categoryId , images , rate} =
            item;
          return {
            foodId: foodId,
            name: name,
            quantity: quantity,
            status: status,
            description: description,
            categoryId: categoryId,
            images: images,
            rate: rate,
          };
        });
        setFoods(newFoods);
        console.log(newFoods);
      } else {
        setFoods([]);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };



  
  useEffect(() => {
    fetchFoods();
  }, [searchTerm]);

  return (
    <AppContext.Provider
      value={{
        loading,
        searchTerm,
        foods,
        setSearchTerm,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };

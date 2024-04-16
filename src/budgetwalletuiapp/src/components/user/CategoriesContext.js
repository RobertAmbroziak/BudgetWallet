import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import { useUser } from "../../UserContext";

const CategoriesContext = createContext();

export const useCategories = () => useContext(CategoriesContext);

export const CategoriesProvider = ({ children }) => {
  const { jwtToken } = useUser();
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    if (!jwtToken) return;
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}${config.API_ENDPOINTS.CATEGORIES}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const updateCategories = (updatedCategories) => {
    setCategories(updatedCategories);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CategoriesContext.Provider
      value={{ categories, fetchCategories, updateCategories }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios, { AxiosResponse } from "axios";
import config from "./../config";
import { useUser } from "./userContext";
import { Category } from "../types/api/category";

interface CategoryContextType {
  categories: Category[];
  fetchCategories: () => Promise<void>;
  updateCategories: (updatedCategories: Category[]) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

export const useCategories = (): CategoryContextType => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
};

interface CategoryProviderProps {
  children: ReactNode;
}

export const CategoryProvider: React.FC<CategoryProviderProps> = ({
  children,
}) => {
  const { jwtToken } = useUser();
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    if (!jwtToken) return;
    try {
      const response: AxiosResponse<Category[]> = await axios.get(
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

  const updateCategories = (updatedCategories: Category[]) => {
    setCategories(updatedCategories);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider
      value={{ categories, fetchCategories, updateCategories }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

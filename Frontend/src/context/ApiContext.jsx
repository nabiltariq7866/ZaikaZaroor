import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useSnackBar } from "../hooks/useSnackBar";
const ApiContext = createContext();

const errorHandling = (error, showSnackbar) => {
  const message = error.response?.data?.message;
  const errorMes = error.response?.data?.error;
  if (typeof message === "object" && message !== null) {
    Object.entries(message).forEach(([field, messages]) => {
      if (Array.isArray(messages)) {
        messages.forEach((msg) => showSnackbar(`${field}: ${msg}`));
      } else {
        showSnackbar(`${field}: ${messages}`);
      }
    });
  } else {
    if (error.config.url === "user") return;
    if (message) showSnackbar(message, "error");
    if (errorMes && errorMes !== message) showSnackbar(errorMes);
  }
};
export const ApiProvider = ({ children }) => {
  const { success, error: showError } = useSnackBar();
  const [loading, setLoading] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const apiClient = axios.create({
    baseURL: "http://localhost:8000/api/", // Aapka base URL
    withCredentials: true,
  });

  apiClient.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        setLoading((prev) => ({ ...prev, getProfile: true }));
        const response = await apiClient.get("user");
        setUser(response.data.user);
        setIsAuthenticated(true);
        setLoading((prev) => ({ ...prev, getProfile: false }));
      } catch (err) {
        errorHandling(err, showError);
        setIsAuthenticated(false);

        setUser(null);
        Cookies.remove("token"); // Ghalat token remove karein
      } finally {
        setLoading((prev) => ({ ...prev, getProfile: false }));
      }
    };

    checkUserStatus();
  }, []);
  const registerUser = async (payload) => {
    setLoading((prev) => ({ ...prev, registerUser: true }));
    try {
      const response = await apiClient.post("register", payload);
      success(response.data.message);
      return { success: true };
    } catch (err) {
      errorHandling(err, showError);
      return { success: false };
    } finally {
      setLoading((prev) => ({ ...prev, registerUser: false }));
    }
  };

  const verifyOtp = async (payload) => {
    setLoading((prev) => ({ ...prev, verifyOtp: true }));
    try {
      const response = await apiClient.post("verify-otp", payload);
      success(response.data.message);
      return { success: true };
    } catch (err) {
      errorHandling(err, showError);
      return { success: false };
    } finally {
      setLoading((prev) => ({ ...prev, verifyOtp: false }));
    }
  };
  const [user, setUser] = useState({});
  const loginUser = async (payload) => {
    setLoading((prev) => ({ ...prev, loginUser: true }));
    try {
      const response = await apiClient.post("login", payload);
      if (response?.data?.token) {
        Cookies.set("token", response.data.token, { expires: 7 });
      }
      setIsAuthenticated(true);

      setUser(response?.data?.user);
      success(response.data.message);
      return { success: true };
    } catch (err) {
      setIsAuthenticated(false);

      errorHandling(err, showError);

      return { success: false };
    } finally {
      setLoading((prev) => ({ ...prev, loginUser: false }));
    }
  };

  const forgotPassword = async (payload) => {
    setLoading((prev) => ({ ...prev, forgotPassword: true }));
    try {
      const response = await apiClient.post("forgotPassword", payload);
      success(response.data.message);
      return { success: true };
    } catch (err) {
      errorHandling(err, showError);
      return { success: false };
    } finally {
      setLoading((prev) => ({ ...prev, forgotPassword: false }));
    }
  };

  const googleAuth = async (payload) => {
    setLoading((prev) => ({ ...prev, googleAuth: true }));
    try {
      const response = await apiClient.post("google-auth", payload);
      if (response?.data?.token) {
        Cookies.set("token", response.data.token, { expires: 7 });
      }
      setUser(response?.data?.user);
      setIsAuthenticated(true);

      success(response.data.message);
      return { success: true };
    } catch (err) {
      setIsAuthenticated(false);

      errorHandling(err, showError);
      return { success: false };
    } finally {
      setLoading((prev) => ({ ...prev, googleAuth: false }));
    }
  };

  const resetPassword = async (token, payload) => {
    setLoading((prev) => ({ ...prev, resetPassword: true }));
    try {
      const response = await apiClient.put(`resetPassword/${token}`, payload);
      success(response.data.message);
      return { success: true };
    } catch (err) {
      errorHandling(err, showError);
      return { success: false };
    } finally {
      setLoading((prev) => ({ ...prev, resetPassword: false }));
    }
  };

  const getProfile = async () => {
    setLoading((prev) => ({ ...prev, getProfile: true }));
    try {
      const response = await apiClient.get("user");
      return { success: true, user: response.data.user };
    } catch (err) {
      errorHandling(err, showError);

      return { success: false };
    } finally {
      setLoading((prev) => ({ ...prev, getProfile: false }));
    }
  };
  const [shop, setShop] = useState(null);

  const getMyShop = async () => {
    setLoading((prev) => ({ ...prev, getMyShop: true }));
    try {
      const response = await apiClient.get("shop");
      setShop(response.data.shop);
      return { success: true };
    } catch (err) {
      errorHandling(err, showError);

      return { success: false };
    } finally {
      setLoading((prev) => ({ ...prev, getMyShop: false }));
    }
  };
  const createShop = async (payload) => {
    setLoading((prev) => ({ ...prev, createShop: true }));
    try {
      const response = await apiClient.post("shop", payload);
      getMyShop();
      success(response.data.message);
      return { success: true };
    } catch (err) {
      errorHandling(err, showError);
      return { success: false };
    } finally {
      setLoading((prev) => ({ ...prev, createShop: false }));
    }
  };
  const updateShop = async (id, payload) => {
    setLoading((prev) => ({ ...prev, updateShop: true }));
    try {
      const response = await apiClient.post(`shop/${id}`, payload);
      getMyShop();
      success(response.data.message);
      return { success: true };
    } catch (err) {
      errorHandling(err, showError);
      return { success: false };
    } finally {
      setLoading((prev) => ({ ...prev, updateShop: false }));
    }
  };

  const logoutUser = async () => {
    setLoading((prev) => ({ ...prev, logoutUser: true }));
    try {
      const response = await apiClient.get("logout");
      Cookies.remove("token"); // Cookie remove ki
      success(response.data.message);

      return { success: true };
    } catch (err) {
      errorHandling(err, showError);
      Cookies.remove("token"); // Agar API fail ho tab bhi cookie remove karein
      return { success: false };
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setLoading((prev) => ({ ...prev, logoutUser: false }));
    }
  };
  const [items, setItems] = useState([]);
  const getMyItems = async () => {
    setLoading((prev) => ({ ...prev, getMyItems: true }));
    try {
      const response = await apiClient.get("item"); // GET /api/item
      setItems(response.data.items); // State update ki
      return { success: true, items: response.data.items };
    } catch (err) {
      errorHandling(err, showError);
      return { success: false };
    } finally {
      setLoading((prev) => ({ ...prev, getMyItems: false }));
    }
  };

  const createItem = async (payload) => {
    setLoading((prev) => ({ ...prev, createItem: true }));
    try {
      const response = await apiClient.post("item", payload); // POST /api/item
      success(response.data.message);
       getMyItems(); // List refresh ki
      return { success: true };
    } catch (err) {
      errorHandling(err, showError);
      return { success: false };
    } finally {
      setLoading((prev) => ({ ...prev, createItem: false }));
    }
  };

  const updateItem = async (id, payload) => {
    setLoading((prev) => ({ ...prev, updateItem: true }));
    try {
      // Aapke routes ke mutabiq POST use kar rahe hain
      const response = await apiClient.post(`item/${id}`, payload); // POST /api/item/:id
      success(response.data.message);
       getMyItems(); // List refresh ki
      return { success: true };
    } catch (err) {
      errorHandling(err, showError);
      return { success: false };
    } finally {
      setLoading((prev) => ({ ...prev, updateItem: false }));
    }
  };
 const deleteItem = async (id) => {
    setLoading((prev) => ({ ...prev, deleteItem: true }));
    try {
      const response = await apiClient.delete(`item/${id}`); 
      success(response.data.message);
       getMyItems(); // List refresh ki
      return { success: true };
    } catch (err) {
      errorHandling(err, showError);
      return { success: false };
    } finally {
      setLoading((prev) => ({ ...prev, deleteItem: false }));
    }
  };
  const value = {
    loading,
    registerUser,
    verifyOtp,
    loginUser,
    forgotPassword,
    googleAuth,
    resetPassword,
    getProfile,
    logoutUser,
    user,
    isAuthenticated,
    getMyShop,
    createShop,
    shop,
    updateShop,
    getMyItems, 
    createItem, 
    updateItem,
    items,
    deleteItem
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error("useApi ko ApiProvider ke andar hi use karna hai");
  }
  return context;
};

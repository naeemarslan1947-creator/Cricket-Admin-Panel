"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import store from "../../redux/store";
import { setUser } from "../../redux/actions";
import { AuthUser } from "../types/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Restore user from localStorage on initial load
    const storedUser = localStorage.getItem('user');
    const isAuth = localStorage.getItem('auth') === 'true';
    
    if (storedUser && isAuth) {
      try {
        const userData = JSON.parse(storedUser) as AuthUser;
        if (userData && userData._id) {
          store.dispatch(setUser(userData));
        }
      } catch (error) {
        console.error('Failed to restore user from localStorage:', error);
      }
    }
    
    setIsHydrated(true);
  }, []);

  return (
    <Provider store={store}>
      {children}
      <ToastContainer />
    </Provider>
  );
}


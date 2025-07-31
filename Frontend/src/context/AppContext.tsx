// src/context/AppContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback
} from 'react';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { Gift, UserData, CartItem, Reminder, Friend } from '../types';
import { 
  getUserData,
  getAllUsers, 
  addFriendToUser, 
  removeFriendFromUser,
  addReminderToUser,
  removeReminderFromUser,
  addGiftToWishlist,
  removeGiftFromWishlist
} from '../services/userService';
import { mapCategory } from '../../public/Data/categoryMap';

interface AppContextType {
  currentUser: FirebaseUser | null;
  authLoading: boolean;
  firebaseLogin: (email: string, password: string) => Promise<void>;
  firebaseSignup: (email: string, password: string) => Promise<void>;
  firebaseLogout: () => Promise<void>;
  userData: UserData | null;
  refreshUserData: () => Promise<void>;
  users: UserData[];
  refreshUsers: () => Promise<void>;
  addFriend: (friend: Friend) => Promise<void>;
  removeFriend: (friendEmail: string) => Promise<void>;
  gifts: Gift[];
  cart: CartItem[];
  wishlist: Gift[];
  reminders: Reminder[];
  isLoading: boolean;
  addToCart: (gift: Gift, quantity?: number) => void;
  removeFromCart: (giftId: string) => void;
  updateCartQuantity: (giftId: string, quantity: number) => void;
  addToWishlist: (gift: Gift) => Promise<void>;
  removeFromWishlist: (giftId: string) => Promise<void>;
  addReminder: (reminder: Reminder) => Promise<void>;
  removeReminder: (reminderId: string) => Promise<void>;

}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Gift[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const reminders = userData?.reminders || [];

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/Data/amazon_products_random_10k_with_categories.json');
        const raw = await res.json();
        const transformed = raw.map((gift: any) => ({
          asin: gift.asin,
          title: gift.title,
          imgUrl: gift.imgUrl,
          stars: gift.stars,
          reviews: gift.reviews,
          price: gift.price,
          categories: [mapCategory(gift.category)],
          productURL: gift.productURL,
        }));
        setGifts(transformed);

        const sCart = localStorage.getItem('cart');
        if (sCart) setCart(JSON.parse(sCart));

        if (!currentUser) {
          const sWish = localStorage.getItem('wishlist');
          if (sWish) setWishlist(JSON.parse(sWish));
        }
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!currentUser) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, currentUser]);

  useEffect(() => {
    if (userData && userData.wishlist) {
      setWishlist(userData.wishlist);
    } else if (currentUser && userData) {
      setWishlist([]);
    }
  }, [userData, currentUser]);

  const addToCart = (gift: Gift, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.gift.asin === gift.asin);
      if (existingItem) {
        return prevCart.map(item => 
          item.gift.asin === gift.asin 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        return [...prevCart, { gift, quantity }];
      }
    });
  };

  const removeFromCart = (giftId: string) => {
    setCart(prevCart => prevCart.filter(item => item.gift.asin !== giftId));
  };

  const updateCartQuantity = (giftId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(giftId);
      return;
    }
    setCart(prevCart => 
      prevCart.map(item => 
        item.gift.asin === giftId ? { ...item, quantity } : item
      )
    );
  };

  const firebaseLogin = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const firebaseSignup = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const firebaseLogout = async () => {
    await signOut(auth);
    setUserData(null);
    setWishlist([]);
    localStorage.removeItem('wishlist');
  };

  const refreshUserData = useCallback(async () => {
    if (currentUser) {
      try {
        const data = await getUserData(currentUser.uid);
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  }, [currentUser]);

  const refreshUsers = async () => {
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const addFriend = useCallback(async (friend: Friend) => {
    if (!currentUser) throw new Error('No authenticated user');
    try {
      await addFriendToUser(currentUser.uid, friend);
      await refreshUserData();
    } catch (error) {
      console.error('Error adding friend:', error);
      throw error;
    }
  }, [currentUser, refreshUserData]);

  const removeFriend = useCallback(async (friendEmail: string) => {
    if (!currentUser) throw new Error('No authenticated user');
    try {
      await removeFriendFromUser(currentUser.uid, friendEmail);
      await refreshUserData();
    } catch (error) {
      console.error('Error removing friend:', error);
      throw error;
    }
  }, [currentUser, refreshUserData]);

  const addReminder = useCallback(async (reminder: Reminder) => {
    if (!currentUser) throw new Error('No authenticated user');
    try {
      await addReminderToUser(currentUser.uid, reminder);
      await refreshUserData();
    } catch (error) {
      console.error('Error adding reminder:', error);
      throw error;
    }
  }, [currentUser, refreshUserData]);

  const removeReminder = useCallback(async (reminderId: string) => {
    if (!currentUser) throw new Error('No authenticated user');
    try {
      await removeReminderFromUser(currentUser.uid, reminderId);
      await refreshUserData();
    } catch (error) {
      console.error('Error removing reminder:', error);
      throw error;
    }
  }, [currentUser, refreshUserData]);

  const addToWishlist = useCallback(async (gift: Gift) => {
    const isAlreadyInWishlist = wishlist.some(item => item.asin === gift.asin);
    if (isAlreadyInWishlist) return;

    if (currentUser) {
      try {
        await addGiftToWishlist(currentUser.uid, gift);
        await refreshUserData();
      } catch (error) {
        console.error('Error adding gift to wishlist:', error);
        throw error;
      }
    } else {
      setWishlist(prevWishlist => [...prevWishlist, gift]);
    }
  }, [wishlist, currentUser, refreshUserData]);

  const removeFromWishlist = useCallback(async (giftId: string) => {
    if (currentUser) {
      try {
        await removeGiftFromWishlist(currentUser.uid, giftId);
        await refreshUserData();
      } catch (error) {
        console.error('Error removing gift from wishlist:', error);
        throw error;
      }
    } else {
      setWishlist(prevWishlist => prevWishlist.filter(gift => gift.asin !== giftId));
    }
  }, [currentUser, refreshUserData]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      if (!user) setUserData(null);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (currentUser && !authLoading) {
      refreshUserData();

      const localWishlist = localStorage.getItem('wishlist');
      if (localWishlist) {
        try {
          const wishlistItems = JSON.parse(localWishlist);
          wishlistItems.forEach(async (gift: Gift) => {
            try {
              await addGiftToWishlist(currentUser.uid, gift);
            } catch (error) {
              console.error('Error migrating wishlist item:', error);
            }
          });
          localStorage.removeItem('wishlist');
          setTimeout(() => refreshUserData(), 1000);
        } catch (error) {
          console.error('Error parsing localStorage wishlist:', error);
        }
      }
    }
  }, [currentUser, authLoading, refreshUserData]);

  useEffect(() => {
    const loadAllUsers = async () => {
      try {
        const allUsers = await getAllUsers();
        setUsers(allUsers);
      } catch (error) {
        console.error('Error loading users:', error);
        setUsers([]);
      }
    };
    loadAllUsers();
  }, []);

  

  const value: AppContextType = {
    currentUser,
    authLoading,
    firebaseLogin,
    firebaseSignup,
    firebaseLogout,
    userData,
    refreshUserData,
    users,
    refreshUsers,
    addFriend,
    removeFriend,
    gifts,
    cart,
    wishlist,
    reminders,
    isLoading,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    addToWishlist,
    removeFromWishlist,
    addReminder,
    removeReminder,
  };

  return <AppContext.Provider value={value}>{!authLoading && children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export const useAuth = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAuth must be used within AppProvider');
  return {
    currentUser: ctx.currentUser,
    loading: ctx.authLoading,
    login: ctx.firebaseLogin,
    signup: ctx.firebaseSignup,
    logout: ctx.firebaseLogout
  };
};

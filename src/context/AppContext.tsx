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
import { Gift, User, CartItem, Reminder, Friend, LoginCredentials } from '../types';
import { mockGifts } from '../data/mockData';
import { getUserData, UserData } from '../services/userService';
// import { mockUsers } from '../data/mockUsers';

const API_URL = 'http://localhost:3001';

interface AppContextType {
  // Firebase Auth
  currentUser: FirebaseUser | null;
  authLoading: boolean;
  firebaseLogin: (email: string, password: string) => Promise<void>;
  firebaseSignup: (email: string, password: string) => Promise<void>;
  firebaseLogout: () => Promise<void>;
  
  // User Data from Firestore
  userData: UserData | null;
  refreshUserData: () => Promise<void>;
  
  // Existing App State
  gifts: Gift[];
  user: User | null;
  users: User[];
  cart: CartItem[];
  wishlist: Gift[];
  reminders: Reminder[];
  isLoading: boolean;

  /* friend management */
  addFriend: (friend: Friend) => void;
  removeFriend: (email: string) => void;

  /* cart/wishlist omitted for brevity… */
  addToCart: (gift: Gift, quantity?: number) => void;
  removeFromCart: (giftId: string) => void;
  updateCartQuantity: (giftId: string, quantity: number) => void;
  addToWishlist: (gift: Gift) => void;
  removeFromWishlist: (giftId: string) => void;

  /* reminders */
  addReminder: (reminder: Reminder) => void;
  removeReminder: (reminderId: string) => void;

  /* legacy auth - keeping for backward compatibility */
  login: (credentials: LoginCredentials) => Promise<void>; 
  logout: () => Promise<void>;

  /* recommendations */
  getRecommendedGifts: (
    occasion?: string,
    priceRange?: { min: number; max: number },
    user?: User
  ) => Gift[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  
  // Existing App State
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Gift[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // — Load initial data: gifts, users, and localStorage —
  useEffect(() => {
    const checkSession  = async () => {
      setIsLoading(true);
      try {
        setGifts(mockGifts);
        // setUsers(mockUsers);

        const response = await fetch(`${API_URL}/api/me`, {
          credentials: 'include', // Important: sends cookies
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user); // Set user if session exists
        }

        const sCart = localStorage.getItem('cart');
        if (sCart) setCart(JSON.parse(sCart));

        const sWish = localStorage.getItem('wishlist');
        if (sWish) setWishlist(JSON.parse(sWish));

        const sRem = localStorage.getItem('reminders');
        if (sRem) setReminders(JSON.parse(sRem));
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  // — Persist cart, wishlist, reminders, and user whenever they change —
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('reminders', JSON.stringify(reminders));
  }, [reminders]);

  // useEffect(() => {
  //   if (user) localStorage.setItem('user', JSON.stringify(user));
  //   else localStorage.removeItem('user');
  // }, [user]);

  // — Friend management —
  const addFriend = (friend: Friend) => {
    if (!user) return;
    setUser({ ...user, friends: [...user.friends, friend] });
  };
  const removeFriend = (email: string) => {
    if (!user) return;
    setUser({
      ...user,
      friends: user.friends.filter(f => f.mail !== email)
    });
  };

  // — Reminder management (fixed!) —
  const addReminder = (reminder: Reminder) => {
    setReminders(rs => [...rs, reminder]);
  };
  const removeReminder = (reminderId: string) => {
    setReminders(rs => rs.filter(r => r.id !== reminderId));
  };

  // — Stubs / placeholders for other methods (implement as you wish) —
    const addToCart = (gift: Gift, quantity = 1) => {
      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.gift.id === gift.id);
        
        if (existingItem) {
          return prevCart.map(item => 
            item.gift.id === gift.id 
              ? { ...item, quantity: item.quantity + quantity } 
              : item
          );
        } else {
          return [...prevCart, { gift, quantity }];
        }
      });
    };
    const removeFromCart = (giftId: string) => {
    setCart(prevCart => prevCart.filter(item => item.gift.id !== giftId));
  };
    const updateCartQuantity = (giftId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(giftId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.gift.id === giftId ? { ...item, quantity } : item
      )
    );
  };
  const addToWishlist = (gift: Gift) => {
    setWishlist(prevWishlist => {
      const isAlreadyInWishlist = prevWishlist.some(item => item.id === gift.id);
      if (isAlreadyInWishlist) return prevWishlist;
      return [...prevWishlist, gift];
    });
  };

  const removeFromWishlist = (giftId: string) => {
    setWishlist(prevWishlist => prevWishlist.filter(gift => gift.id !== giftId));
  };


  const login = async (credentials: LoginCredentials) => {
    const response = await fetch(`${API_URL}/api/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (response.ok) {
      const data = await response.json();
      setUser(data.user);
    } else {
      // You can throw an error to be caught by the component calling login
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to login');
    }
  };

  
  const logout = async () => {
    const response = await fetch(`${API_URL}/api/logout`, {
      method: 'POST',
       credentials: 'include', // Important: sends cookies
    });

    if (response.ok) {
      setUser(null);
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to logout');
    }
  };

  // Firebase Auth Functions
  const firebaseLogin = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const firebaseSignup = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const firebaseLogout = async () => {
    await signOut(auth);
    // Clear app data on logout
    setUserData(null);
    setUser(null);
    setReminders([]);
  };

  // Fetch user data from Firestore
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

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      
      if (!user) {
        // Clear app data when user logs out
        setUserData(null);
      }
    });

    return unsubscribe;
  }, []);

  // Load user data when Firebase user changes
  useEffect(() => {
    if (currentUser && !authLoading) {
      refreshUserData();
    }
  }, [currentUser, authLoading, refreshUserData]);

  const getRecommendedGifts = (
    occasion?: string,
  priceRange?: { min: number; max: number },
    profileUser?: User
  ): Gift[] => {
    let recs = [...gifts];

    // Filter by priceRange if given
    if (priceRange) {
      recs = recs.filter(g =>
        g.price >= priceRange.min &&
        (priceRange.max === Infinity || g.price <= priceRange.max)
      );
    }

    // Now tailor by the full user profile if available:
    if (profileUser) {
      // 1) Hobbies → categories
      if (profileUser.hobbies.length) {
        recs = recs.filter(g =>
          g.categories.some(cat =>
            profileUser.hobbies.some(h =>
              cat.toLowerCase().includes(h.toLowerCase())
            )
          )
        );
      }

      // 2) Age: example—if under 18, prefer “Kids” category
      if (profileUser.age < 18) {
        recs = recs.filter(g =>
          g.categories.some(cat =>
            /kid|child|baby/i.test(cat)
          )
        );
      }

      // 3) Gender: example—if female, prefer “Women’s Clothing”
      if (profileUser.gender.toLowerCase() === 'female') {
        recs = recs.filter(g =>
          /women/i.test(g.categories.join(' '))
        );
      }
    }

    // Sort by rating (or any other metric)
    recs.sort((a, b) => b.rating - a.rating);

    return recs;
  };
  const value: AppContextType = {
    // Firebase Auth
    currentUser,
    authLoading,
    firebaseLogin,
    firebaseSignup,
    firebaseLogout,
    
    // User Data
    userData,
    refreshUserData,
    
    // Existing App State
    gifts,
    users,
    user,
    cart,
    wishlist,
    reminders,
    isLoading,
    addFriend,
    removeFriend,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    addToWishlist,
    removeFromWishlist,
    addReminder,
    removeReminder,
    login,
    logout,
    getRecommendedGifts
  };

  return <AppContext.Provider value={value}>{!authLoading && children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

// Convenience hook for Firebase auth (backward compatibility with AuthContext)
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

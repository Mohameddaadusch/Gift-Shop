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
import { mockGifts } from '../data/mockData';
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
// import { mockUsers } from '../data/mockUsers';

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
  
  // All Users for Friends functionality
  users: UserData[];
  refreshUsers: () => Promise<void>;
  
  // Friend Management
  addFriend: (friend: Friend) => Promise<void>;
  removeFriend: (friendEmail: string) => Promise<void>;
  
  // Existing App State
  gifts: Gift[];
  cart: CartItem[];
  wishlist: Gift[];
  reminders: Reminder[];
  isLoading: boolean;

  /* cart/wishlist omitted for brevity… */
  addToCart: (gift: Gift, quantity?: number) => void;
  removeFromCart: (giftId: string) => void;
  updateCartQuantity: (giftId: string, quantity: number) => void;
  addToWishlist: (gift: Gift) => Promise<void>;
  removeFromWishlist: (giftId: string) => Promise<void>;

  /* reminders */
  addReminder: (reminder: Reminder) => Promise<void>;
  removeReminder: (reminderId: string) => Promise<void>;

  /* recommendations */
  getRecommendedGifts: (
    occasion?: string,
    priceRange?: { min: number; max: number },
    user?: UserData
  ) => Gift[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  
  // Users for Friends functionality
  const [users, setUsers] = useState<UserData[]>([]);
  
  // Existing App State
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Gift[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Computed reminders from userData
  const reminders = userData?.reminders || [];

  // — Load initial data: gifts and localStorage for non-authenticated state —
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        setGifts(mockGifts);

        const sCart = localStorage.getItem('cart');
        if (sCart) setCart(JSON.parse(sCart));

        // Only load wishlist from localStorage if user is not authenticated
        // When authenticated, wishlist will be loaded from Firestore via userData
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

  // — Persist cart and wishlist whenever they change —
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Only persist wishlist to localStorage if user is not authenticated
  useEffect(() => {
    if (!currentUser) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, currentUser]);

  // Update local wishlist state when userData changes (from Firestore)
  useEffect(() => {
    if (userData && userData.wishlist) {
      setWishlist(userData.wishlist);
    } else if (currentUser && userData) {
      // User is authenticated but has no wishlist in Firestore
      setWishlist([]);
    }
  }, [userData, currentUser]);

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
    setWishlist([]);
    // Clear localStorage wishlist
    localStorage.removeItem('wishlist');
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

  // Fetch all users from Firestore
  const refreshUsers = async () => {
    try {
      console.log('Fetching all users from Firestore...');
      const allUsers = await getAllUsers();
      console.log('Users fetched:', allUsers.length, allUsers);
      
      if (allUsers.length === 0) {
        console.warn('No users found in Firestore. This might be expected if no users have signed up yet.');
      }
      
      setUsers(allUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Set empty array on error to prevent undefined issues
      setUsers([]);
    }
  };

  // Add friend to current user
  const addFriend = useCallback(async (friend: Friend) => {
    if (!currentUser) {
      throw new Error('No authenticated user');
    }
    
    try {
      await addFriendToUser(currentUser.uid, friend);
      // Refresh user data to get updated friends list
      await refreshUserData();
    } catch (error) {
      console.error('Error adding friend:', error);
      throw error;
    }
  }, [currentUser, refreshUserData]);

  // Remove friend from current user
  const removeFriend = useCallback(async (friendEmail: string) => {
    if (!currentUser) {
      throw new Error('No authenticated user');
    }
    
    try {
      await removeFriendFromUser(currentUser.uid, friendEmail);
      // Refresh user data to get updated friends list
      await refreshUserData();
    } catch (error) {
      console.error('Error removing friend:', error);
      throw error;
    }
  }, [currentUser, refreshUserData]);

  // Reminder Management (using Firestore)
  const addReminder = useCallback(async (reminder: Reminder) => {
    if (!currentUser) {
      throw new Error('No authenticated user');
    }
    
    try {
      await addReminderToUser(currentUser.uid, reminder);
      // Refresh user data to get updated reminders list
      await refreshUserData();
    } catch (error) {
      console.error('Error adding reminder:', error);
      throw error;
    }
  }, [currentUser, refreshUserData]);

  const removeReminder = useCallback(async (reminderId: string) => {
    if (!currentUser) {
      throw new Error('No authenticated user');
    }
    
    try {
      await removeReminderFromUser(currentUser.uid, reminderId);
      // Refresh user data to get updated reminders list
      await refreshUserData();
    } catch (error) {
      console.error('Error removing reminder:', error);
      throw error;
    }
  }, [currentUser, refreshUserData]);

  // Wishlist Management (using Firestore for authenticated users)
  const addToWishlist = useCallback(async (gift: Gift) => {
    // Check if gift is already in wishlist
    const isAlreadyInWishlist = wishlist.some(item => item.id === gift.id);
    if (isAlreadyInWishlist) return;

    if (currentUser) {
      // User is authenticated - save to Firestore
      try {
        await addGiftToWishlist(currentUser.uid, gift);
        // Refresh user data to get updated wishlist
        await refreshUserData();
      } catch (error) {
        console.error('Error adding gift to wishlist:', error);
        throw error;
      }
    } else {
      // User is not authenticated - save to local state and localStorage
      setWishlist(prevWishlist => [...prevWishlist, gift]);
    }
  }, [wishlist, currentUser, refreshUserData]);

  const removeFromWishlist = useCallback(async (giftId: string) => {
    if (currentUser) {
      // User is authenticated - remove from Firestore
      try {
        await removeGiftFromWishlist(currentUser.uid, giftId);
        // Refresh user data to get updated wishlist
        await refreshUserData();
      } catch (error) {
        console.error('Error removing gift from wishlist:', error);
        throw error;
      }
    } else {
      // User is not authenticated - remove from local state
      setWishlist(prevWishlist => prevWishlist.filter(gift => gift.id !== giftId));
    }
  }, [currentUser, refreshUserData]);

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
      
      // Migrate localStorage wishlist to Firestore if user just logged in
      const localWishlist = localStorage.getItem('wishlist');
      if (localWishlist) {
        try {
          const wishlistItems = JSON.parse(localWishlist);
          if (wishlistItems.length > 0) {
            // Add each item to Firestore wishlist
            wishlistItems.forEach(async (gift: Gift) => {
              try {
                await addGiftToWishlist(currentUser.uid, gift);
              } catch (error) {
                console.error('Error migrating wishlist item:', error);
              }
            });
            // Clear localStorage after migration
            localStorage.removeItem('wishlist');
            // Refresh user data to get the updated wishlist from Firestore
            setTimeout(() => refreshUserData(), 1000);
          }
        } catch (error) {
          console.error('Error parsing localStorage wishlist:', error);
        }
      }
    }
  }, [currentUser, authLoading, refreshUserData]);

  // Load all users when component mounts
  useEffect(() => {
    const loadAllUsers = async () => {
      try {
        console.log('Loading all users on app start...');
        const allUsers = await getAllUsers();
        console.log('Users loaded:', allUsers.length, allUsers);
        
        if (allUsers.length === 0) {
          console.log('No users found in database - this is normal if no one has signed up yet');
        }
        
        setUsers(allUsers);
      } catch (error) {
        console.error('Error loading users:', error);
        // On error, set empty array
        setUsers([]);
      }
    };
    
    loadAllUsers();
  }, []); // Empty dependency array - only run once on mount

  const getRecommendedGifts = (
    _occasion?: string, // Using underscore to indicate intentionally unused parameter
    priceRange?: { min: number; max: number },
    profileUser?: UserData
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

    console.log(profileUser, recs);

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
    
    // Users and Friends
    users,
    refreshUsers,
    addFriend,
    removeFriend,
    
    // Existing App State
    gifts,
    // user,
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

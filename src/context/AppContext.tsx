import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Gift, User, CartItem, Reminder } from '../types';
import { mockGifts } from '../data/mockData';

interface AppContextType {
  gifts: Gift[];
  user: User | null;
  cart: CartItem[];
  wishlist: Gift[];
  reminders: Reminder[];
  isLoading: boolean;
  addToCart: (gift: Gift, quantity?: number) => void;
  removeFromCart: (giftId: string) => void;
  updateCartQuantity: (giftId: string, quantity: number) => void;
  addToWishlist: (gift: Gift) => void;
  removeFromWishlist: (giftId: string) => void;
  addReminder: (reminder: Reminder) => void;
  removeReminder: (reminderId: string) => void;
  login: (user: User) => void;
  logout: () => void;
  getRecommendedGifts: (occasion?: string, interests?: string[]) => Gift[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Gift[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize with mock data
  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real application, this would be an API call
        setGifts(mockGifts);
        
        // Check for stored user data
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        /*
        else {
        const defaultUser = {
          id: 'u1',
          name: 'Mohammad',
          age: 23,
          hobbies: ['Football', 'Gaming', 'Coding'],
          friends: [
            { id: 'f1', name: 'ADAM' },
            { id: 'f2', name: 'BEN' },
            { id: 'f3', name: 'ELZA' },
          ]
        };
        setUser(defaultUser);
      }
      */
      

        // Check for stored cart
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }
        
        // Check for stored wishlist
        const storedWishlist = localStorage.getItem('wishlist');
        if (storedWishlist) {
          setWishlist(JSON.parse(storedWishlist));
        }
        
        // Check for stored reminders
        const storedReminders = localStorage.getItem('reminders');
        if (storedReminders) {
          setReminders(JSON.parse(storedReminders));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Store cart in localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Store wishlist in localStorage when it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Store reminders in localStorage when it changes
  useEffect(() => {
    localStorage.setItem('reminders', JSON.stringify(reminders));
  }, [reminders]);

  // Store user in localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

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

  const addReminder = (reminder: Reminder) => {
    setReminders(prevReminders => [...prevReminders, reminder]);
  };

  const removeReminder = (reminderId: string) => {
    setReminders(prevReminders => prevReminders.filter(reminder => reminder.id !== reminderId));
  };

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const getRecommendedGifts = (occasion?: string, interests?: string[]): Gift[] => {
    // Simple recommendation logic - in a real app this would be more sophisticated
    let recommended = [...gifts];
    
    if (occasion) {
      recommended = recommended.filter(gift => 
        gift.occasions.some(occ => occ.toLowerCase().includes(occasion.toLowerCase()))
      );
    }
    
    if (interests && interests.length > 0) {
      recommended = recommended.filter(gift => 
        gift.categories.some(category => 
          interests.some(interest => category.toLowerCase().includes(interest.toLowerCase()))
        )
      );
    }
    
    // Sort by rating
    recommended.sort((a, b) => b.rating - a.rating);
    
    return recommended;
  };

  const value = {
    gifts,
    user,
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
    login,
    logout,
    getRecommendedGifts,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
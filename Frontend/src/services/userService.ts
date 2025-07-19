import { doc, setDoc, getDoc, updateDoc, collection, getDocs, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../config/firebase';
import { UserData, Friend, Reminder, Gift } from '../types';

/**
 * Save user data to Firestore
 */
export const saveUserData = async (userData: UserData, uid: string): Promise<void> => {
  try {
    await setDoc(doc(db, 'user', uid), userData);
    console.log('User data saved successfully');
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};

/**
 * Get user data from Firestore
 */
export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'user', uid));
    if (userDoc.exists()) {
      const userData = userDoc.data() as UserData;
      
      return userData;
    } else {
      console.log('No user data found');
      return null;
    }
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

/**
 * Update user data in Firestore
 */
export const updateUserData = async (uid: string, updates: Partial<UserData>): Promise<void> => {
  try {
    const updateData = {
      ...updates,
    };
    await updateDoc(doc(db, 'user', uid), updateData);
    console.log('User data updated successfully');
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
};

/**
 * Get all users from Firestore
 */
export const getAllUsers = async (): Promise<UserData[]> => {
  try {
    const usersCollection = collection(db, 'user');
    const usersSnapshot = await getDocs(usersCollection);
    const users: UserData[] = [];
    
    usersSnapshot.forEach((doc) => {
      console.log('User doc:', doc.id, doc.data());
      users.push(doc.data() as UserData);
    });
    
    return users;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

/**
 * Add a friend to user's friends list
 */
export const addFriendToUser = async (uid: string, friend: Friend): Promise<void> => {
  try {
    await updateDoc(doc(db, 'user', uid), {
      friends: arrayUnion(friend)
    });
    console.log('Friend added successfully');
  } catch (error) {
    console.error('Error adding friend:', error);
    throw error;
  }
};

/**
 * Remove a friend from user's friends list
 */
export const removeFriendFromUser = async (uid: string, friendEmail: string): Promise<void> => {
  try {
    // First get the current user data to find the exact friend object
    const userData = await getUserData(uid);
    if (!userData) {
      throw new Error('User not found');
    }
    
    // Find the friend object to remove
    const friendToRemove = userData.friends.find(f => f.mail === friendEmail);
    if (!friendToRemove) {
      throw new Error('Friend not found');
    }
    
    // Remove the friend
    await updateDoc(doc(db, 'user', uid), {
      friends: arrayRemove(friendToRemove)
    });
    console.log('Friend removed successfully');
  } catch (error) {
    console.error('Error removing friend:', error);
    throw error;
  }
};

/**
 * Add a reminder to user's reminders list
 */
export const addReminderToUser = async (uid: string, reminder: Reminder): Promise<void> => {
  try {
    await updateDoc(doc(db, 'user', uid), {
      reminders: arrayUnion(reminder)
    });
    console.log('Reminder added successfully');
  } catch (error) {
    console.error('Error adding reminder:', error);
    throw error;
  }
};

/**
 * Remove a reminder from user's reminders list
 */
export const removeReminderFromUser = async (uid: string, reminderId: string): Promise<void> => {
  try {
    // First get the current user data to find the exact reminder object
    const userData = await getUserData(uid);
    if (!userData) {
      throw new Error('User not found');
    }
    
    // Find the reminder object to remove
    const reminderToRemove = userData.reminders?.find(r => r.id === reminderId);
    if (!reminderToRemove) {
      throw new Error('Reminder not found');
    }
    
    // Remove the reminder
    await updateDoc(doc(db, 'user', uid), {
      reminders: arrayRemove(reminderToRemove)
    });
    console.log('Reminder removed successfully');
  } catch (error) {
    console.error('Error removing reminder:', error);
    throw error;
  }
};

/**
 * Add a gift to user's wishlist
 */
export const addGiftToWishlist = async (uid: string, gift: Gift): Promise<void> => {
  try {
    await updateDoc(doc(db, 'user', uid), {
      wishlist: arrayUnion(gift)
    });
    console.log('Gift added to wishlist successfully');
  } catch (error) {
    console.error('Error adding gift to wishlist:', error);
    throw error;
  }
};

/**
 * Remove a gift from user's wishlist
 */
export const removeGiftFromWishlist = async (uid: string, giftId: string): Promise<void> => {
  try {
    // First get the current user data to find the exact gift object
    const userData = await getUserData(uid);
    if (!userData) {
      throw new Error('User not found');
    }
    
    // Find the gift object to remove
    const giftToRemove = userData.wishlist?.find(g => g.asin === giftId);
    if (!giftToRemove) {
      throw new Error('Gift not found in wishlist');
    }
    
    // Remove the gift
    await updateDoc(doc(db, 'user', uid), {
      wishlist: arrayRemove(giftToRemove)
    });
    console.log('Gift removed from wishlist successfully');
  } catch (error) {
    console.error('Error removing gift from wishlist:', error);
    throw error;
  }
};

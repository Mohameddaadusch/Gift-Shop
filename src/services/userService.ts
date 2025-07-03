import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface UserData {
//   uid: string;
  mail: string;
  name: string;
  age: number;
  gender: string;
  hobbies: string[];
//   friends: any[];
//   profileImage: string;
//   createdAt: string;
//   updatedAt?: string;
}

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
      return userDoc.data() as UserData;
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
      updatedAt: new Date().toISOString()
    };
    await updateDoc(doc(db, 'user', uid), updateData);
    console.log('User data updated successfully');
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
};

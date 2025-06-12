export interface Gift {
  id: string;
  name: string;
  imageUrl: string;
  rating: number;
  reviews: number;
  price: number;
  categories: string[];
  link: string; 
}


export interface User {
  mail: string;
  password:string;
  name: string;
  age: number;
  gender:string;
  hobbies: string[];
  friends: Friend[];
  profileImage: String;
}

export interface Friend {
  id: string;
  name: string;
  relationShip:string;
}

export interface CartItem {
  gift: Gift;
  quantity: number;
}

export interface Reminder {
  id: string;
  title: string;
  date: string;
  recipientName: string;
  occasion: string;
  notes?: string;
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export type OccasionType = 
  | 'birthday'
  | 'anniversary'
  | 'wedding'
  | 'graduation'
  | 'housewarming'
  | 'babyshower'
  | 'christmas'
  | 'valentines'
  | 'mothers-day'
  | 'fathers-day'
  | 'other';

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export type PriceRange = {
  min: number;
  max: number;
};
export interface Gift {
  asin: string;
  title: string;
  imgUrl: string;
  stars: number;
  reviews: number;
  price: number;
  category: string[];
  productURL: string; 
}

// export interface User {
//   mail: string;
//   password: string;
//   name: string;
//   age: number;
//   gender:string;
//   hobbies: string[];
//   friends: Friend[];
//   profileImage: String;
// }

export interface UserData {
//   uid: string;
  mail: string;
  name: string;
  age: number;
  gender: string;
  hobbies: string[];
  friends: Friend[];
  reminders: Reminder[];
  wishlist: Gift[];  
//   profileImage: string;
//   createdAt: string;
//   updatedAt?: string;
}

export interface Friend {
  mail: string;
  name: string;
  relationShip:string;
}

export interface CartItem {
  gift: Gift;
  quantity: number;
}

export interface Reminder {
  id:             string;
  recipientName:  string;
  occasion:       string;
  date:           string;
  hobbies?:      string[]; 
}

/*
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
*/
export type OccasionType = 
  "Administrative"|
  "Anniversary"|
  "Baby Shower"|
  "Back to School"|
  "Baptism"|
  "Bar Mitzvah"|
  "Bat Mitzvah"|
  "Birthday"|
  "Bridal Shower"|
  "Chinese New Year"|
  "Christmas"|
  "Clergy Appreciation"|
  "Confirmation"|
  "Congratulations"|
  "Diwali"|
  "Easter"|
  "Eid al-Fitr"|
  "Encouragement"|
  "Engagement"|
  "Father's Day"|
  "First Communion"|
  "Friendship"|
  "Get Well"|
  "Good Luck"|
  "Goodbye"|
  "Graduation"|
  "Grandparents Day"|
  "Halloween"|
  "Hanukkah"|
  "Pride"|
  "Housewarming"|
  "Independence Day"|
  "Love"|
  "Military Appreciation"|
  "Miss You"|
  "Mother's Day"|
  "National Boss Day"|
  "New Baby"|
  "New Year's"|
  "Nurses Day"|
  "Passover"|
  "Pregnancy"|
  "Professionals Day"|
  "Retirement"|
  "Rosh Hashanah"|
  "St. Patrick's Day"|
  "Sweetest Day"|
  "Teacher Appreciation"|
  "Thank You"|
  "Thanksgiving"|
  "Thinking of You"|
  "Valentine's Day"|
  "Veterans Day"|
  "Wedding"|
  'other';

export const OCCASIONS: OccasionType[] = [
  "Administrative",
  "Anniversary",
  "Baby Shower",
  "Back to School",
  "Baptism",
  "Bar Mitzvah",
  "Bat Mitzvah",
  "Birthday",
  "Bridal Shower",
  "Chinese New Year",
  "Christmas",
  "Clergy Appreciation",
  "Confirmation",
  "Congratulations",
  "Diwali",
  "Easter",
  "Eid al-Fitr",
  "Encouragement",
  "Engagement",
  "Father's Day",
  "First Communion",
  "Friendship",
  "Get Well",
  "Good Luck",
  "Goodbye",
  "Graduation",
  "Grandparents Day",
  "Halloween",
  "Hanukkah",
  "Pride",
  "Housewarming",
  "Independence Day",
  "Love",
  "Military Appreciation",
  "Miss You",
  "Mother's Day",
  "National Boss Day",
  "New Baby",
  "New Year's",
  "Nurses Day",
  "Passover",
  "Pregnancy",
  "Professionals Day",
  "Retirement",
  "Rosh Hashanah",
  "St. Patrick's Day",
  "Sweetest Day",
  "Teacher Appreciation",
  "Thank You",
  "Thanksgiving",
  "Thinking of You",
  "Valentine's Day",
  "Veterans Day",
  "Wedding",
];

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
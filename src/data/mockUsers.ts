// src/data/mockUsers.ts
import { User } from '../types';

export const mockUsers: User[] = [
  {
    mail: 'alice@example.com',
    password: '',
    name: 'Alice',
    age: 30,
    gender: 'female',
    hobbies: ['Reading', 'Hiking'],
    friends: [],
    profileImage: ''
  },
  {
    mail: 'bob@example.com',
    password: '',
    name: 'Bob',
    age: 28,
    gender: 'male',
    hobbies: ['Gaming', 'Cooking'],
    friends: [],
    profileImage: ''
  },
  {
    mail: 'carol@example.com',
    password: '',
    name: 'Carol',
    age: 35,
    gender: 'female',
    hobbies: ['Photography'],
    friends: [],
    profileImage: ''
  },
  // …add more as needed…
];

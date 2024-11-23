export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  location: string;
  rating: number;
  imageUrl: string;
  halalCertification: string;
  description: string;
  reviews: Review[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  role: 'user' | 'host' | 'admin';
  favorites: string[];
}
// src/components/index.ts
export { default as Input } from "./Input";
export { default as Button } from "./Button";
export { default as Rating } from "./Rating";
// Add other components as needed

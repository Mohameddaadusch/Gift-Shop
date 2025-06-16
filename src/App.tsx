  import React from 'react';
  import { BrowserRouter, Routes, Route } from 'react-router-dom';
  import Layout from './components/layout/Layout';
  import HomePage from './pages/HomePage';
  import GiftDetailPage from './pages/GiftDetailPage';
  import WishlistPage from './pages/WishlistPage';
  import CartPage from './pages/CartPage';
  import CheckoutPage from './pages/CheckoutPage';
  import LoginPage from './pages/LoginPage';
  import RegisterPage from './pages/RegisterPage';
  import NotFoundPage from './pages/NotFoundPage';
  import AdvancedSearchPage from './pages/AdvancedSearchPage'; 
  import AllGiftsPage from './pages/AllGiftsPage';
  import RemindersPage from './pages/RemindersPage';
  import UserProfile from './pages/UserProfile';
  import FriendsPage from './pages/FriendsPage';





  function App() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="gift/:id" element={<GiftDetailPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/advanced-search" element={<AdvancedSearchPage />} />
            <Route path="/all-gifts" element={<AllGiftsPage />} />
            <Route path="/reminders" element={<RemindersPage />} />
            <Route path="/userprofile" element={<UserProfile />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="friends" element={<FriendsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }

  export default App;
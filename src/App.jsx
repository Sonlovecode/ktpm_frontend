import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Footer from './components/Footer';
import Products from './components/Products';
import ProductDetail from './components/ProductDetail';
import CartPage from './components/CartPage'; ////
import OrderPage from './components/OrderPage';
import OrderHistoryPage from './components/OrderHistoryPage';
import SearchResults from './components/SearchResults';
import Login from './components/logins/Login';
import Register from './components/logins/Register';
import Slider from './components/Slider';
import './App.css';
//admin
import AdminDashboard from './components/AdminDashboard';
import AdminUserManagement from './components/AdminUserManagement';
import AdminProductManagement from './components/AdminProductManagement';
import AdminOrderManagement from './components/AdminOrderManagement';
import AdminLayout from './components/layouts/AdminLayout';

import Profile from './components/profile';
import { AuthProvider } from './context/auth';  // Import AuthProvider
import { CartProvider } from './contexts/CartContext.jsx'; 

function App() {
  return (
    <CartProvider> 
      <AuthProvider>
        <div className="App">
          <Navbar />
          <Header />
          <Routes>
            <Route path="/" element={
              <>
                <Slider />
                <Products />
              </>
            } />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/login" element={<Login />} />
           
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrderPage />} />
            <Route path="/order-history" element={<OrderHistoryPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />


             {/* Admin routes */}
             <Route path="/admin" element={<AdminLayout />}>
  <Route index element={<AdminDashboard />} />
  <Route path="users" element={<AdminUserManagement />} />
  <Route path="products" element={<AdminProductManagement />} />
  <Route path="orders" element={<AdminOrderManagement />} />
</Route>

          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </CartProvider>
  );
}


export default App;

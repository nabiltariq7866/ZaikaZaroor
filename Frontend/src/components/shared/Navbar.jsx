import React, { useState } from 'react';
import { Input, Dropdown, Avatar, Button, Badge, Divider, Spin, Popover, List, Typography, Empty } from 'antd'; 
import { Search, ShoppingCart, User, LogOut, LayoutDashboard, ChevronDown, MapPin, Plus, Minus, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApi } from '../../context/ApiContext';
import { useCurrentLocation } from '../../hooks/useCurrentLocation';
import { useCart } from '../../context/CartContext'; 
const ProfileDropdown = () => {
  const { user, logoutUser } = useApi();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const goToDashboard = () => {
    switch (user?.role) {
      case 'owner': navigate('/owner/dashboard'); break;
      case 'deliveryBoy': navigate('/delivery/dashboard'); break;
      case 'user': default: navigate('/dashboard');
    }
  };

  const items = [
    { key: '1', label: 'My Dashboard', icon: <LayoutDashboard size={16} />, onClick: goToDashboard },
    { key: '2', label: 'Logout', icon: <LogOut size={16} />, danger: true, onClick: handleLogout },
  ];

  return (
    <Dropdown menu={{ items }} trigger={['click']}>
      <div className="flex items-center gap-2 cursor-pointer">
        <Avatar className="bg-orange-600 text-white">
          {user?.fullName ? user.fullName[0].toUpperCase() : <User size={18} />}
        </Avatar>
        <span className="hidden md:block font-medium text-gray-700">
          {user?.fullName?.split(' ')[0]}
        </span>
        <ChevronDown size={16} className="text-gray-500 hidden md:block" />
      </div>
    </Dropdown>
  );
};

// --- Login Button ---
const LoginButton = () => (
  <Link to="/login">
    <Button type="primary" className="bg-orange-600 text-white hover:bg-orange-700">
      Login
    </Button>
  </Link>
);

// --- Custom Search Bar ---
const LocationSearchBar = () => {
  const { location, loading: locationLoading } = useCurrentLocation();

  const locationAddon = (
    <div className="flex items-center pr-2">
      <MapPin size={20} className="text-gray-400 ml-3 mr-2 flex-shrink-0" />
      <Button type="text" className="font-semibold text-gray-700 truncate px-1">
        {locationLoading ? <Spin size="small" /> : (location || 'Select Location')}
      </Button>
      <Divider type="vertical" className="h-6 ml-2" />
    </div>
  );

  return (
    <Input.Search
      placeholder="Search for restaurants..."
      size="large"
      enterButton={
        <Button 
          type="primary" 
          icon={<Search />} 
          className="bg-orange-600"
        />
      }
      addonBefore={locationAddon} 
      className="custom-location-search" 
    />
  );
};

// --- Cart Popover Content ---
const CartPopoverContent = ({ onCheckout }) => {
  const { cartItems, addToCart, removeFromCart, getTotalPrice } = useCart();
  const total = getTotalPrice();

  return (
    <div className="w-[350px]">
      {cartItems.length === 0 ? (
        <Empty description="Your cart is empty" />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={cartItems}
          renderItem={item => (
            <List.Item
              actions={[
                <Button 
                  size="small" 
                  type="text" 
                  icon={<Minus size={14} />} 
                  onClick={() => removeFromCart(item._id)} 
                />,
                <span className="font-bold mx-1">{item.quantity}</span>,
                <Button 
                  size="small" 
                  type="text" 
                  icon={<Plus size={14} />} 
                  onClick={() => addToCart(item)} 
                />
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={item.image} />}
                title={<span className="font-semibold">{item.name}</span>}
                description={`Rs. ${item.price} x ${item.quantity} = Rs. ${(item.price * item.quantity).toLocaleString()}`}
              />
            </List.Item>
          )}
        />
      )}
      
      {cartItems.length > 0 && (
        <>
          <Divider className="my-2" />
          <div className="flex justify-between items-center mb-4">
            <Typography.Text strong className="text-lg">Total:</Typography.Text>
            <Typography.Text strong className="text-lg text-orange-600">
              Rs. {total.toLocaleString()}
            </Typography.Text>
          </div>
          <Button 
            type="primary" 
            block 
            className="bg-orange-600"
            onClick={onCheckout}
          >
            Go to Checkout
          </Button>
        </>
      )}
    </div>
  );
};

// --- Main Navbar Component ---
const Navbar = () => {
  const { isAuthenticated } = useApi();
  const { getCartCount } = useCart(); 
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const navigate = useNavigate();

  const totalCartItems = getCartCount(); 

  const handleCheckout = () => {
    setIsCartVisible(false);
    navigate('/checkout'); // (Yeh route aapko banana hoga)
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          
          <Link to="/" className="text-3xl font-bold text-gray-800">
            <span className="text-orange-600">Z</span>aika<span className="text-orange-600">Z</span>aroor
          </Link>

          <div className="hidden md:block w-full max-w-lg mx-4">
            <LocationSearchBar />
          </div>

          <div className="flex items-center gap-4">
            <Button
              type="text"
              shape="circle"
              icon={<Search />}
              className="md:hidden text-gray-600"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
            />
            
            <Popover 
              content={<CartPopoverContent onCheckout={handleCheckout} />} 
              title={<Typography.Title level={5}>Your Cart</Typography.Title>}
              trigger="click" 
              open={isCartVisible} 
              onOpenChange={setIsCartVisible}
              placement="bottomRight"
            >
              <Badge count={totalCartItems} size="small" offset={[-5, 5]}>
                <Button
                  type="text"
                  shape="circle"
                  icon={<ShoppingCart className="text-gray-600" />}
                />
              </Badge>
            </Popover>

            {isAuthenticated ? <ProfileDropdown /> : <LoginButton />}
          </div>
        </div>

        {isSearchVisible && (
          <div className="mt-3 md:hidden">
            <LocationSearchBar />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
import React, { useState } from 'react';
import { Input, Dropdown, Avatar, Button, Badge, Divider, Spin } from 'antd';
import { Search, ShoppingCart, User, LogOut, LayoutDashboard, ChevronDown, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApi } from '../../context/ApiContext';
import { useCurrentLocation } from '../../hooks/useCurrentLocation';

// --- Profile Dropdown (Jab user login ho) ---
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

// --- Login Button (Jab user login na ho) ---
const LoginButton = () => (
  <Link to="/login">
    <Button type="primary" className="bg-orange-600 text-white hover:bg-orange-700">
      Login
    </Button>
  </Link>
);

// --- Custom Search Bar (Location ke sath) ---
const LocationSearchBar = () => {
  const { location, loading: locationLoading } = useCurrentLocation();

  // Location wala hissa (prefix)
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
    // AntD ka Input.Search component use kiya
    <Input.Search
      placeholder="Search for restaurants..."
      size="large"
      enterButton={
        <Button 
          type="primary" 
          icon={<Search />} 
          className="bg-orange-600" // Button ko orange kiya
        />
      }
      addonBefore={locationAddon} // Location ko prefix mein add kiya
      className="custom-location-search" // CSS customization ke liye (agar zaroorat pare)
    />
  );
};


// --- Main Navbar Component ---
const Navbar = () => {
  const { isAuthenticated } = useApi();
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          
          <Link to="/" className="text-3xl font-bold text-gray-800">
            <span className="text-orange-600">Z</span>aika<span className="text-orange-600">Z</span>aroor
          </Link>

          {/* Desktop Search Bar (Updated) */}
          <div className="hidden md:block w-full max-w-lg mx-4">
            <LocationSearchBar />
          </div>

          <div className="flex items-center gap-4">
            {/* Mobile Search Icon (Yeh pehle se md:hidden tha, jo aap chahte thay) */}
            <Button
              type="text"
              shape="circle"
              icon={<Search />}
              className="md:hidden text-gray-600"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
            />
            
            <Link to="/cart">
              <Badge count={0} size="small">
                <Button
                  type="text"
                  shape="circle"
                  icon={<ShoppingCart className="text-gray-600" />}
                />
              </Badge>
            </Link>

            {isAuthenticated ? <ProfileDropdown /> : <LoginButton />}
          </div>
        </div>

        {/* Mobile Search Bar (Jo click par khulta hai) */}
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


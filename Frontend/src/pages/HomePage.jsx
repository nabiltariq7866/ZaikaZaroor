import React from 'react';
import { Input, Button, Card, Tag } from 'antd';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categories } from '../utils/constants';
import { useCurrentLocation } from '../hooks/useCurrentLocation';

const { Meta } = Card;
const restaurants = [
  {
    id: 1,
    name: 'Tandoori Piza London',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1740&auto=format&fit=crop',
    description: 'Authentic Tandoori Pizza & More',
    tags: ['Pizza', 'Fast Food'],
    offer: '20% OFF'
  },
  {
    id: 2,
    name: 'Burger Point',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1698&auto=format&fit=crop',
    description: 'Juicy burgers, crispy fries',
    tags: ['Burger', 'American'],
    offer: 'Free Delivery'
  },
  {
    id: 3,
    name: 'Wok Station',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=1592&auto=format&fit=crop',
    description: 'Fresh Chinese & Thai cuisine',
    tags: ['Chinese', 'Noodles'],
    offer: 'Buy 1 Get 1'
  },
];

// --- 1. Hero Section (Search Bar) ---
const HeroSection = () => (
  <div 
    className="h-[60vh] relative flex items-center justify-center bg-no-repeat bg-cover bg-center"
    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1740&auto=format&fit=crop')" }}
  >
    {/* Dark Overlay */}
    <div className="absolute inset-0 bg-black/60 z-0"></div>
    
    <div className="relative z-10 text-center text-white p-4">
      <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
        <span className="text-orange-500">Z</span>aika<span className="text-orange-500">Z</span>aroor
      </h1>
      <p className="text-xl md:text-2xl mb-8">
        Your favorite food, delivered hot & fresh.
      </p>
      <Input.Search
        placeholder="Search for restaurants or dishes..."
        enterButton={
          <Button type="primary" size="large" className="bg-orange-600">
            Find Food
          </Button>
        }
        size="large"
        className="max-w-xl mx-auto"
        // onSearch={value => console.log(value)}
      />
    </div>
  </div>
);

// --- 2. Categories Section ---
const CategoriesSection = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl font-bold text-gray-800">Popular Categories</h2>
      <Link to="/categories" className="text-orange-600 font-semibold flex items-center gap-1 hover:text-orange-700">
        View All <ArrowRight size={16} />
      </Link>
    </div>
    
    <div className="flex overflow-x-auto space-x-4 pb-4">
      {categories.map((category) => (
        <div key={category.name} className="flex-shrink-0 w-36 text-center">
          <img 
            src={category.image} 
            alt={category.name}
            className="w-24 h-24 rounded-full object-cover mx-auto shadow-md border-4 border-white" 
          />
          <p className="mt-2 font-semibold text-gray-700">{category.name}</p>
        </div>
      ))}
    </div>
  </div>
);

// --- 3. Popular Restaurants Section ---
const PopularRestaurantsSection = ({city}) => (
  <div className="bg-white py-12">
    {console.log(city)}
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Popular Restaurants {city}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((resto) => (
          <Link to={`/restaurant/${resto.id}`} key={resto.id}>
            <Card
              hoverable
              cover={
                <img 
                  alt={resto.name} 
                  src={resto.image}
                  className="h-48 w-full object-cover" 
                />
              }
            >
              <div className="flex justify-between items-start">
                <Meta title={resto.name} description={resto.description} />
                <Tag color="green" className="ml-2">{resto.offer}</Tag>
              </div>
              <div className="mt-2">
                {resto.tags.map(tag => (
                  <Tag key={tag} className="mt-1">{tag}</Tag>
                ))}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  </div>
);


// --- Main Home Page Component ---
const HomePage = () => {
  const {city}=useCurrentLocation();
  console.log(city)
  return (
    <div className="bg-gray-50">
      <HeroSection />
      <CategoriesSection />
      <PopularRestaurantsSection city={city} />
      {/* Yahan aur sections (e.g., How it works) add ho sakte hain */}
    </div>
  );
};

export default HomePage;
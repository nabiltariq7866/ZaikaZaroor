import React, { useEffect, useRef, useState } from "react";
import { Input, Button, Card, Tag, Spin, Empty, Rate } from "antd";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { categories } from "../utils/constants";
import { useCurrentLocation } from "../hooks/useCurrentLocation";
import { useApi } from "../context/ApiContext";
import AddToCartButton from "../components/shared/AddToCartButton";

const { Meta } = Card;

// --- 1. Hero Section (Search Bar) ---
const HeroSection = () => (
  <div
    className="h-[60vh] relative flex items-center justify-center bg-no-repeat bg-cover bg-center"
    style={{
      backgroundImage:
        "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1740&auto=format&fit=crop')",
    }}
  >
    {/* Dark Overlay */}
    <div className="absolute inset-0 bg-black/60 z-0"></div>

    <div className="relative z-10 text-center text-white p-4">
      <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
        <span className="text-orange-500">Z</span>aika
        <span className="text-orange-500">Z</span>aroor
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
const CategoriesSection = () => {
  const scrollContainerRef = useRef(null);
  // (1) Nayi state scroll position track karne ke liye
  const [scrollState, setScrollState] = useState({
    canScrollLeft: false,
    canScrollRight: true,
  });

  // (2) Scroll karne ke liye function
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // (3) Function jo check karega ke scroll limits tak pohnch gaye hain ya nahi
  const checkScrollLimits = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;

      setScrollState({
        canScrollLeft: scrollLeft > 0,
        // -1 precision issues ke liye
        canScrollRight: scrollLeft < scrollWidth - clientWidth - 1,
      });
    }
  };

  // (4) Component load hotay hi aur scroll karne par limits check karein
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      // Pehli baar check karein (ho sakta hai items kam hon)
      checkScrollLimits();

      // Har scroll par check karein
      container.addEventListener("scroll", checkScrollLimits);

      // Window resize par bhi check karein
      window.addEventListener("resize", checkScrollLimits);

      // Cleanup
      return () => {
        container.removeEventListener("scroll", checkScrollLimits);
        window.removeEventListener("resize", checkScrollLimits);
      };
    }
  }, [categories]); // Jab categories load hon, tab dobara check karein

  return (
    <div className="container mx-auto px-4 py-12">
      {/* (5) Header (Arrow buttons ab yahan hain) */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Popular Categories</h2>

        {/* Actions (Buttons aur View All link) */}
        <div className="flex items-center gap-2">
          {/* (6) Left Button (Conditional) */}
          <Button
            shape="circle"
            icon={<ArrowLeft size={16} />}
            onClick={() => scroll("left")}
            disabled={!scrollState.canScrollLeft} // Disable karein
            className={!scrollState.canScrollLeft ? "opacity-30" : ""}
          />

          {/* (7) Right Button (Conditional) */}
          <Button
            shape="circle"
            icon={<ArrowRight size={16} />}
            onClick={() => scroll("right")}
            disabled={!scrollState.canScrollRight} // Disable karein
            className={!scrollState.canScrollRight ? "opacity-30" : ""}
          />
        </div>
      </div>

      {/* (8) Scrollable div (ab relative wrapper ke bagher) */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto space-x-4 pb-4 scroll-smooth"
        // (9) 'onScroll' event add kiya (iOS/Safari ke liye)
        onScroll={checkScrollLimits}
      >
        {categories.map((category) => (
          <div key={category.name} className="flex shrink-0 w-36 text-center">
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
};

// --- 3. Popular Restaurants Section ---
const PopularRestaurantsSection = ({ city }) => {
  // (2) 'city' ko prop se lein
  const { publicShops, loading } = useApi();

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        {/* (3) Heading mein city display karwayein */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Popular Restaurants {city ? `in ${city}` : ""}
        </h2>

        {loading.getShopsByCity && (
          <div className="text-center">
            <Spin size="large" tip="Loading restaurants..." />
          </div>
        )}

        {!loading.getShopsByCity && publicShops.length === 0 && (
          <Empty description="No restaurants found in this city yet." />
        )}

        {!loading.getShopsByCity && publicShops.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* (4) Dummy 'restaurants' ki jagah 'publicShops' se map karein */}
            {publicShops.map((resto) => (
              <Link to={`/restaurant/${resto._id}`} key={resto._id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={resto.name}
                      src={resto.image} // (5) Sahi data use karein
                      className="h-48 w-full object-cover"
                    />
                  }
                >
                  <div className="flex justify-between items-start">
                    {/* (6) Sahi data use karein */}
                    <Meta title={resto.name} description={resto.address} />
                    {/* (Offer aur tags hata diye) */}
                  </div>
                  <div className="mt-2">
                    <Tag>{resto.city}</Tag>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
const PopularItemsSection = ({ city }) => {
  const { publicItems, loading } = useApi();

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Popular Items {city ? `in ${city}` : ''}
        </h2>
        
        {loading.getItemsByCity && (
          <div className="text-center">
            <Spin size="large" tip="Loading items..." />
          </div>
        )}

        {!loading.getItemsByCity && publicItems.length === 0 && (
          <Empty description="No items found in this city yet." />
        )}

        {!loading.getItemsByCity && publicItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {publicItems.map((item) => (
              <Link to={`/item/${item._id}`} key={item._id}>
                <Card
                  hoverable
                  cover={
                    <img 
                      alt={item.name} 
                      src={item.image}
                      className="h-40 w-full object-cover" 
                    />
                  }
                >
                  <Meta title={item.name} />
                  
                  <div className="mt-2 flex items-center gap-1">
                    <Rate 
                      disabled 
                      allowHalf 
                      value={item.rating?.average || 0} 
                      style={{ fontSize: 16, color: '#eab308' }} 
                    />
                    <span className="text-gray-500 text-xs">({item.rating?.count || 0})</span>
                  </div>
                  
                  <div className="mt-2 flex justify-between items-center">
                    <Tag color="orange">Rs. {item.price}</Tag>
                    <Tag color="blue">{item.category}</Tag>
                  </div>
                  <div className="mt-2 text-gray-500 text-sm truncate">
                    {item.shop?.name || 'Restaurant'}
                  </div>
                  
                  <div className="mt-4">
                    <AddToCartButton item={item} />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
// --- Main Home Page Component ---
const HomePage = () => {
  const { city } = useCurrentLocation();
  const { getShopsByCity, getItemsByCity } = useApi();
  useEffect(() => {
    if (city) {
      getShopsByCity(city);
      getItemsByCity(city);
    }
  }, [city]);
  return (
    <div className="bg-gray-50">
      <HeroSection />
      <CategoriesSection />
      <PopularRestaurantsSection city={city} />
      <PopularItemsSection city={city} />
    </div>
  );
};

export default HomePage;

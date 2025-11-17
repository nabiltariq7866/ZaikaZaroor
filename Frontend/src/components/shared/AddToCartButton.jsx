import React from 'react';
import { Button } from 'antd';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext'; 

const AddToCartButton = ({ item }) => {
  const { addToCart, removeFromCart, getItemCount } = useCart();
  const count = getItemCount(item._id); 

  const handleAction = (e, action) => {
    e.preventDefault(); 
    e.stopPropagation(); 

    if (action === 'increment') {
      addToCart(item); 
    } else if (action === 'decrement') {
      removeFromCart(item._id); 
    } else if (action === 'add') {
      addToCart(item); 
    }
  };

  if (count === 0) {
    return (
      <Button
        type="primary"
        icon={<ShoppingCart size={16} />}
        onClick={(e) => handleAction(e, 'add')}
        className="bg-orange-600 hover:bg-orange-700 w-full"
      >
        Add to Cart
      </Button>
    );
  }

  return (
    <div className="flex items-center justify-center w-full">
      <div className="flex items-center justify-between w-full rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Button
          type="text"
          icon={<Minus size={16} />}
          onClick={(e) => handleAction(e, 'decrement')}
          className="h-10 text-orange-600"
        />
        <span className="font-bold text-lg px-2">{count}</span>
        <Button
          type="text"
          icon={<Plus size={16} />}
          onClick={(e) => handleAction(e, 'increment')}
          className="h-10 text-orange-600"
        />
        <Button
          type="primary"
          icon={<ShoppingCart size={16} />}
          onClick={(e) => e.stopPropagation()}
          className="bg-orange-600 h-10 rounded-l-none"
        />
      </div>
    </div>
  );
};

export default AddToCartButton;
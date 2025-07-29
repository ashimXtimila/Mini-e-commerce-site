import React from 'react';
import { useCart } from '../context/CartContext'; // ✅ make sure path is correct


const Cart: React.FC = () => {
  const { cart, removeFromCart } = useCart();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="border p-4 rounded">
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-gray-700">Price: ${item.price.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Quantity: {item.quantity || 1}</p>
              <button
                onClick={() => removeFromCart(item.id)}
                className="mt-2 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}

          <button className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;

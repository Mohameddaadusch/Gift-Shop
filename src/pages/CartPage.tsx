import React from 'react';
import { useApp } from '../context/AppContext';

const CartPage: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart } = useApp();

  const totalPrice = cart.reduce((sum, item) => sum + item.gift.price * item.quantity, 0);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cart.map(({ gift, quantity }) => (
            <div
              key={gift.id}
              className="flex items-center justify-between border-b pb-4 gap-4"
            >
              <div className="flex items-center gap-4">
                <img src={gift.imageUrl} alt={gift.name} className="w-24 h-24 object-cover rounded" />
                <div>
                  <h2 className="text-lg font-semibold">{gift.name}</h2>
                  <p className="text-sm text-gray-600">${gift.price.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => updateCartQuantity(gift.id, parseInt(e.target.value))}
                  className="w-16 border rounded px-2 py-1"
                />
                <button
                  onClick={() => removeFromCart(gift.id)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="text-right mt-6">
            <h2 className="text-xl font-semibold">Total: ${totalPrice.toFixed(2)}</h2>
            <button className="mt-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;

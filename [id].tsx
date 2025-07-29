// src/pages/products/[id].tsx (after fixing the import path to CartContext)

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchProduct } from '../../utils/api'; // Assuming your API file is in src/utils/api.ts
import { useCart } from '../../context/CartContext'; // THIS IS WHERE YOU USE IT

// Define Product type (adjust as per your API)
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

const ProductDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart(); // <-- Call useCart() here to get cart functions

  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const getProduct = async () => {
        try {
          const fetchedProduct = await fetchProduct(id as string);
          setProduct(fetchedProduct);
        } catch (err) {
          setError('Failed to load product.');
          console.error(err);
        }
      };
      getProduct();
    }
  }, [id]);

  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!product) return <p>Loading product...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <img src={product.image} alt={product.name} className="w-full h-64 object-cover mb-4" />
      <p className="text-xl font-semibold mb-2">NPR {product.price}</p>
      <p className="text-gray-700 mb-4">{product.description}</p>
      <button
        onClick={() => addToCart(product)} // <-- Use addToCart here
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductDetail;
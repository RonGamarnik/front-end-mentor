import React, { useState, useEffect } from "react";
import axios from "axios";
import CartCard from "./components/self-made/CartCard";
import ProductsCards from "./components/self-made/ProductsCards";

interface Product {
  name: string;
  category: string;
  price: number;
  image: string;
}

interface ProductInCart {
  id: string;
  quantity: number;
}

interface Cart {
  id: string;
  products: ProductInCart[];
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsResponse, cartResponse] = await Promise.all([
          axios.get("http://localhost:3000/desserts"),
          axios.get("http://localhost:3000/cart"),
        ]);
        setProducts(productsResponse.data);
        setCart(cartResponse.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateCart = async (updatedCart: Cart) => {
    try {
      await axios.put(
        `http://localhost:3000/cart`,
        updatedCart
      );
      setCart(updatedCart);
    } catch (error) {
      console.error("Error updating cart:", error);
      setError("Failed to update cart");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className=" bg-rose_100">
    <div className="ml-16 pt-20 pb-20 flex ">
      <div className="w-2/3">
        <h1 className="font-bold text-5xl mb-6">Desserts</h1>
        <ProductsCards
          products={products}
          cart={cart}
          updateCart={updateCart}
        />
      </div>
      <CartCard cart={cart} updateCart={updateCart} />{" "}
      </div>
      </div>
  );
}

export default App;

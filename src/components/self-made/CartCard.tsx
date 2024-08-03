import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import axios from "axios";
import { TiDeleteOutline } from "react-icons/ti";
import { PiTreeLight } from "react-icons/pi";
import { Button } from "../ui/button";

interface ProductInCart {
  id: string;
  quantity: number;
}

interface Cart {
  id: string;
  products: ProductInCart[];
}

interface Product {
  id: string;
  name: string;
  price: number;
}

interface CartCardProps {
  cart: Cart | null;
  updateCart: (updatedCart: Cart) => void;
}

function CartCard({ cart, updateCart }: CartCardProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!cart || !cart.products.length) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const productIds = cart.products.map((item) => item.id);
        const responses = await Promise.all(
          productIds.map((id) =>
            axios.get<Product>(`http://localhost:3000/desserts/${id}`)
          )
        );
        const fetchedProducts = responses.map((response) => response.data);
        setProducts(fetchedProducts);
      } catch (err) {
        setError("Failed to fetch product details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [cart]);

  const getCartItemCount = () => {
    if (!cart || !cart.products) return 0;
    return cart.products.reduce((total, item) => total + item.quantity, 0);
  };

  const calculateItemTotal = (price: number, quantity: number) => {
    return (price * quantity).toFixed(2);
  };

  const calculateTotalSum = () => {
    if (!cart || !cart.products.length || !products.length) return "0.00";
    return cart.products
      .reduce((sum, item) => {
        const product = products.find((p) => p.id === item.id);
        if (product) {
          return sum + product.price * item.quantity;
        }
        return sum;
      }, 0)
      .toFixed(2);
  };

  const removeItem = async (itemId: string) => {
    if (!cart) return;

    try {
      const updatedCart = {
        ...cart,
        products: cart.products.map((item) =>
          item.id === itemId ? { ...item, quantity: 0 } : item
        ),
      };

      updateCart(updatedCart);
    } catch (err) {
      console.error("Failed to update item quantity in cart:", err);
      setError("Failed to update item quantity in cart. Please try again.");
    }
  };

  return (
    <Card className="w-1/4 border-0 bg-white">
      <CardHeader className="text-orange-600 text-2xl font-bold">
        Your Cart ({getCartItemCount()})
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading cart items...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : cart && cart.products.length > 0 ? (
          <ul>
            {cart.products.map((item) => {
              if (item.quantity === 0) return null; // Do not render items with quantity zero
              const product = products.find((p) => p.id === item.id);
              return (
                <li key={item.id} className="flex justify-between mb-4 pb-6 border-b-2 border-b-gray-100">
                  <div>
                    <h4 className="font-semibold">
                      {product ? product.name : `Product ${item.id}`}
                    </h4>
                    <div className="flex">
                      <p className="text-orange-600 text-sm font-semibold">
                        {item.quantity}x
                      </p>
                      <div className="ml-4 flex">
                        <p className="text-gray-500">
                          @${product ? product.price.toFixed(2) : "N/A"}
                        </p>
                        <p className="font-semibold text-gray-600 ml-2">
                          $
                          {product
                            ? calculateItemTotal(product.price, item.quantity)
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id)}>
                    <TiDeleteOutline className="self-center text-gray-300 size-6 hover:text-gray-500" />
                  </button>
                </li>
              );
            })}
            <div className="mt-4 flex justify-between">
              <p className="font-semibold text-xs content-center">Order Total</p>
              <p className=" font-bold text-xl">${calculateTotalSum()}</p>
            </div>
            <div className=" mt-5 flex gap-3">
              <PiTreeLight />
              <p className=" font-extralight text-sm">
                This is a <span className=" font-bold">carbon-neutral</span>{" "}
                delivery
              </p>
                              </div>
                              <Button className=" bg-orange-700 text-white rounded-full mt-5 px-20">Confirm Order</Button>
          </ul>
        ) : (
          <p>Your cart is empty</p>
        )}
      </CardContent>
    </Card>
  );
}

export default CartCard;

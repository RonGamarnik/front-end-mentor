import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { MdOutlineAddShoppingCart } from "react-icons/md";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
}

interface ProductInCart {
  id: number;
  quantity: number;
}

interface Cart {
  id: number;
  products: ProductInCart[];
}

interface ProductsCardsProps {
  products: Product[];
  cart: Cart | null;
  updateCart: (updatedCart: Cart) => Promise<void>;
}

function ProductsCards({ products, cart, updateCart }: ProductsCardsProps) {
  const updateCartItem = async (
    productId: number,
    action: "add" | "remove"
  ) => {
    if (!cart) return;

    const updatedCart = { ...cart };
    const existingProduct = updatedCart.products.find(
      (p) => p.id === productId
    );

    if (existingProduct) {
      if (action === "add") {
        existingProduct.quantity += 1;
      } else {
        existingProduct.quantity -= 1;
        if (existingProduct.quantity <= 0) {
          updatedCart.products = updatedCart.products.filter(
            (p) => p.id !== productId
          );
        }
      }
    } else if (action === "add") {
      updatedCart.products.push({ id: productId, quantity: 1 });
    }

    await updateCart(updatedCart);
  };

  const getProductQuantityInCart = (productId: number) => {
    if (!cart) return 0;
    const product = cart.products.find((p) => p.id === productId);
    return product ? product.quantity : 0;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-0 border-0 w-full font-RedHat">
      {products.map((product: Product) => {
        const quantityInCart = getProductQuantityInCart(product.id);
        return (
          <Card key={product.id} className={`flex flex-col p-0 border-0 `}>
            <CardContent className="p-0">
              <img
                src={product.image}
                alt={product.name}
                className={`rounded-md border-spacing-2 w-60 mx-0 h-60 object-cover ${
                  quantityInCart > 0 ? "border-orange-400 border-2" : ""
                }`}
              />
              {quantityInCart > 0 ? (
                <div className="flex justify-center items-center relative bottom-6 right-2">
                  <Button
                    className="bg-orange-700 hover:bg-orange-600 text-white rounded-l-3xl -mr-1"
                    onClick={() => updateCartItem(product.id, "remove")}
                  >
                    <CiCircleMinus className="size-6" />
                  </Button>
                  <span className="bg-orange-700 text-white px-4 py-2">
                    {quantityInCart}
                  </span>
                  <Button
                    className="bg-orange-700 hover:bg-orange-600 text-white rounded-r-3xl -ml-1"
                    onClick={() => updateCartItem(product.id, "add")}
                  >
                    <CiCirclePlus className="size-6" />
                  </Button>
                </div>
              ) : (
                <Button
                  className="relative bottom-6 left-12 bg-white hover:bg-orange-700 hover:text-white text-black border border-orange-400 rounded-3xl"
                  onClick={() => updateCartItem(product.id, "add")}
                >
                  <MdOutlineAddShoppingCart className="mr-3" />
                  Add to Cart
                </Button>
              )}
              <div className="">
                <p className="text-gray-500 text-sm font-semibold">
                  {product.category}
                </p>
                <h3 className="font-bold">{product.name}</h3>
                <p className="text-orange-400 font-semibold">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default ProductsCards;

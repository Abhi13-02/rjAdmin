"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Product {
  title: string;
  description: string;
  category: string;
  images: string[];
  tags: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  price: number;
  discountedPrice?: number;
}

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  const categories = ["Saree", "Kurti", "Shirt", "Salwar"];
  const tagOptions = ["New Arrival", "Best Seller", "Trending", "Discounted"];
  const sizeOptions = ["XS", "S", "M", "L", "XL"];
  const colorOptions = ["Red", "Blue", "Green", "Black", "White"];

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        const response = await fetch(`/api/products/${productId}`);
        const data = await response.json();
        setProduct(data);
      };

      fetchProduct();
    }
  }, [productId]);

  const handleUpdateProduct = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    if (response.ok) {
      alert("Product updated successfully");
    } else {
      alert("Failed to update the product. Please try again.");
    }
  };


  const removeTag = (tagToRemove: string) => {
    setProduct((prevProduct) =>
      prevProduct ? { ...prevProduct, tags: prevProduct.tags.filter((tag) => tag !== tagToRemove) } : null
    );
  };

  const removeSize = (sizeToRemove: string) => {
    setProduct((prevProduct) =>
      prevProduct ? { ...prevProduct, sizes: prevProduct.sizes.filter((size) => size !== sizeToRemove) } : null
    );
  };

  const removeColor = (colorToRemove: string) => {
    setProduct((prevProduct) =>
      prevProduct ? { ...prevProduct, colors: prevProduct.colors.filter((color) => color !== colorToRemove) } : null
    );
  };

  return (
    <div className="w-full">
      {product ? (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold mb-4">Edit Product</h1>
          <form onSubmit={handleUpdateProduct}>
            {/* Product Name */}
            <div className="mb-4">
              <label className="block font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                value={product.title}
                onChange={(e) => setProduct({ ...product, title: e.target.value })}
                className="w-full p-2 border rounded-md"
              />
            </div>

            {/* Product Description */}
            <div className="mb-4">
              <label className="block font-medium text-gray-700">Product Description</label>
              <input
                type="text"
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                className="w-full p-2 border rounded-md"
              />
            </div>

            {/* Product Category */}
            <div className="mb-4">
              <label className="block font-medium text-gray-700">Product Category</label>
              <select
                value={product.category}
                onChange={(e) => setProduct({ ...product, category: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="mb-4">
              <label className="block font-medium text-gray-700">Tags</label>
              <select
                value=""
                onChange={(e) => {
                  const newTag = e.target.value;
                  if (newTag && !product.tags.includes(newTag)) {
                    setProduct((prev) =>
                      prev ? { ...prev, tags: [...prev.tags, newTag] } : null
                    );
                  }
                }}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Tag</option>
                {tagOptions.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
              <div className="flex flex-wrap gap-2 mt-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 text-gray-800 py-1 px-3 rounded-full flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-red-500"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block font-medium text-gray-700">Sizes</label>
              <select
                value=""
                onChange={(e) => {
                  const newSize = e.target.value;
                  if (newSize && !product.sizes.includes(newSize)) {
                    setProduct((prev) =>
                      prev ? { ...prev, sizes: [...prev.sizes, newSize] } : null
                    );
                  }
                }}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select size</option>
                {sizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <div className="flex flex-wrap gap-2 mt-2">
                {product.sizes.map((size, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 text-gray-800 py-1 px-3 rounded-full flex items-center gap-2"
                  >
                    {size}
                    <button
                      type="button"
                      onClick={() => removeSize(size)}
                      className="text-red-500"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block font-medium text-gray-700">Colors</label>
              <select
                value=""
                onChange={(e) => {
                  const newColor = e.target.value;
                  if (newColor && !product.colors.includes(newColor)) {
                    setProduct((prev) =>
                      prev ? { ...prev, colors: [...prev.colors, newColor] } : null
                    );
                  }
                }}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select color</option>
                {colorOptions.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
              <div className="flex flex-wrap gap-2 mt-2">
                {product.colors.map((color, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 text-gray-800 py-1 px-3 rounded-full flex items-center gap-2"
                  >
                    {color}
                    <button
                      type="button"
                      onClick={() => removeColor(color)}
                      className="text-red-500"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

                      {/* Stock */}
          <div className="mb-4">
            <label className="block font-medium text-gray-700">
              Product Stock
            </label>
            <input
              type="number"
              value={product.stock}
              onChange={(e) =>
                setProduct({ ...product, stock: parseInt(e.target.value) })
              }
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Price */}
          <div className="mb-4">
            <label className="block font-medium text-gray-700">
              Product Price
            </label>
            <input
              type="number"
              value={product.price}
              onChange={(e) =>
                setProduct({ ...product, price: parseInt(e.target.value) })
              }
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/*Discounted Price */}
          <div className="mb-4">
            <label className="block font-medium text-gray-700">
              Discount Price
            </label>
            <input
              type="number"
              value={product.discountedPrice}
              onChange={(e) =>
                setProduct({ ...product, discountedPrice: parseInt(e.target.value) })
              }
              className="w-full p-2 border rounded-md"
            />
          </div>

            <button
              type="submit"
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md"
            >
              Update Product
            </button>
          </form>
        </div>
      ) : (
        <p>Loading product details...</p>
      )}
    </div>
  );
};

export default ProductDetailPage;

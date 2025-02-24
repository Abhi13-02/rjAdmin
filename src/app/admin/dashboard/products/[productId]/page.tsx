"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface SizeStock {
  size: string;
  stock: number;
}

interface Product {
  title: string;
  description: string;
  images: string[];
  category: string;
  tags: string[];
  sizes: SizeStock[];
  price: number;
  discountedPrice?: number;
}

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product>({
    title: "",
    description: "",
    images: [],
    category: "",
    tags: [],
    sizes: [],
    price: 0,
    discountedPrice: 0,
  });
  const [newSize, setNewSize] = useState<string>("");
  const [newStock, setNewStock] = useState<number>(0);


  const categories = ["SAREE", "LEHENGA", "SUITS", "KURTI", "DUPATTA"];
  const tagOptions = ["Most Loved", "Banarsi Saree", "Ghatchola Saree","Georgette", "Dola Silk Lehenga","Kota Doirya Lehenga","Art Silk Lehenga"];
  const colorOptions = ["Multicolor", "Black", "Red", "Blue", "Green", "Yellow", "Orange", "Purple", "Pink","White", "Grey", "Brown"];
  const sizeOptions = ["S", "M", "L", "XL", "XXL","XXXL", "FREE-SIZE"];

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

    if( product.title === "" || product.description === "" || product.category === "" || product.tags.length === 0 || product.sizes.length === 0 || product.price === 0 ){
      alert("Please fill in all the required fields."); 
      return;
    }

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

  const removeTag = (tag: string) => {
    setProduct((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const removeSize = (size: string) => {
    setProduct((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((s) => s.size !== size),
    }));
  };

  return (
    <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {product ? (
        <div>
          <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Edit Product
          </h1>
          <form onSubmit={handleUpdateProduct}>
            {/* Product Name */}
            <div className="mb-4">
              <label className="block font-medium text-gray-700 dark:text-gray-300">
                Product Name
              </label>
              <input
                type="text"
                value={product.title}
                onChange={(e) =>
                  setProduct({ ...product, title: e.target.value })
                }
                className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Product Description */}
            <div className="mb-4">
              <label className="block font-medium text-gray-700 dark:text-gray-300">
                Product Description
              </label>
              <input
                type="text"
                value={product.description}
                onChange={(e) =>
                  setProduct({ ...product, description: e.target.value })
                }
                className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Product Category */}
            <div className="mb-4">
              <label className="block font-medium text-gray-700 dark:text-gray-300">
                Product Category
              </label>
              <select
                value={product.category}
                onChange={(e) =>
                  setProduct({ ...product, category: e.target.value })
                }
                className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
              <label className="block font-medium text-gray-700 dark:text-gray-300">
                Tags
              </label>
              <select
                value=""
                onChange={(e) => {
                  const newTag = e.target.value;
                  if (newTag && !product.tags.includes(newTag)) {
                    setProduct((prev) => ({
                      ...prev,
                      tags: [...prev.tags, newTag],
                    }));
                  }
                }}
                className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                    className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 py-1 px-3 rounded-full flex items-center gap-2"
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

            {/* Colors */}
            <div className="mb-4">
              <label className="block font-medium">Colors</label>
              <select
                value=""
                onChange={(e) => {
                  const newTag = e.target.value;
                  if (newTag && !product.tags.includes(newTag)) {
                    setProduct((prev) => ({
                      ...prev,
                      tags: [...prev.tags, newTag],
                    }));
                  }
                }}
                className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              >
                <option value="">Select Colors</option>
                {colorOptions.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 py-1 px-3 rounded-full flex items-center gap-2"
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

            {/* Sizes and Stock */}
            <div className="mb-4">
              <label className="block font-medium text-gray-700 dark:text-gray-300">
                Sizes
              </label>
              <div className="flex gap-2">
                <select
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  className="w-1/2 p-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Select Size</option>
                  {sizeOptions.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Stock"
                  value={newStock}
                  onChange={(e) => setNewStock(parseInt(e.target.value))}
                  className="w-1/2 p-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newSize && newStock > 0) {
                      setProduct((prev) => ({
                        ...prev,
                        sizes: [...prev.sizes, { size: newSize, stock: newStock }],
                      }));
                      setNewSize("");
                      setNewStock(0);
                    }
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {product.sizes.map((s, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 py-1 px-3 rounded-full flex items-center gap-2"
                  >
                    {s.size} (Stock: {s.stock})
                    <button
                      type="button"
                      onClick={() => removeSize(s.size)}
                      className="text-red-500"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="mb-4">
              <label className="block font-medium text-gray-700 dark:text-gray-300">
                Product Price
              </label>
              <input
                type="number"
                value={product.price}
                onChange={(e) =>
                  setProduct({ ...product, price: parseInt(e.target.value) })
                }
                className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Discounted Price */}
            <div className="mb-4">
              <label className="block font-medium text-gray-700 dark:text-gray-300">
                Discount Price
              </label>
              <input
                type="number"
                value={product.discountedPrice}
                onChange={(e) =>
                  setProduct({ ...product, discountedPrice: parseInt(e.target.value) })
                }
                className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <button
              type="submit"
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
            >
              Update Product
            </button>
          </form>
        </div>
      ) : (
        <p className="text-gray-900 dark:text-gray-100">Loading product details...</p>
      )}
    </div>
  );
};

export default ProductDetailPage;
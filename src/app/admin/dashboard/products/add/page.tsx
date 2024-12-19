"use client";

import React, { useState } from "react";

// Define the product interface for TypeScript
interface Product {
  title: string;
  description: string;
  images: string[];
  category: string;
  tags: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  price: number;
}

const AddProductPage = () => {
  const [product, setProduct] = useState<Product>({
    title: "",
    description: "",
    images: [],
    category: "",
    tags: [],
    sizes: [],
    colors: [],
    stock: 0,
    price: 0,
  });
  const [newTag, setNewTag] = useState<string>("");
  const [newSize, setNewSize] = useState<string>("");
  const [newColor, setNewColor] = useState<string>("");

  const handleAddProduct = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch("/api/products/addProducts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    if (response.ok) {
      alert("Product added successfully");
      setProduct({
        title: "",
        description: "",
        images: [],
        category: "",
        tags: [],
        sizes: [],
        colors: [],
        stock: 0,
        price: 0,
      });
    } else {
      alert("Failed to add product. Please try again.");
    }
  };

  const addTag = () => {
    if (newTag && !product.tags.includes(newTag)) {
      setProduct((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
      setNewTag("");
    }
  };

  const addSize = () => {
    if (newSize && !product.sizes.includes(newSize)) {
      setProduct((prev) => ({ ...prev, sizes: [...prev.sizes, newSize] }));
      setNewSize("");
    }
  };

  const addColor = () => {
    if (newColor && !product.colors.includes(newColor)) {
      setProduct((prev) => ({ ...prev, colors: [...prev.colors, newColor] }));
      setNewColor("");
    }
  };

  return (
    <div className="w-full">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Add New Product</h1>
        <form onSubmit={handleAddProduct}>
          <div className="mb-4">
            <label className="block font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              value={product.title}
              onChange={(e) =>
                setProduct({ ...product, title: e.target.value })
              }
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium text-gray-700">
              Product category
            </label>
            <input
              type="text"
              value={product.category}
              onChange={(e) =>
                setProduct({ ...product, category: e.target.value })
              }
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium text-gray-700">
              Product Description
            </label>
            <textarea
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium text-gray-700">Images</label>
            <input
              type="file"
              multiple
              onChange={(e) =>
                setProduct({
                  ...product,
                  images: Array.from(e.target.files || []).map((file) =>
                    URL.createObjectURL(file)
                  ),
                })
              }
              className="w-full p-2 border rounded-md"
            />
            <div className="mt-2 flex gap-2">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Product Image ${index}`}
                  className="w-16 h-16 object-cover rounded"
                />
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block font-medium text-gray-700">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {product.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-800 py-1 px-3 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add tag"
              className="w-full p-2 border rounded-md"
            />
            <button
              type="button"
              onClick={addTag}
              className="mt-2 bg-blue-600 text-white p-2 rounded-md"
            >
              Add Tag
            </button>
          </div>

          <div className="mb-4">
            <label className="block font-medium text-gray-700">Colors</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {product.colors.map((color, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-800 py-1 px-3 rounded-full"
                >
                  {color}
                </span>
              ))}
            </div>
            <input
              type="text"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              placeholder="Add color"
              className="w-full p-2 border rounded-md"
            />
            <button
              type="button"
              onClick={addColor}
              className="mt-2 bg-blue-600 text-white p-2 rounded-md"
            >
              Add color
            </button>
          </div>

          <div className="mb-4">
            <label className="block font-medium text-gray-700">Sizes</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {product.sizes.map((size, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-800 py-1 px-3 rounded-full"
                >
                  {size}
                </span>
              ))}
            </div>
            <input
              type="text"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              placeholder="Add tag"
              className="w-full p-2 border rounded-md"
            />
            <button
              type="button"
              onClick={addSize}
              className="mt-2 bg-blue-600 text-white p-2 rounded-md"
            >
              Add Size
            </button>
          </div>

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

          {/* Additional fields for sizes, colors (similar to tags) */}

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;

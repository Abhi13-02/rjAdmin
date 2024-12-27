"use client";

import React, { useState } from "react";

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

const AddProductPage = () => {
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
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const categories = ["SAREE", "LENGHA", "SALWAR & KAMEEZ", "KURTI", "DUPATTA"];
  const tagOptions = ["Most Loved", "Banarsi Saree", "Ghatchola Saree","Georgette", "Dola Silk Lehenga","Kota Doirya Lehenga","Art Silk Lehenga"];
  const colorOptions = ["Multicolor", "Black", "Red", "Blue", "Green", "Yellow", "Orange", "Purple", "Pink","White", "Grey", "Brown"];
  const sizeOptions = ["S", "M", "L", "XL", "XXL", "FREE-SIZE"];

  const handleAddProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    if(files.length === 0 || product.title === "" || product.description === "" || product.category === "" || product.tags.length === 0 || product.sizes.length === 0 || product.price === 0 ){
      alert("Please fill in all the required fields."); 
      return;
    }
    try {
      setUploading(true);
      const publicUrls: string[] = [];
      for (const file of files) {
        const presignedUrlResponse = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name, contentType: file.type }),
        });
        const { presignedUrl, publicUrl } = await presignedUrlResponse.json();
        await fetch(presignedUrl, { method: "PUT", body: file });
        publicUrls.push(publicUrl);
      }
      const updatedProduct = { ...product, images: publicUrls };
      const response = await fetch("/api/products/addProducts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
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
          price: 0,
        });
        setFiles([]);
      } else {
        alert("Failed to add product. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while uploading images. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const removeTag = (tag: string) =>
    setProduct((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));

  const removeSize = (size: string) =>
    setProduct((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((s) => s.size !== size),
    }));

  return (
    <div className="w-full p-6">
      <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Add New Product</h1>
        <form onSubmit={handleAddProduct}>
          {/* Product Name */}
          <div className="mb-4">
            <label className="block font-medium">Product Name</label>
            <input
              type="text"
              value={product.title}
              onChange={(e) =>
                setProduct({ ...product, title: e.target.value })
              }
              className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block font-medium">Category</label>
            <select
              value={product.category}
              onChange={(e) =>
                setProduct({ ...product, category: e.target.value })
              }
              className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block font-medium">Description</label>
            <textarea
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
          </div>

          {/* Images */}
          <div className="mb-4">
            <label className="block font-medium">Images</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
            <div className="mt-2 flex gap-2">
              {files.map((image, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt={`Image ${index}`}
                  className="w-16 h-16 object-cover rounded"
                />
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="mb-4">
            <label className="block font-medium">Tags</label>
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
              <option value="">Select Tag</option>
              {tagOptions.map((tag) => (
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

          {/* Sizes */}
          <div className="mb-4">
            <label className="block font-medium">Sizes</label>
            <div className="flex gap-2">
              <select
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                className="w-1/2 p-2 border rounded-md bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
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
                className="w-1/2 p-2 border rounded-md bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
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
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((s, index) => (
                <span
                  key={index}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 py-1 px-3 rounded-full flex items-center gap-2"
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
            <label className="block font-medium">Price</label>
            <input
              type="number"
              value={product.price}
              onChange={(e) =>
                setProduct({ ...product, price: parseInt(e.target.value) })
              }
              className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
          </div>

          {/*Discounted Price */}
            <div className="mb-4">
            <label className="block font-medium ">
              Discount Price
            </label>
            <input
              type="number"
              value={product.discountedPrice}
              onChange={(e) =>
                setProduct({
                  ...product,
                  discountedPrice: parseInt(e.target.value),
                })
              }
              className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
          </div>


          <div>
            <button
              type="submit"
              disabled={uploading}
              className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Add Product"}
            </button>
          </div>
        </form>
        {error && (
          <div className="mt-4 text-red-500 bg-red-100 dark:bg-red-800 p-3 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProductPage;

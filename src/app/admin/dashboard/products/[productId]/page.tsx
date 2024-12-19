"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

 // Import AdminLayout for consistent layout

interface Product {
  title: string;
  description: string;
  images: string[];
  tags: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  price: number;
}

const ProductDetailPage = () => {
  const {productId} = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [newTag, setNewTag] = useState<string>("");
  const [newSize, setNewSize] = useState<string>("");
  const [newColor, setNewColor] = useState<string>("");

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
  
    // Send the PUT request to update the product
    const response = await fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
  
    if (response.ok) {
      alert("Product updated successfully");
      // router.push("/admin/dashboard/products"); 
    } else {
      alert("Failed to update the product. Please try again.");
    }
  };
  

  const addTag = () => {
    if (newTag && !product?.tags.includes(newTag)) {
      setProduct((prevProduct) => ({
        ...prevProduct!,
        tags: [...prevProduct!.tags, newTag],
      }));
      setNewTag(""); // Reset the input
    }
  };

  const addSize = () => {
    if (newSize && !product?.sizes.includes(newSize)) {
      setProduct((prevProduct) => ({
        ...prevProduct!,
        sizes: [...prevProduct!.sizes, newSize],
      }));
      setNewSize(""); // Reset the input
    }
  };

  const addColor = () => {
    if (newColor && !product?.colors.includes(newColor)) {
      setProduct((prevProduct) => ({
        ...prevProduct!,
        colors: [...prevProduct!.colors, newColor],
      }));
      setNewColor(""); // Reset the input
    }
  };

  const handleTagKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      addTag();
    }
  };

  const handleSizeKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      addSize();
    }
  };

  const handleColorKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      addColor();
    }
  };

  return (
    <div className="w-full">
      {product ? (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold mb-4">Edit Product</h1>
          <form onSubmit={handleUpdateProduct}>
            <div className="mb-4">
              <label className="block font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                value={product.title}
                onChange={(e) => setProduct({ ...product, title: e.target.value })}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium text-gray-700">Product Description</label>
              <input
                type="text"
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="mb-4 ">
              <label className="block font-medium text-gray-700">Images</label>
              <input
                type="file"
                multiple
                onChange={(e) =>
                  setProduct({
                    ...product,
                    images: Array.from(e.target.files || []).map((file) => URL.createObjectURL(file)),
                  })
                }
                className="w-full p-2 border rounded-md"
              />
              <div className="mt-2 flex gap-2">
                {product.images.map((image, index) => (
                  <img key={index} src={image} alt={`Product Image ${index}`} className="w-16 h-16 object-cover rounded" />
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="mb-4">
              <label className="block font-medium text-gray-700">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {product.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-200 text-gray-800 py-1 px-3 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleTagKeyPress}
                placeholder="Add tag"
                className="w-full p-2 border rounded-md"
              />
              <button type="button" onClick={addTag} className="mt-2 bg-blue-600 text-white p-2 rounded-md">
                Add Tag
              </button>
            </div>

            {/* Size Options */}
            <div className="mb-4">
              <label className="block font-medium text-gray-700">Size Options</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {product.sizes.map((size, index) => (
                  <span key={index} className="bg-gray-200 text-gray-800 py-1 px-3 rounded-full">
                    {size}
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                onKeyDown={handleSizeKeyPress}
                placeholder="Add size"
                className="w-full p-2 border rounded-md"
              />
              <button type="button" onClick={addSize} className="mt-2 bg-blue-600 text-white p-2 rounded-md">
                Add Size
              </button>
            </div>

            {/* Color Options */}
            <div className="mb-4">
              <label className="block font-medium text-gray-700">Color Options</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {product.colors.map((color, index) => (
                  <span key={index} className="bg-gray-200 text-gray-800 py-1 px-3 rounded-full">
                    {color}
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                onKeyDown={handleColorKeyPress}
                placeholder="Add color"
                className="w-full p-2 border rounded-md"
              />
              <button type="button" onClick={addColor} className="mt-2 bg-blue-600 text-white p-2 rounded-md">
                Add Color
              </button>
            </div>

            <div className="mb-4">
              <label className="block font-medium text-gray-700">Stock</label>
              <input
                type="number"
                value={product.stock}
                onChange={(e) => setProduct({ ...product, stock: parseInt(e.target.value) })}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium text-gray-700">Price</label>
              <input
                type="number"
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
              Update Product
            </button>
          </form>
        </div>
      ) : (
        <p>Loading product...</p>
      )}
    </div>
  );
};

export default ProductDetailPage;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Add.css"
import { Link } from "react-router-dom";
import { MdAddShoppingCart } from "react-icons/md";
import Navbar from "../Partials/Navbar";
import { toast } from "react-toastify";

export const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    product_name: "",
    category_id: "",
    mrp: "",
    sp: "",
    cp: "",
    classification: "",
    size: "",
  });

  const [categoryData, setCategoryData] = useState([]);




useEffect(() => {
  fetch("https://pern-backend-y1w9.onrender.com/category", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        setCategoryData(data.response);   
      } else {
        setCategoryData([]);
        toast.error(data.reason);
      }
    })
    .catch((err) => {
      console.error("Category fetch error:", err);
      setCategoryData([]);
    });
}, []);


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    const response = await fetch("https://pern-backend-y1w9.onrender.com/addProduct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (!result.success) {   
      toast.error(result.reason);
      return;
    }

    toast.success("Product Added Successfully");
    console.log("Server response:", result);

    // Reset form before navigating
    setFormData({
      name: "",
      category_id: "",
      mrp: "",
      sp: "",
      cp: "",
      classification: "",
      size: "",
    });

    navigate("/dashboard");
  } catch (error) {
    console.error("Error adding product:", error);
    toast.err("Error adding product");
  }
};


  return (
    <div>
      <Navbar />
    
    <div className="hero-section">
      
      <div className="container">
        <h1 className="hero-component-heading">
          <MdAddShoppingCart /> Add Product
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Product Name */}
          <div className="row">
            <div className="col-md-12">
              <label className="form-label">Product Name</label>
              <input
                className="form-control"
                name="product_name"
                placeholder="Enter Product Name"
                value={formData.name}
                type="text"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="row">
            <div className="col-md-12">
              <label className="form-label">Category</label>
              <select
                name="category_id"
                className="form-select"
                value={formData.category_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Categories</option>
                {categoryData.map((item) => (
                  <option key={item.category_id} value={item.category_id}>
                    {item.category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* MRP, SP, CP */}
          <div className="row">
            <div className="col-md-4">
              <label className="form-label">MRP</label>
              <input
                className="form-control"
                name="mrp"
                placeholder="Enter MRP"
                value={formData.mrp}
                type="number"
                step="0.01"
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">SP</label>
              <input
                className="form-control"
                name="sp"
                placeholder="Enter SP"
                value={formData.sp}
                type="number"
                step="0.01"
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">CP</label>
              <input
                className="form-control"
                name="cp"
                placeholder="Enter CP"
                value={formData.cp}
                type="number"
                step="0.01"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Classification */}
          <div className="row">
            <div className="col-md-12">
              <label className="form-label">Classification</label>
              <input
                className="form-control"
                name="classification"
                placeholder="Enter Classification"
                value={formData.classification}
                type="text"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Size */}
          <div className="row">
            <div className="col-md-12">
              <label className="form-label">Size</label>
              <input
                className="form-control"
                name="size"
                placeholder="Enter Size"
                value={formData.size}
                type="text"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="d-flex justify-content-between mt-4">
            <button type="submit" className="btn btn-primary-gradient">
              SAVE
            </button>

            <Link to="/dashboard">
              <button type="button" className="close-button">
                Close
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default AddProduct;

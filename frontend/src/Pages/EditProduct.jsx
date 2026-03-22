import React, { useEffect, useState } from "react";
import "../Styles/Add.css";
import { Link } from "react-router-dom";
import { RiEdit2Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Navbar from "../Partials/Navbar";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";


export const EditProduct = () => {
  const navigate = useNavigate();
const location = useLocation();

const [productId, setProductId] = useState(null);
const [dashboardState, setDashboardState] = useState(null);

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


  const searchParams = new URLSearchParams(location.search);
  const ctx = searchParams.get("ctx"); // takes value

if (ctx) {
  try {
    const decodedString = decodeURIComponent(ctx);
    const parsed = JSON.parse(decodedString);

    const product = parsed.product;

    setDashboardState({
      page: parsed.page,
      search: parsed.search,
      filterCategory: parsed.filterCategory,
      editedId: parsed.editedId,
    });

    setFormData({
      product_name: product.productName || "",
      category_id: product.categoryId || "",
      mrp: product.mrp || "",
      sp: product.sp || "",
      cp: product.cp || "",
      classification: product.classification || "",
      size: product.size || "",
    });

    setProductId(product.id);
    return;
  } catch (error) {
    console.error("Decode failed", error);
    toast.error("Invalid product data");
  }
}




if(!ctx && productId) {
  fetch(`https://pern-backend-y1w9.onrender.com/${productId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.success) {
        toast.error(data.reason);
        return;
      }

      const product = data.response[0]; // returns in viewModel

    setFormData({
      product_name: product.productName || "",
      category_id: product.categoryId || "",   // keep as number if you want
      mrp: product.mrp || 0,
      sp: product.sp || 0,
      cp: product.cp || 0,
      classification: product.classification || "",
      size: product.size || "",
    });
    setProductId(product.id);

    });
}
},  [location.search, productId]);




useEffect(() => {
  fetch("https://pern-backend-y1w9.onrender.com/category", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        setCategoryData(data.response);
      }
    });
}, []);




  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(
      `https://pern-backend-y1w9.onrender.com/editProduct/${productId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );

    const data = await response.json();   

    if (!data.success) {                 
      toast.error(data.reason);                
      return;
    }

const updatedState = {
  ...dashboardState,
  editedId: productId
};

const encoded = encodeURIComponent(JSON.stringify(updatedState));

    toast.success("Product Updated Successfully");
    navigate(`/dashboard?ctx=${encoded}`);
  } catch (error) {
    console.error("Error update product: ", error);
    alert("Error updating product");
  }
};


  return (
    <div>
     <Navbar />
    <div className="hero-section">
      <div className="container">
        <h1 className="hero-component-heading">
          <RiEdit2Fill /> Edit Product
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
                value={formData.product_name}
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
{Array.isArray(categoryData) &&
  categoryData.map((item) => (
    <option key={item.category_id} value={item.category_id}>
      {item.category}
    </option>
))}

              </select>
            </div>
          </div>

          {/* MRP, RP, CP */}
          <div className="row">
            <div className="col-md-4">
              <label className="form-label">MRP</label>
              <input
                className="form-control"
                name="mrp"
                value={formData.mrp}
                type="number"
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">SP</label>
              <input
                className="form-control"
                name="sp"
                value={formData.sp}
                type="number"
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">CP</label>
              <input
                className="form-control"
                name="cp"
                value={formData.cp}
                type="number"
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
            {/* <Link to="/ProductList"> */}
            <button type="submit" className="btn btn-primary-gradient">
              SAVE
            </button>
            {/* </Link> */}

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

export default EditProduct;

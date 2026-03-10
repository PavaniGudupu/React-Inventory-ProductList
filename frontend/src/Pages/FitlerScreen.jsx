import React, { useState } from "react";
import "../Styles/Add.css";
import { FaCheck } from "react-icons/fa";
import { FaBackward } from "react-icons/fa6";
import { MdCleaningServices } from "react-icons/md";

const FitlerScreen = ({
  isOpen,
  isClose,
  setData,
  setCurrentPage,
  setTotalPages,
  setAppliedFilters,
  setIsFilterMode,
}) => {
  const clearFilters = {
    id: "",
    idOperator: "",
    product_name: "",
    categoryOperator: "",
    category: "",
    mrpOperator: "",
    mrpValue: "",
    spOperator: "",
    spValue: "",
    cpOperator: "",
    cpValue: "",
    classification: "",
    size: "",
  };
  const [filters, setFilters] = useState({
    id: "",
    idOperator: "",
    product_name: "",
    categoryOperator: "",
    category: "",
    mrpOperator: "",
    mrpValue: "",
    spOperator: "",
    spValue: "",
    cpOperator: "",
    cpValue: "",
    classification: "",
    size: "",
  });
  // const [filterCategory, setFilterCategory] = useState([]);
  const priceFilters = [
    { label: "⇄", value: "" },
    { label: "<", value: "lt" },
    { label: "=", value: "eq" },
    { label: ">", value: "gt" },
  ];

const textFilters = [
  { label: "⇄", value: "" },
  { label: "contains", value: "contains" },
  { label: "equals", value: "eq" },
  { label: "starts with", value: "starts" },
  { label: "ends with", value: "ends" },
];



  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleApply = async () => {
    let formattedFilters = {};

    // Product Code
    if (filters.id && filters.idOperator) {
      formattedFilters["p.id"] = {
        operator: filters.idOperator,
        value: filters.id,
      };
    }

    // Product Name
    if (filters.product_name) {
      formattedFilters["p.product_name"] = {
        operator: "ilike",
        value: filters.product_name,
      };
    }

    
// Category
if (filters.category && filters.categoryOperator) {
  formattedFilters["c.category"] = {
    operator: filters.categoryOperator,
    value: filters.category,
  };
}

    // MRP
    if (filters.mrpOperator && filters.mrpValue) {
      formattedFilters["p.mrp"] = {
        operator: filters.mrpOperator,
        value: filters.mrpValue,
      };
    }

    // SP
    if (filters.spOperator && filters.spValue) {
      formattedFilters["p.sp"] = {
        operator: filters.spOperator,
        value: filters.spValue,
      };
    }

    // CP
    if (filters.cpOperator && filters.cpValue) {
      formattedFilters["p.cp"] = {
        operator: filters.cpOperator,
        value: filters.cpValue,
      };
    }

    // Classification
    if (filters.classification) {
      formattedFilters["p.classification"] = {
        operator: "ilike",
        value: filters.classification,
      };
    }

    // Size
    if (filters.size) {
      formattedFilters["p.size"] = {
        operator: "ilike",
        value: filters.size,
      };
    }

    setAppliedFilters(formattedFilters);
    setIsFilterMode(true);
    setCurrentPage(1);
    isClose();
  };

  return (
    <div className={`filter-panel ${isOpen ? "open" : ""}`}>
      <div className="filter-header">
        <h1>Search Filter</h1>
        <button className="filter-close" onClick={isClose}>
          X
        </button>
      </div>

      <div className="filter-body">
        <div className="row">
          <div className="col-md-12">
            <br></br>
            <label className="form-label">Product Code</label>
            <select
              name="idOperator"
              value={filters.idOperator}
              className="form-price-select"
              onChange={handleChange}
            >
              {priceFilters.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <input
              className="form-control"
              name="id"
              value={filters.id}
              onChange={handleChange}
              placeholder="Enter Product Code"
              type="number"
              step="0.01"
            />
          </div>
        </div>
        <br></br>
        <div className="row">
          <div className="col-md-12">
            <label className="form-label">Product Name</label>
            <input
              onChange={handleChange}
              className="filter-control"
              name="product_name"
              placeholder="Enter Product Name"
              value={filters.product_name}
              type="text"
            />
          </div>
        </div>
        <br></br>

        <div className="row">
          <div className="col-md-12">
            <label className="form-label">Category</label>
            <select
              name="categoryOperator"
              value={filters.categoryOperator}
              className="form-price-select"
              onChange={handleChange}
            >
              {textFilters.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <input
              className="form-control"
              name="category"
              value={filters.category}
              onChange={handleChange}
              placeholder="Enter Category"
              type="text"
            />

          </div>
        </div>

        <br></br>
        <div className="row">
          <div className="col-md-4">
            <label className="form-label">MRP</label>
            <select
              name="mrpOperator"
              value={filters.mrpOperator}
              className="form-price-select"
              onChange={handleChange}
            >
              {priceFilters.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <input
              className="form-control"
              name="mrpValue"
              value={filters.mrpValue}
              onChange={handleChange}
              placeholder="Enter MRP"
              type="number"
              step="0.01"
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            <label className="form-label">
              SP <br></br>
            </label>
            <br></br>
            <br></br>
            <select
              name="spOperator"
              value={filters.spOperator}
              className="form-price-select"
              onChange={handleChange}
            >
              {priceFilters.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <input
              className="form-control"
              name="spValue"
              placeholder="Enter SP"
              value={filters.spValue}
              onChange={handleChange}
              type="number"
              step="0.01"
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            <label className="form-label">
              CP <br></br>
            </label>
            <br></br>
            <select
              name="cpOperator"
              value={filters.cpOperator}
              className="form-price-select"
              onChange={handleChange}
            >
              {priceFilters.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <input
              className="form-control"
              name="cpValue"
              onChange={handleChange}
              placeholder="Enter CP"
              value={filters.cpValue}
              type="number"
              step="0.01"
            />
          </div>
        </div>
        <br></br>
        <div className="row">
          <div className="col-md-12">
            <label className="form-label">Classification</label>
            <input
              onChange={handleChange}
              className="filter-control"
              name="classification"
              placeholder="Enter Classification"
              value={filters.classification}
              type="text"
            />
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-md-12">
            <label className="form-label">Size</label>
            <input
              onChange={handleChange}
              className="filter-control"
              name="size"
              placeholder="Enter Size"
              value={filters.size}
              type="text"
            />
          </div>
        </div>

        <br></br>

        <div className="row">
          <button
            type="button"
            onClick={handleApply}
            className="filter-apply-btn"
          >
            Apply <FaCheck />
          </button>

          <button
            type="submit"
            onClick={() => setFilters(clearFilters)}
            className="filter-clear-btn"
          >
            Clear <MdCleaningServices />
          </button>
          <button type="submit" onClick={isClose} className="filter-close-btn">
            <FaBackward />{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FitlerScreen;

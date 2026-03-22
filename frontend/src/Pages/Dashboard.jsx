import React, { useState, useEffect, useCallback } from "react";
import { FaListAlt } from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";
import { MdDeleteForever } from "react-icons/md";
import { Link } from "react-router-dom";
import "../Styles/Dashboard.css";
import axios from "axios";
import Navbar from "../Partials/Navbar";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import FilterScreen from "./FitlerScreen.jsx";
import { FaSearch } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("p.product_name");
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lastEditId, setLastEditId] = useState(null);

  const [appliedFilters, setAppliedFilters] = useState({});
  const [isFilterMode, setIsFilterMode] = useState(false); //chips

  const [isFilterOpen, setFilterScreen] = useState(false);

  const size = 10;
  const location = useLocation();

  //  Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      const bodyData = {
        page: currentPage,
        size,
        ...(isFilterMode
          ? { filters: appliedFilters }
          : { filterCategory, search }),
      };
      const res = await fetch("https://pern-backend-y1w9.onrender.com/productList", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      const json = await res.json(); 
      const pagination = json.response;
      setData(pagination.results);
      setTotalPages(pagination.totalPages);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }, [currentPage, filterCategory, search, isFilterMode, appliedFilters]);

  //  Restore page, search, filter & highlight after edit
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const ctx = searchParams.get("ctx");
    if (ctx) {
      try {
        const decodedString = decodeURIComponent(ctx);
        const parsed = JSON.parse(decodedString);
        const { page, search, filterCategory, editedId } = parsed;
        if (page) {
          setCurrentPage(page);
        }
        if (search) {
          setSearch(search);
        }
        if (filterCategory) {
          setFilterCategory(filterCategory);
        }
        if (editedId) {
          setLastEditId(editedId);
        }
      } catch (error) {
        console.log(error.message);
        toast.error(error.message);
      }
    }
  }, [location.search]);

  // ✅ Load data
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 🔍 Search
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // 🗂 Filter
  const handleCategory = (e) => {
    setFilterCategory(e.target.value);
    setCurrentPage(1);
  };

  // 🗑 Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const res = await axios.post(`https://pern-backend-y1w9.onrender.com/deleteProduct/${id}`);

      if (res.data.success) {
        toast.success("Product deleted");
        fetchProducts();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const highlightText = (text, search) => {
  if (!search) return text;

  const regex = new RegExp(`(${search})`, "gi"); //"gi" flags - global , ignore case

  const parts = text.split(regex);

  return parts.map((part, i) =>
    part.toLowerCase() === search.toLowerCase()
      ? <mark key={i}>{part}</mark>
      : part
  );
};


  // Encode row data
  const encodeCtx = (obj) => encodeURIComponent(JSON.stringify(obj));

  return (
    <div className="product-section">
      <Navbar />

      <div className="container">
        <br />
        <br />
        <h1 className="page-heading">
          <FaListAlt /> Product List
        </h1>

        {/* Search */}
        <div className="search-bar">
          <select
            value={filterCategory}
            onChange={handleCategory}
            className="form-select"
          >
            <option value="p.product_name">Product Name</option>
            <option value="c.category">Category</option>
            <option value="p.mrp">MRP</option>
            <option value="p.sp">SP</option>
            <option value="p.cp">CP</option>
            <option value="p.classification">Classification</option>
            <option value="p.size">Size</option>
          </select>

          <input
            className="form-control"
            placeholder="Search..."
            value={search}
            onChange={handleSearch}
          />

          <button
            type="button"
            className={`dashboard-filter ${isFilterMode ? "filter-active" : ""}`}
            onClick={() => {
              setFilterScreen(true);
            }}
          >
            <FaSearch /> Filters | <FaFilter />
          </button>
          <FilterScreen
            isOpen={isFilterOpen}
            isClose={() => setFilterScreen(false)}
            setData={setData}
            setCurrentPage={setCurrentPage}
            setTotalPages={setTotalPages}
            setAppliedFilters={setAppliedFilters}
            setIsFilterMode={setIsFilterMode} //chips
          />
        </div>

        {/* Table */}
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>MRP</th>
              <th>SP</th>
              <th>CP</th>
              <th>Class</th>
              <th>Size</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => {
              //const ctx = encodeCtx(item);
              return (
                <tr
                  key={item.id}
                  className={item.id === lastEditId ? "highlight-row" : ""}
                >
                  <td>{item.id}</td>
                  <td>{highlightText(item.productName, search)}</td>
                  <td>{highlightText(item.category, search)}</td>
                  <td>{highlightText(item.mrp, search)}</td>
                  <td>{highlightText(item.sp, search)}</td>
                  <td>{highlightText(item.cp, search)}</td>
                  <td>{highlightText(item.classification, search)}</td>
                  <td>{highlightText(item.size, search)}</td>
                  <td>
                    <Link
                      to={`/EditProduct?ctx=${encodeCtx({
                        product: item,
                        page: currentPage,
                        search,
                        filterCategory,
                        editedId: item.id,
                      })}`}
                    >
                      <button className="btn btn-primary">
                        <RiEdit2Fill /> Edit
                      </button>
                    </Link>

                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(item.id)}
                    >
                      <MdDeleteForever /> Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* FILTER CHIPS - state and nultiple filters applied in filter scereen */}

        {isFilterMode && Object.keys(appliedFilters).length > 0 && (
          <div className="filter-chips-container">
            <span
              className="chip clear-all"
              onClick={() => {
                setAppliedFilters({});
                setIsFilterMode(false);
                setCurrentPage(1);
              }}
            >
              {" "}
              ✖ Clear All{" "}
            </span>

            {Object.entries(appliedFilters).map(([key, value]) => (
              <span key={key} className="chip">
                {key}
                {value.operator === "gt" && " > "}
                {value.operator === "lt" && " < "}
                {value.operator === "eq" && " = "}
                {value.operator === "ilike" && " contains "}
                {value.value}

                <button
                  className="chip-close"
                  onClick={() => {
                    const updated = { ...appliedFilters };
                    delete updated[key];

                    // Before:
                    // {
                    //  product_name: {...},
                    //  mrp: {...}
                    // }

                    // After:
                    // {
                    //  product_name: {...}
                    // }

                    // Then:setAppliedFilters(updated)

                    setAppliedFilters(updated);

                    if (Object.keys(updated).length === 0) {
                      setIsFilterMode(false);
                    }
                  }}
                >
                  ✖
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
          >
            First
          </button>

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </button>
          {(() => {
            const buttons = [];

            for (let page = 1; page <= totalPages; page++) {
              buttons.push(
                <button
                  key={page}
                  className={page === currentPage ? "active" : ""}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>,
              );
            }

            return buttons;
          })()}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as productData from "./DataModel/productData.js";
import { success, failure } from "./utils/apiResponse.js";
import { productDto } from "./dto/product.dto.js";
import { mapToProductDTO } from "./utils/productMapper.js";
import { mapToViewDTO } from "./utils/viewMapper.js";
import {
  addProductValidation,
  editProductValidation,
  productIdValidation,
} from "./middleware/productValidation.js";
import { validationResult } from "express-validator";

const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.post("/productList", async (req, res) => {
  try {
    const filterCategory = req.body.filterCategory;
    const search = req.body.search;
    const filters = req.body.filters;
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.size) || 10;
    const offset = (page - 1) * limit;

    let total;
    let rows;
    if(filters) {
    total = await productData.getProductListCount({filters, });
    rows = await productData.getProductListNew({ 
      filters, size: limit, offset });     
    } else {
   total = await productData.getProductCount({
      filterCategory,
      search,
    });
    rows = await productData.getProductList({
      filterCategory,
      search,
      size: limit,
      offset,
    });
    }

    const results = rows.map(mapToViewDTO);
    const totalPages = Math.ceil(total / limit);

    const pagination = {
      current: { page, limit },
      totalPages,
      results,
    };

    if (page < totalPages) {
      pagination.next = { page: page + 1, limit };
    }

    if (page > 1) {
      pagination.previous = { page: page - 1, limit };
    }

    res.json(success(pagination));
  } catch (error) {
    res.status(500).json(failure(error.message));
  }
});



app.post("/product/:id", productIdValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(500).json({
        success: false,
        response: null,
        failure: true,
        reason: errors.array()[0].msg,
      });
    }
    const id = parseInt(req.params.id);
    const response = await productData.getProduct(id);
    const result = response.map(mapToViewDTO);
    if (result.length > 0) {
      res.json(success(result));
    } else {
      res.status(404).json({ success: false, message: "Product not found" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json(failure(error.message));
  }
});

app.post("/category", async (req, res) => {
  try {
    const response = await productData.getCategory();
    res.json(success(response));
  } catch (error) {
    console.log(error.message);
    res.status(500).json(failure(error.message));
  }
});

app.post("/summary", async (req, res) => {
  try {
    const response = await productData.getDashboardCount({
      filterCategory,
      search,
    });
    res.json(success(response));
  } catch (error) {
    console.log(error.message);
    res.status(500).json(failure(error.message));
  }
});

app.post("/addProduct", addProductValidation, async (req, res) => {
  try {
    const errors = validationResult(req); //if validation fails send error message
    if (!errors.isEmpty()) {
      return res.json({
        success: false,
        response: null,
        failure: true,
        reason: errors.array()[0].msg,
      });
    }

    const dto = mapToProductDTO(req.body, productDto);
    //console.log(dto);
    const response = await productData.addProduct(dto);
    const result = response.map(mapToViewDTO);
    res.json(success(result));
  } catch (error) {
    console.log(error.message);
    res.status(500).json(failure(error.message));
  }
});

app.post("/editProduct/:id", editProductValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(500).json({
        success: false,
        response: null,
        failure: true,
        reason: errors.array()[0].msg,
      });
    }

    const id = parseInt(req.params.id);
    const dto = mapToProductDTO(req.body, productDto);
    const response = await productData.editProduct(id, dto);
    const result = response.map(mapToViewDTO);
    if (result.length > 0) {
      res.json(success(result));
    } else {
      res.status(404).json({ success: false, message: "Product not found" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json(failure(error.message));
  }
});

app.post("/deleteProduct/:id", productIdValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(500).json({
        success: false,
        response: null,
        failure: true,
        reason: errors.array()[0].msg,
      });
    }

    const id = parseInt(req.params.id);
    const deleted = await productData.deleteProduct(id);

    if (deleted.length > 0) {
      res.json({ success: true, message: "Product deleted successfully" });
    } else {
      res.status(404).json({ success: false, message: "Product not found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port: http://localhost:${port}`);
});

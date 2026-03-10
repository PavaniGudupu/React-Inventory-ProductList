import db from "./db.js";

export const getProductListNew = async (columns) => {
  const { filters = {}, size = 10, offset = 0 } = columns;
  let sql = `SELECT p.*, c.category FROM products p 
             INNER JOIN category c ON p.category_id = c.category_id`;

  let conditions = [];
//   "filters": {
//     "mrp": { "operator": ">", "value": 1000 }
//     "sp": { "operator": ">", "value": 1000 }
//   }
for (let key in filters) {
  const filter = filters[key];
  const operator = filter.operator || "ilike";
  const value = filter.value;

  if (operator === "eq") {
    conditions.push(`${key} = '${value}'`);
  }

  if (operator === "gt") {
    conditions.push(`${key} > ${value}`);
  }

  if (operator === "lt") {
    conditions.push(`${key} < ${value}`);
  }

  if (operator === "ilike") {
    conditions.push(`${key} ILIKE '%${value}%'`);
  }

  if (operator === "contains") {
    conditions.push(`${key} ILIKE '%${value}%'`);
  }

  if (operator === "starts") {
    conditions.push(`${key} ILIKE '${value}%'`);
  }

  if (operator === "ends") {
    conditions.push(`${key} ILIKE '%${value}'`);
  }
    }
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }
  sql += ` ORDER BY p.id DESC LIMIT ${size} OFFSET ${offset}`;

// SELECT p.*, c.category FROM products p 
// INNER JOIN category c ON p.category_id = c.category_id

// WHERE mrp > 1000 AND sp < 5000 AND name ILIKE '%iphone%'

// ORDER BY p.id DESC
// LIMIT 10 OFFSET 0;
  return db.manyOrNone(sql);
};

export const getProductListCount = async (columns) => {
  const { filters = {} } = columns;

  let sql = `
    SELECT COUNT(*) AS total
    FROM products p
    INNER JOIN category c ON p.category_id = c.category_id
  `;

  let conditions = [];

  for (let key in filters) {
    const filter = filters[key];
    const operator = filter.operator || "ilike";
    if (operator === "eq") {
      conditions.push(`${key} = '${filter.value}'`);
    }
    if (operator === "gt") {
      conditions.push(`${key} > ${filter.value}`);
    }
    if (operator === "lt") {
      conditions.push(`${key} < ${filter.value}`);
    }
    if (operator === "ilike") {
      conditions.push(`${key} ILIKE '%${filter.value}%'`);
    }
  }
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }
  const result = await db.one(sql);
  return Number(result.total);
};

export const getProductList = async (columns) => {
  const { filterCategory, search, size = 10, offset = 0 } = columns;

  let sql = `
    SELECT p.*, c.category
    FROM products p
    INNER JOIN category c ON p.category_id = c.category_id
  `;

  if (filterCategory && search) {
    columns.search = `%${search}%`;
    sql += `
      WHERE ${filterCategory}::text ILIKE \${search}
      ORDER BY p.id DESC
      LIMIT \${size} OFFSET \${offset}
    `;
  } else {
    sql += `
      ORDER BY p.id DESC
      LIMIT \${size} OFFSET \${offset}
    `;
  }

  return db.manyOrNone(sql, columns);
};

export const getProductCount = async (columns) => {
  const { filterCategory, search } = columns;

  let sql = `
    SELECT COUNT(*) AS total
    FROM products p
    INNER JOIN category c ON p.category_id = c.category_id
  `;

  if (filterCategory && search) {
    columns.search = `%${search}%`;
    sql += ` WHERE ${filterCategory}::text ILIKE \${search}`;
  }

  const result = await db.one(sql, columns);
  return Number(result.total);
};

export const getProduct = async (id) => {
  let sql = `SELECT p.*, c.category FROM products p
   INNER JOIN category c on p.category_id = c.category_id 
   WHERE id=${id} ORDER BY p.id DESC`;
  const result = await db.any(sql, id);
  return result;
};

export const getCategory = async () => {
  let sql = `SELECT * FROM category ORDER BY category_id ASC`;
  const result = await db.manyOrNone(sql);
  return result;
};

export const addProduct = async (columns) => {
  const { product_name, category_id, mrp, sp, cp, classification, size } =
    columns;
  let sql = `INSERT INTO products (product_name, category_id, mrp, sp, cp, classification, size)
    VALUES (\${product_name}, \${category_id}, \${mrp}, \${sp}, \${cp}, \${classification}, \${size})
    RETURNING *`;
  const result = await db.any(sql, columns);
  return result;
};

export const editProduct = async (id, columns) => {
  const { product_name, category_id, mrp, sp, cp, classification, size } =
    columns;
  let sql = `UPDATE products SET 
    product_name=\${product_name}, category_id=\${category_id}, mrp=\${mrp}, 
    sp=\${sp},  cp=\${cp}, classification=\${classification}, size=\${size}
    WHERE id=\${id} RETURNING *`;
  const result = await db.any(sql, {
    id,
    product_name,
    category_id,
    mrp,
    sp,
    cp,
    classification,
    size,
  });
  return result;
};

export const deleteProduct = async (id) => {
  const sql = `DELETE FROM products WHERE id = $1 RETURNING *`;
  const result = await db.any(sql, [id]);
  return result;
};

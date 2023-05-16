const keyQuery = {
  uncompare: ["sort", "page", "random"],
  filter: [
    "name",
    "phone",
    "sort",
    "page",
    "brand",
    "aroma",
    "type",
    "capacity",
    "price",
    "stock",
    "field",
    "random",
  ],
  order: {
    getList: ["_id", "name", "phone", "address", "status", "total", "submitAt"],
    includeCompare: ["name", "phone"],
    numberCompare: [],
  },
  product: {
    all: ["name", "brand", "image", "aroma", "type", "capacity", "price", "stock", "description"],
    numberCompare: ["stock", "price"],
    includeCompare: ["name"],
    distinct: ["brand", "type", "aroma", "capacity"],
    getList: ["_id", "image", "name", "price", "stock"],
  },
};

export default keyQuery;

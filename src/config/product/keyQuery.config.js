const keyQuery = {
  all: ["name", "brand", "image", "aroma", "type", "capacity", "price", "stock", "description"],
  uncompare: ["sort", "page", "field", "random"],
  numberCompare: ["stock", "price"],
  includeCompare: ["name"],
  filter: ["name", "sort", "page", "brand", "aroma", "type", "capacity", "price", "stock", "field", "random"],
  distinct: ["brand", "type", "aroma", "capacity"],
  getList: ["_id", "image", "name", "price", "stock"],
};

export default keyQuery;

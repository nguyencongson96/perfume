const keyQuery = {
  all: [
    "name",
    "brand",
    "image",
    "aroma",
    "type",
    "capacity",
    "price",
    "stock",
    "description",
  ],
  uncompare: ["sort", "page", "field", "random"],
  numberCompare: ["stock", "price"],
  includeCompare: ["name"],
  search: ["name", "sort", "page", "field"],
  filter: [
    "name",
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
  distinct: ["brand", "type", "aroma", "capacity"],
};

export default keyQuery;

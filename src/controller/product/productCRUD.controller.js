import Products from "#root/model/products.model.js";
import keyQuery from "#root/config/keyQuery.config.js";
import asyncWrapper from "#root/middleware/async.middleware.js";
import _throw from "#root/utils/throw.js";
import currentTime from "#root/utils/currentTime.js";
import limit from "#root/config/pagination.config.js";
import convertMatchCondition from "#root/utils/convertMatchCondition.js";

const productCRUD = {
  getProductsByFilter: asyncWrapper(async (req, res) => {
    const query = req.query;

    // Find products that match the query object
    const products = (
      await Products.aggregate(
        [
          //filter to match conditions
          { $match: convertMatchCondition("product", query) },

          //Sort by one of 2 fields are price or name
          query.sort
            ? {
                $sort: {
                  [query.sort.slice(0, 1) === "p" ? "price" : "name"]:
                    query.sort.slice(1, 3) === "ac" ? 1 : -1,
                },
              }
            : false,

          //Get total product meet the condition and get remove unnecessary field of each product
          {
            $facet: {
              totalCount: [{ $count: "total" }],
              list: [
                {
                  $project: keyQuery.product.getList.reduce((obj, val) => {
                    return { ...obj, [val]: 1 };
                  }, {}),
                },
              ],
            },
          },

          //Deconstructs array of field totalCount and list
          { $unwind: "$totalCount" },
          { $unwind: "$list" },

          //Get random product, and auto set random number is limit
          query.random ? { $sample: { size: Number(query.random || limit) } } : false,

          // Paginate the results
          query.page > 1 ? { $skip: limit * (query.page - 1) } : false,
          query.page ? { $limit: limit } : false,

          // Replace the root of the results
          {
            $replaceRoot: {
              newRoot: {
                total: "$totalCount.total",
                pages: { $ceil: { $divide: ["$totalCount.total", limit] } },
                list: "$list",
              },
            },
          },

          // Group the results again
          {
            $group: {
              _id: "$total",
              total: { $avg: "$total" },
              numberOfPages: { $avg: "$pages" },
              list: {
                $push: keyQuery.product.getList.reduce((obj, val) => {
                  return { ...obj, [val]: `$list.${val}` };
                }, {}),
              },
            },
          },

          // Remove the ID field from the results
          { $unset: "_id" },

          // Add fields to the results
          query.page && { $addFields: { pageNumber: Number(query.page) } },
          query.page && { $addFields: { productNumber: { $min: [limit, { $size: "$list" }] } } },

          //Remove pipeline does not appear in request
        ].filter(Boolean)
      )
    )[0];

    return res.status(200).json(products);
  }),
  addProduct: asyncWrapper(async (req, res) => {
    const product = req.body,
      time = currentTime();

    // Create a new product using the create() method of the Products object
    const newProduct = await Products.create({
      ...product,
      createdAt: time,
      lastUpdateAt: time,
    });

    // Return the newly created product with a status of 201
    return res.status(201).json(newProduct);
  }),
  updateProduct: asyncWrapper(async (req, res) => {
    // Extract the id and the rest of the fields from the request body
    const { id } = req.body,
      time = currentTime();

    // Check if id is present in the request body
    !id && _throw(400, "ID is required");

    // Find the product with the given id
    const foundProduct = await Products.findByIdAndUpdate(
      id,
      { ...req.body, lastUpdateAt: time },
      { runValidators: true, new: true }
    );

    // If no product is found with the given id, return a 204 status code
    if (!foundProduct) return res.status(204).json(`There is no product match ID ${id}`);

    // Return the updated product with a status of 200
    return res.status(200).json(foundProduct);
  }),
  deleteProduct: asyncWrapper(async (req, res) => {
    // Extract the id from the request parameters
    const { id } = req.params;

    // Check if id is present in the request parameters
    !id && _throw(400, "ID Parameter is required");

    // Find and delete the product with the given id
    const deleteProduct = await Products.findByIdAndDelete(id);

    // If no product is found with the given id, return a 204 status code
    !deleteProduct
      ? res.status(204).json(`There is no product match ID ${id}`)
      : res.status(200).json(deleteProduct); // Return a success message with a status of 200
  }),
  getAProduct: asyncWrapper(async (req, res) => {
    // Extract the id from the request parameters
    const { id } = req.params;

    // Check if id is present in the request parameters
    !id && _throw(400, "ID Parameter is required");

    // Find the product with the given id
    const foundProduct = await Products.findById(id);

    // If no product is found with the given id, return a 204 status code
    !foundProduct ? _throw(404, `There is no product matched ID ${id}`) : res.status(200).json(foundProduct); // Return the found product with a status of 200
  }),
  test: async (req, res) => {
    try {
      const result = [];
      const productsList = await Products.find();
      for (const product of productsList) {
        const newAroma = product.aroma.map((str) => {
          str = str.toLowerCase().split(" ");
          for (var i = 0; i < str.length; i++) {
            str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
          }
          return str.join(" ");
        });
        product.aroma = newAroma;
        await product.save();
        result.push(newAroma);
      }
      return res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  },
};

export default productCRUD;

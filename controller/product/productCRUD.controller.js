import Products from "../../model/products.model.js";
import Pagination from "../../config/product/pagination.config.js";
import keyQuery from "../../config/product/keyQuery.config.js";
import _throw from "../throw.js";

const { limit } = Pagination;

const list = [
  {
    _id: "641bd4c8d9093b576f1bed23",
    name: "Le Labo Bergamote 22",
    image: [
      "https://bizweb.dktcdn.net/thumb/large/100/358/756/products/bergamote-22-50ml-1.jpg?v=1601309310163",
    ],
    aroma: ["Bergamot", "Vetiver", "Grapefruit"],
    price: [310],
    stock: [1000],
  },
  {
    _id: "641bd4c7d9093b576f1bed22",
    name: "Le Labo Rose 31",
    image: [
      "https://bizweb.dktcdn.net/thumb/large/100/358/756/products/rose-31-100ml-1.jpg?v=1601309273657",
    ],
    aroma: ["roses", "spicy cedar", "vetiver", "musks", "gaiac wood"],
    price: [310],
    stock: [725],
  },
  {
    _id: "641bd4c8d9093b576f1bed26",
    name: "Le Labo The Noir 29",
    image: [
      "https://bizweb.dktcdn.net/thumb/large/100/358/756/products/the-noir-29-50ml-1.jpg?v=1601309435733",
    ],
    aroma: ["Figs", "Cedarwood", "Vetiver"],
    price: [310],
    stock: [1000],
  },
  {
    _id: "641bd4c8d9093b576f1bed27",
    name: "Le Labo Lys 41",
    image: [
      "https://bizweb.dktcdn.net/thumb/large/100/358/756/products/lys-41-100ml-1.jpg?v=1601310097720",
    ],
    aroma: ["Lily", "Jasmine"],
    price: [310],
    stock: [1000],
  },
  {
    _id: "641bd4c8d9093b576f1bed28",
    name: "Le Labo Another 13",
    image: [
      "https://bizweb.dktcdn.net/thumb/large/100/358/756/products/another-13-50ml-1.jpg?v=1601309089300",
    ],
    aroma: ["Iso E Super", "Ambergris", "Musk"],
    price: [310],
    stock: [1000],
  },
  {
    _id: "641bd4c8d9093b576f1bed29",
    name: "Le Labo Santal 33",
    image: [
      "https://bizweb.dktcdn.net/thumb/large/100/358/756/products/santal-33-50ml-1.jpg?v=1601309032187",
    ],
    aroma: ["Sandalwood", "Papyrus", "Cedar"],
    price: [310],
    stock: [1000],
  },
  {
    _id: "641bd4c8d9093b576f1bed2a",
    name: "Le Labo Jasmin 17",
    image: [
      "https://bizweb.dktcdn.net/thumb/large/100/358/756/products/jasmin-17-50ml-1.jpg?v=1601310128507",
    ],
    aroma: ["Woody", "Floral", "Musk"],
    price: [310],
    stock: [1000],
  },
  {
    _id: "641bd4c8d9093b576f1bed2b",
    name: "Le Labo Tonka 25",
    image: [
      "https://bizweb.dktcdn.net/thumb/large/100/358/756/products/tonka-25-50ml-1.jpg?v=1601309345877",
    ],
    aroma: ["Woody", "Spicy"],
    price: [310],
    stock: [1000],
  },
  {
    _id: "641bd4c8d9093b576f1bed2c",
    name: "Le Labo Vetiver 46",
    image: [
      "https://bizweb.dktcdn.net/thumb/large/100/358/756/products/vetiver-46-50ml-1.jpg?v=1601310292373",
    ],
    aroma: ["musk"],
    price: [310],
    stock: [1000],
  },
  {
    _id: "641bd4c8d9093b576f1bed2d",
    name: "Le Labo Ylang 49",
    image: [
      "https://bizweb.dktcdn.net/thumb/large/100/358/756/products/ylang-49-100ml-1.jpg?v=1601309402747",
    ],
    aroma: ["Cyprus", "Flowers"],
    price: [310],
    stock: [1000],
  },
  {
    _id: "641bd4c8d9093b576f1bed2e",
    name: "Le Labo Iris 39",
    image: [
      "https://bizweb.dktcdn.net/thumb/large/100/358/756/products/iris-39-50ml-1.jpg?v=1601311355337",
    ],
    aroma: ["Cyprus", "Flowers"],
    price: [310],
    stock: [1000],
  },
  {
    _id: "641bd4c8d9093b576f1bed2f",
    name: "Le Labo Ambrette 9",
    image: [
      "https://bizweb.dktcdn.net/thumb/large/100/358/756/products/ambrette-9-50ml-1.jpg?v=1601310930883",
    ],
    aroma: ["Fragrant"],
    price: [310],
    stock: [1000],
  },
  {
    _id: "641bd4c8d9093b576f1bed24",
    name: "Le Labo Matcha 26",
    image: [
      "https://bizweb.dktcdn.net/thumb/large/100/358/756/products/the-matcha-26-100ml-1.jpg?v=1637744232973",
    ],
    aroma: ["Figs", "Vetiver", "Bitter Orange", "Green Tea"],
    price: [310],
    stock: [1000],
  },
  {
    _id: "641bd4c8d9093b576f1bed25",
    name: "Le Labo Baie 19",
    image: [
      "https://bizweb.dktcdn.net/thumb/large/100/358/756/products/baie-19-50ml-1.jpg?v=1601310351473",
    ],
    aroma: ["Patchouli", "Ozone", "Juniper Berries"],
    price: [310],
    stock: [1000],
  },
  {
    _id: "641bd4c8d9093b576f1bed32",
    name: "Kilian Good Girl Gone Bad Extreme",
    image: [
      "https://bizweb.dktcdn.net/thumb/large/100/358/756/products/good-girl-gone-bad-extreme-1.jpg?v=1659940807410",
    ],
    aroma: ["Floral", "Woody", "Musk"],
    price: [230],
    stock: [1000],
  },
  {
    _id: "641bd4c8d9093b576f1bed33",
    name: "Kilian Love, Don't Be Shy",
    image: [
      "https://bizweb.dktcdn.net/thumb/large/100/358/756/products/kl-sku-n3e601-833x968-0.jpg?v=1600316113277",
    ],
    aroma: ["Oriental", "Floral"],
    price: [325],
    stock: [1000],
  },
  {
    _id: "641bd4c8d9093b576f1bed34",
    name: "Kilian A Kiss From A Rose",
    image: [
      "https://bizweb.dktcdn.net/thumb/large/100/358/756/products/a-kiss-from-a-rose-1.jpg?v=1659941587317",
    ],
    aroma: ["Floral"],
    price: [285],
    stock: [1000],
  },
  {
    _id: "641bd4c8d9093b576f1bed35",
    name: "Kilian Angels Share",
    image: [
      "https://bizweb.dktcdn.net/thumb/large/100/358/756/products/angels-share-1.jpg?v=1630469476803",
    ],
    aroma: ["Oriental", "Cognac"],
    price: [230],
    stock: [725],
  },
  {
    _id: "641bd4c8d9093b576f1bed36",
    name: "Kilian Apple Brandy On The Rocks",
    image: [
      "https://bizweb.dktcdn.net/thumb/large/100/358/756/products/apple-brandy-on-the-rocks-1.jpg?v=1641020482790",
    ],
    aroma: ["Oriental"],
    price: [230],
    stock: [1000],
  },
  {
    _id: "641bd4c8d9093b576f1bed37",
    name: "Kilian Vodka On The Rocks",
    image: [
      "https://bizweb.dktcdn.net/thumb/large/100/358/756/products/kl-sku-n3cy01-833x968-0.jpg?v=1600316637350",
    ],
    aroma: ["Oriental"],
    price: [275],
    stock: [1000],
  },
  {
    _id: "641bd4c8d9093b576f1bed39",
    name: "Kilian Moonlight In Heaven",
    image: [
      "https://bizweb.dktcdn.net/thumb/large/100/358/756/products/moonlight-in-heaven-1.jpg?v=1633420915687",
    ],
    aroma: ["Fragrant"],
    price: [275],
    stock: [1000],
  },
  {
    _id: "641bd4c8d9093b576f1bed38",
    name: "Kilian Rolling In Love",
    image: [
      "https://bizweb.dktcdn.net/thumb/large/100/358/756/products/kl-sku-n3ex01-833x968-0-2.jpg?v=1600318369307",
    ],
    aroma: ["Oriental", "Floral"],
    price: [210],
    stock: [1000],
  },
  {
    _id: "641bd4c8d9093b576f1bed3a",
    name: "Kilian Straight To Heaven",
    image: [
      "https://bizweb.dktcdn.net/thumb/large/100/358/756/products/kl-sku-n3eg01-833x968-0-2.jpg?v=1600254759390",
    ],
    aroma: ["Woody", "Spicy"],
    price: [275],
    stock: [1000],
  },
  {
    _id: "641bd4c8d9093b576f1bed3b",
    name: "Kilian Flower Of Immortality",
    image: [
      "https://bizweb.dktcdn.net/thumb/large/100/358/756/products/flower-of-immortality-1.jpg?v=1623308350793",
    ],
    aroma: ["Fragrant"],
    price: [275],
    stock: [1000],
  },
  {
    _id: "641bd4c8d9093b576f1bed3c",
    name: "Kilian Sacred Wood",
    image: [
      "https://bizweb.dktcdn.net/thumb/large/100/358/756/products/sacred-wood-1.jpg?v=1645421207663",
    ],
    aroma: ["Oriental"],
    price: [275],
    stock: [1000],
  },
  {
    _id: "641bd4c8d9093b576f1bed3d",
    name: "Kilian Musk Oud",
    image: [
      "https://bizweb.dktcdn.net/thumb/large/100/358/756/products/musk-oud-1.jpg?v=1659946226787",
    ],
    aroma: ["Woody Notes", "Musk"],
    price: [410],
    stock: [1000],
  },
  {
    _id: "641bd4c8d9093b576f1bed3f",
    name: "Kilian Black Phantom",
    image: [
      "https://bizweb.dktcdn.net/thumb/large/100/358/756/products/kl-sku-n3eh01-833x968-0-2-326e9368-b322-457e-bec5-5ee62002cfed.jpg?v=1600316821387",
    ],
    aroma: ["Oriental"],
    price: [275],
    stock: [1000],
  },
  {
    _id: "641bd4c8d9093b576f1bed3e",
    name: "Kilian Woman In Gold",
    image: [
      "https://bizweb.dktcdn.net/thumb/large/100/358/756/products/kl-sku-n3e501-833x968-0-2.jpg?v=1600316482730",
    ],
    aroma: ["Floral"],
    price: [225],
    stock: [1000],
  },
  {
    _id: "641bd4c8d9093b576f1bed40",
    name: "Kilian Intoxicated",
    image: [
      "https://bizweb.dktcdn.net/thumb/large/100/358/756/products/intoxicated.jpg?v=1600253665213",
    ],
    aroma: ["Oriental"],
    price: [275],
    stock: [1000],
  },
  {
    _id: "641bd4c8d9093b576f1bed31",
    name: "Le Labo  Neroli 36",
    image: [
      "https://bizweb.dktcdn.net/thumb/large/100/358/756/products/neroli-36-100ml-1.jpg?v=1601310259160",
    ],
    aroma: ["Amber", "Floral"],
    price: [310],
    stock: [1000],
  },
  {
    _id: "641bd4c8d9093b576f1bed30",
    name: "Le Labo Fleur d’Oranger 27",
    image: [
      "https://bizweb.dktcdn.net/thumb/large/100/358/756/products/fleur-27-50ml-1.jpg?v=1601310325573",
    ],
    aroma: ["Floral"],
    price: [310],
    stock: [1000],
  },
];

const productCRUD = {
  getAllProduct: async (req, res) => {
    try {
      const productsList = await Products.find({}, keyQuery.getList.join(" "));
      if (!productsList || productsList.length === 0) {
        return res.status(204).json({ msg: "No product found" });
      }
      res.json({
        total: productsList.length,
        limit: limit,
        list: productsList,
      });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ msg: "An error occurred while retrieving products" });
    }
  },
  addProduct: async (req, res) => {
    try {
      const product = req.body;

      //Check if body is not object, in case it is an object, whether it is an array or not
      (typeof product !== "object" || Array.isArray(product)) &&
        _throw(400, "Invalid input body");

      // Check if all fields are required
      Object.values(product).every((ele) => {
        (typeof ele === "object"
          ? Object.keys(ele).length === 0
          : ele.toString().length === 0) &&
          _throw(400, "All fields are required");
      });

      // Create a new product using the create() method of the Products object
      const newProduct = await Products.create(product);

      // Return the newly created product with a status of 201
      res.status(201).json(newProduct);
    } catch (err) {
      console.log(err);
      return res
        .status(err.status || 500)
        .json({ msg: err.msg || "Error occurred while adding" });
    }
  },
  updateProduct: async (req, res) => {
    try {
      // Extract the id and the rest of the fields from the request body
      const { id, ...rest } = req.body;

      //Check if the rest is not object, in case it is an object, whether it is an array or not
      (typeof rest !== "object" || Array.isArray(rest)) &&
        _throw(400, "Invalid input body");

      // Check if id is present in the request body
      !id && _throw(400, "ID is required");

      // Find the product with the given id
      const foundProduct = await Products.findById(id);

      // If no product is found with the given id, return a 204 status code
      if (!foundProduct)
        return res
          .status(204)
          .json({ msg: `There is no product match ID ${id}` });

      // Update the fields of the found product with the fields from the request body
      Object.keys(rest).forEach((key) => {
        if (
          (typeof rest[key] === "object" &&
            Object.keys(rest[key]).length > 0) ||
          (typeof rest[key] !== "object" && rest[key].length > 0)
        )
          foundProduct[key] = rest[key];
      });

      // Save the updated product to the database
      await foundProduct.save();

      // Return the updated product with a status of 200
      res.status(200).json(foundProduct);
    } catch (err) {
      console.log(err);
      return res
        .status(err.status || 500)
        .json({ msg: err.msg || "Error occurred while updating" });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      // Extract the id from the request parameters
      const { id } = req.params;

      // Check if id is present in the request parameters
      !id && _throw(400, "ID Parameter is required");

      // Find and delete the product with the given id
      const deleteProduct = await Products.findByIdAndDelete(id);

      // If no product is found with the given id, return a 204 status code
      !deleteProduct
        ? res.status(204).json({ msg: `There is no product match ID ${id}` })
        : res.status(200).json({ msg: `Product ID ${id} has been deleted` }); // Return a success message with a status of 200
    } catch (err) {
      return res
        .status(err.status || 500)
        .json({ msg: err.msg || "Error occurred while deleting" });
    }
  },
  getAProduct: async (req, res) => {
    try {
      // Extract the id from the request parameters
      const { id } = req.params;

      // Check if id is present in the request parameters
      !id && _throw(400, "ID Parameter is required");

      // Find the product with the given id
      const foundProduct = await Products.findById(id);

      // If no product is found with the given id, return a 204 status code
      !foundProduct
        ? res.status(204).json({ msg: `There is no product matched ID ${id}` })
        : res.status(200).json(foundProduct); // Return the found product with a status of 200
    } catch (err) {
      return res
        .status(err.status || 500)
        .json({ msg: err.msg || "Error occurred while getting" });
    }
  },
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

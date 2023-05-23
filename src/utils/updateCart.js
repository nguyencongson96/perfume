import Products from "#root/model/products.model.js";
import _throw from "#root/utils/throw.js";

export default async function updateCart(newStatus, newCart) {
  let resultCart = [],
    total = 0,
    totalItem = 0;
  for (const { productId, quantity, capacity } of newCart) {
    //Find product
    const foundProduct = await Products.findById(productId);
    !foundProduct && _throw(400, `No product matches id ${productId}`);

    //Find position of capacity in array
    const capacityIndex = foundProduct.capacity.findIndex((ele) => ele === capacity);
    capacityIndex < 0 && _throw(400, `Invalid capacity`);

    //Update price
    const price = foundProduct.price[capacityIndex];
    const image = foundProduct.image;
    const name = foundProduct.name;

    //Update stock
    let stock = foundProduct.stock[capacityIndex];

    //Throw error if stock does not have enough product for the order
    stock < quantity && _throw(400, `Not enough stock of ${foundProduct.name}`);
    //If status is not pending then minus quantity in stock
    if (newStatus !== "Pending") {
      stock -= quantity;
      await foundProduct.save();
    }

    //Push product to order, calculate total price of order, and only minus stock if status is no longer Pending
    resultCart.push({ productId, quantity, capacity, price, name, image });
    total += quantity * price;
    totalItem += quantity;
  }
  return { total: total, cart: { totalItem, detail: resultCart } };
}

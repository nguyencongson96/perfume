import React, { useContext, useCallback } from "react";
import { Admin } from "../../Context/Admin";

const ProductElement = (props) => {
  const { id, name, image, price } = props;
  const {
    token,
    productList,
    setProductList,
    setShowForm,
    checkTokenExist,
    setFormAction,
    setProductId,
  } = useContext(Admin);

  //Find the highest price in array, format and choose that value to show in screen
  const maxPrice = Math.max(...price);
  const formatMaxPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(maxPrice);

  // Handle delete function
  const handleDelete = useCallback(async () => {
    console.log("Deleting...");
    const deleteData = await fetch(
      `https://perfume-backend.onrender.com/edit/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
        body: JSON.stringify({ id: id }),
      }
    );
    await deleteData.json();
    const newList = productList.filter((ele) => ele._id !== id);
    setProductList(newList);
  }, [id, productList, setProductList, token]);

  return (
    <div className="product">
      <div className="img">
        <img src={image[0]} alt={name} />
        {checkTokenExist() && (
          <div className="feature">
            <div className="see-picture">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                <path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z" />
              </svg>
            </div>
            <div
              className="edit"
              onClick={() => {
                setShowForm(true);
                setFormAction("update");
                setProductId(id);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
              </svg>
            </div>
            <div className="delete" onClick={handleDelete}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
              </svg>
            </div>
          </div>
        )}
      </div>
      <div className="name">{name}</div>
      <div className="price">{formatMaxPrice}</div>
    </div>
  );
};

export default ProductElement;

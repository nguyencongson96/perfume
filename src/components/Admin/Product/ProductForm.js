import React, { useContext, useState, useEffect } from "react";
import { Admin } from "../../Context/Admin";
import "./ProductForm.css";

const ProductForm = (props) => {
  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setShowForm(false);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const { action } = props;
  const { token, setProductList, productList, setShowForm, productId } =
    useContext(Admin);
  const isActionAdd = action === "add";

  const initialInfo = isActionAdd
    ? {
        name: "",
        brand: "",
        image: [],
        aroma: [],
        type: [],
        capacity: [],
        price: [],
        stock: 0,
        description: "",
      }
    : productList.find((item) => item._id === productId);

  const [productInfo, setProductInfo] = useState(initialInfo);

  const handleAdd = async (event) => {
    event.preventDefault();
    console.log("Adding...");
    const postData = await fetch("https://perfume-backend.onrender.com/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      body: JSON.stringify(productInfo),
    });
    const newProduct = await postData.json();
    setProductList([...productList, newProduct]);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    console.log("Updating...");
    setProductList([]);

    const patchData = await fetch("https://perfume-backend.onrender.com/edit", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      body: JSON.stringify({ ...productInfo, id: productId }),
    });
    await patchData.json();
    setShowForm(false);
  };

  return (
    <div className="detail-product">
      <h1 className="header">
        {isActionAdd ? "Add Product" : productInfo.name}
      </h1>
      <div
        className="close-btn"
        onClick={() => {
          setShowForm(false);
        }}
      >
        x
      </div>
      <form className="product-info">
        <div className="name-input">
          <label htmlFor="name">Name: </label>
          <input
            id="name"
            type="text"
            value={productInfo.name}
            onChange={(e) => {
              setProductInfo({ ...productInfo, name: e.target.value });
            }}
          />
        </div>
        <div className="brand-input">
          <label htmlFor="brand">Brand: </label>
          <input
            id="brand"
            type="text"
            value={productInfo.brand}
            onChange={(e) => {
              setProductInfo({ ...productInfo, brand: e.target.value });
            }}
          />
        </div>
        <div className="image-input">
          <label htmlFor="image">Image: </label>
          <input
            id="image"
            type="text"
            value={productInfo.image.join(", ")}
            onChange={(e) => {
              setProductInfo({
                ...productInfo,
                image: e.target.value.split(", "),
              });
            }}
          />
        </div>
        <div className="aroma-input">
          <label htmlFor="aroma">Aroma: </label>
          <input
            id="aroma"
            type="text"
            value={productInfo.aroma.join(", ")}
            onChange={(e) => {
              setProductInfo({
                ...productInfo,
                aroma: e.target.value.split(", "),
              });
            }}
          />
        </div>
        <div className="type-input">
          <label htmlFor="type">Type: </label>
          <input
            id="type"
            type="text"
            value={productInfo.type.join(", ")}
            onChange={(e) => {
              setProductInfo({
                ...productInfo,
                type: e.target.value.split(", "),
              });
            }}
          />
        </div>
        <div className="capacity-input">
          <label htmlFor="capacity">Capacity: </label>
          <input
            id="capacity"
            type="text"
            value={productInfo.capacity.join(", ")}
            onChange={(e) => {
              setProductInfo({
                ...productInfo,
                capacity: e.target.value.split(", "),
              });
            }}
          />
        </div>
        <div className="price-input">
          <label htmlFor="price">Price: </label>
          <input
            id="price"
            type="text"
            value={productInfo.price.join(", ")}
            onChange={(e) => {
              setProductInfo({
                ...productInfo,
                price: e.target.value.split(", "),
              });
            }}
          />
        </div>
        <div className="stock-input">
          <label htmlFor="stock">Stock: </label>
          <input
            id="name"
            type="number"
            value={productInfo.stock}
            onChange={(e) => {
              setProductInfo({ ...productInfo, stock: e.target.value });
            }}
          />
        </div>
        <div className="des-input">
          <label htmlFor="des">Desciption: </label>
          <textarea
            id="des"
            rows="7"
            cols="100"
            value={productInfo.description}
            onChange={(e) => {
              setProductInfo({ ...productInfo, description: e.target.value });
            }}
          />
        </div>
        <button
          className="submit"
          onClick={(e) => {
            isActionAdd ? handleAdd(e) : handleUpdate(e);
          }}
        >
          {isActionAdd ? "Add" : "Update"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;

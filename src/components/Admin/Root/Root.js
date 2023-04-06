import React, { useEffect, useContext } from "react";
import ProductElement from "./ProductElement";
import ProductForm from "../Product/ProductForm";
import { Admin } from "../../Context/Admin";
import "./Root.css";

const Root = () => {
  const {
    productList,
    setProductList,
    checkTokenExist,
    showForm,
    setShowForm,
    formAction,
    setFormAction,
  } = useContext(Admin);
  // console.log(productList);

  //Handle calling API when access this component
  useEffect(() => {
    async function fetchData() {
      try {
        console.log("Fetching...");
        const res = await fetch("https://perfume-backend.onrender.com/edit", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.status < 400) {
          const data = (await res.json()).list;
          //Update productList only if it is different from the data received
          JSON.stringify(productList) !== JSON.stringify(data) &&
            setProductList(data);
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  const handleSort = async (e) => {
    try {
      console.log("Sorting...");
      const value = e.target.value;
      const sort =
        value === "a-z"
          ? "nac"
          : value === "z-a"
          ? "ndc"
          : value === "low-high"
          ? "pac"
          : value === "high-low"
          ? "pdc"
          : "";
      const res = await fetch(
        `https://perfume-backend.onrender.com/products?sort=${sort}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status < 400) {
        const data = (await res.json()).list;
        //Update productList only if it is different from the data received
        JSON.stringify(productList) !== JSON.stringify(data) &&
          setProductList(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //Render depending on API
  const productElement = productList.map((ele, index) => (
    <ProductElement
      key={index}
      id={ele._id}
      name={ele.name}
      image={ele.image}
      price={ele.price}
    />
  ));

  return (
    <div className="root">
      {checkTokenExist() && (
        <div
          className="add"
          onClick={() => {
            setShowForm(!showForm);
            setFormAction("add");
          }}
        >
          <span className="icon">+</span>
          <span className="des">Add Product</span>
        </div>
      )}
      <select className="sort" name="sort-product" onChange={handleSort}>
        <option value="Sorting" hidden>
          Sorting
        </option>
        <option value="a-z">A-Z</option>
        <option value="z-a">Z-A</option>
        <option value="low-high">Lowest price - Highest Price</option>
        <option value="high-low">Highest Price - Lowest Price</option>
      </select>
      <div className="all-product">
        {productList.length !== 0 && (
          <div className="total">Total: {productList.length}</div>
        )}
        <div className="list-product">{productElement}</div>
      </div>
      {showForm && <ProductForm action={formAction} />}
    </div>
  );
};

export default Root;

import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ProductList.module.scss";

import Sidebar from "../../../components/DefaultLayouts/Sidebar";
import Pagination from "../../../components/DefaultLayouts/Pagination";
import productAPI from "../../../services/productAPI.js";
import ProductItem from "./ProductItem";
import { useParams, useSearchParams } from "react-router-dom";

const cx = classNames.bind(styles);

const ProductsList = () => {
  const [productList, setProductList] = useState([]);
  const [amountOfPage, setAmountOfPage] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();

  let activePage = Number(searchParams.get("page"));
  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const newParams = {
          ...params,
          page: activePage || 1,
        };
        const response = await productAPI.filter(params);
        const newResponse = await productAPI.filter(newParams);

        setAmountOfPage(Math.ceil(response.total / 9));
        setProductList(newResponse.list);
      } catch (error) {
        console.log(error);
        throw new Error("Invalid Data");
      }
    };
    fetchAPI();
  }, [activePage, params]);

  return (
    <div className={cx("wrapper")}>
      <h1 className={cx("title")}>
        {params.type === "men"
          ? "Men's Fragrance"
          : params.type === "women"
          ? "Women's Fragrance"
          : "Unisex's Fragrance"}
      </h1>
      <div className={cx("container")}>
        <Sidebar />
        <div className={cx("content")}>
          <div className={cx("list-product")}>
            {productList.map((item, index) => {
              return <ProductItem key={index} data={item} />;
            })}
          </div>
          {amountOfPage > 1 && (
            <Pagination
              amountOfPage={amountOfPage}
              className={cx("pagination")}
              activePage={activePage || 1}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsList;

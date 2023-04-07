import classNames from "classnames/bind";
import styles from "./ProductDetail.module.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Image from "../../../components/DefaultLayouts/Image";
import productAPI from "../../../services/productAPI";
import Carousel from "../../../components/DefaultLayouts/Carousel/Carousel";

const cx = classNames.bind(styles);
const ProductDetail = () => {
  const [productInfo, setProductInfo] = useState({});
  const [productCapacity, setProductCapacity] = useState(
    productInfo.capacity ?? []
  );
  const [aroma, setAroma] = useState(productInfo.aroma ?? []);
  const [capacitySelected, setCapacitySelected] = useState("");
  const [inputValue, setInputValue] = useState("");

  // Get API Product
  const param = useParams();
  useEffect(() => {
    const fetchAPI = async (id) => {
      try {
        const response = await productAPI.get(id);
        setProductInfo(response);
        setProductCapacity(response.capacity);
        setAroma(response.aroma);
      } catch (error) {
        throw new Error("Invalid Data");
      }
    };
    fetchAPI(param.id);
  }, [param]);

  // Change Selected capacity
  const handleSelected = (item) => {
    setCapacitySelected((prev) => (prev === item ? "" : item));
  };
  //Handle input value
  const handleChange = (e) => {
    e.target.value < 10 ? setInputValue(e.target.value) : setInputValue("");
  };
  return (
    <div className={cx("wrapper")}>
      <div className={cx("main-info")}>
        <div className={cx("caroseul")}>
          <Image
            src={productInfo.image}
            alt={productInfo.name}
            className={cx("prd-detail-img")}
          />
          <Image
            src={productInfo.image}
            alt={productInfo.name}
            className={cx("prd-detail-img")}
          />
        </div>

        <div className={cx("product-info")}>
          {/* Name & Price */}

          <div className={cx("name-and-price")}>
            <h1 className={cx("prd-name")}>{productInfo.name}</h1>
            <div className={cx("prd-price")}>{`$${productInfo.price}`}</div>
          </div>
          {/* Aroma */}
          <div className={cx("prd-aroma")}>
            <div className={cx("title")}>Aroma</div>
            <div className={cx("list-aroma")}>
              {aroma.map((item, index) => {
                return (
                  <span key={index} className={cx("aroma-item")}>
                    {item}
                  </span>
                );
              })}
            </div>
          </div>
          {/* Capacity & Stock */}
          <div className={cx("capacity-and-stock")}>
            <div className={cx("prd-capacity")}>
              <div className={cx("title")}>
                <span className={cx("title-item")}>
                  {capacitySelected == "" ? "Select Size" : "Capacity"}
                </span>
                <span>
                  {capacitySelected == "" ? "" : `${capacitySelected}ml`}
                </span>
              </div>
              <div className={cx("btn-select")}>
                {productCapacity.map((item, index) => {
                  return (
                    <div
                      className={cx(
                        "item-select",
                        capacitySelected === item ? "selected" : ""
                      )}
                      key={index}
                      onClick={() => handleSelected(item)}
                    >{`${item}ml`}</div>
                  );
                })}
              </div>
            </div>
            <div
              className={cx(
                "prd-stock",
                productInfo.stock < 0 ? "soldout" : ""
              )}
            >
              {productInfo.stock > 0 ? "Available" : "Out of Stock"}
            </div>
          </div>
          {/* Input Qty & Cart */}
          <div className={cx("qty-and-cart")}>
            <input
              className={cx("prd-quantity")}
              type="number"
              placeholder="Qty"
              value={capacitySelected === "" ? "" : inputValue}
              onChange={handleChange}
              disabled={capacitySelected === ""}
            />
            <div className={cx("prd-cart")}>
              <span>Add to Cart</span>
              <span className={cx("total")}>
                {inputValue === "" || inputValue < 1 || capacitySelected === ""
                  ? ""
                  : `- $${Number(inputValue) * productInfo.price}`}
              </span>
            </div>
          </div>
          <div className={cx("prd-shipping")}>
            Free Standard Shipping on $75+
          </div>
        </div>
      </div>

      {/* description */}

      <div className={cx("prd-des")}>
        <div className={cx("prd-des-title")}>About The Product</div>
        <div className={cx("prd-des-detail")}>
          <h2 className={cx("prd-name")}>{productInfo.name}</h2>
          <div className={cx("marketing-copy")}>{productInfo.description}</div>
          <div className={cx("sub-des")}>
            <div className={cx("sub-item")}>
              <div className={cx("title")}>Products Detail</div>
              <div className={cx("content")}>
                <div>- Product's Name: {productInfo.name}.</div>
                <div>- Brand: {productInfo.brand}.</div>
                <div>
                  - Aroma:{" "}
                  {productInfo.aroma && productInfo.aroma.length > 1
                    ? productInfo.aroma.join(", ")
                    : productInfo.aroma}
                  .
                </div>
                <div>- Manufacturing Year: 2023.</div>
              </div>
            </div>
            <div className={cx("sub-item")}>
              <div className={cx("title")}>Shipping and Returns</div>
              <div className={cx("content")}>
                <div>
                  - A flat rate cost of $4.95 USD will be deducted from your
                  refund for returns.
                </div>
                <div>
                  - Returns accepted by mail and in store within 45 days of the
                  shipment date.
                </div>
                <div>- Items must be unworn and tags must be attached.</div>
                <div>
                  - Once a return is received, please allow 7-14 business days
                  to process and 3-5 business days for the refund to be credited
                  to the payment method used at the time of purchase.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

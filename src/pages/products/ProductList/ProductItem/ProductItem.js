import classNames from "classnames/bind";
import styles from "./ProductItem.module.scss";
import Image from "../../../../components/DefaultLayouts/Image";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);
const ProductItem = ({ data }) => {
  return (
    <Link to={`${data._id}`} className={cx("wrapper")}>
      <Image src={data.image} className={cx("product-img")} />
      <div className={cx("product-info")}>
        <div className={cx("product-name")}>{data.name}</div>
        <div className={cx("product-price")}>{`$${data.price}`}</div>
        <div className={cx("product-stock", data.stock <= 0 ? "disable" : "")}>
          {data.stock > 0 ? "Availble" : "Out Of Stock"}
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;

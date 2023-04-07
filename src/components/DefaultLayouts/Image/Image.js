import classNames from "classnames/bind";
import styles from "./Image.module.scss";

const cx = classNames.bind(styles);

const Image = ({ src, className, alt }) => {
  return <img src={src} className={cx(className)} alt={alt} />;
};

export default Image;

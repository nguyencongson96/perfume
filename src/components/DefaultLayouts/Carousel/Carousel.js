import classNames from "classnames/bind";
import styles from "./Carousel.module.scss";

import "./Carousel.module.scss";
import Image from "../Image/Image";
import CarouselImg from "../../../assets/images/CarouselImg/CarouselImg";

const cx = classNames.bind(styles);
const Carousel = ({ className }) => {
  return <div className={className}></div>;
};

export default Carousel;

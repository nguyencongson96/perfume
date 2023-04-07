import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import styles from "./Pagination.module.scss";

const cx = classNames.bind(styles);
const Pagination = ({ amountOfPage, className, activePage }) => {
  let listPage = [];
  const page = (pageNumber = 1) => {
    if (pageNumber <= amountOfPage && amountOfPage > 0) {
      listPage.push(pageNumber);
      pageNumber++;
      return page(pageNumber);
    } else {
      return "";
    }
  };
  page();
  return (
    <div className={cx("wrapper", className)}>
      {listPage.map((item, index) => {
        return (
          <Link
            to={`?page=${item}`}
            key={index}
            className={cx("page-number", activePage === item ? "active" : "")}
          >
            {item}
          </Link>
        );
      })}
    </div>
  );
};
export default Pagination;

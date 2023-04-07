import classNames from "classnames/bind";
import styles from "./Sidebar.module.scss";
import { useEffect, useState } from "react";
import { Menu } from "antd";
import productAPI from "../../../services/productAPI";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

function getItem(label, key, children) {
  return {
    key,
    children,
    label,
  };
}

const params = ["aroma", "brand", "type"];
const Sidebar = () => {
  const [current, setCurrent] = useState([]);
  const [currentKeyPath, setCurrentKeyPath] = useState([]);
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const response = await productAPI.getDataSidebar(params);
        let items = [
          getItem("Sort by", "sortby", [
            getItem("A -> Z", "AZ", ""),
            getItem("Z -> A", "ZA", ""),
            getItem("Price Low To High", "LH", ""),
            getItem("Price High To Low", "HL", ""),
          ]),
          getItem(
            "Aroma",
            params[0],
            response.aroma.map((item) => getItem(item, item, ""))
          ),
          getItem(
            "Brand",
            params[1],
            response.brand.map((item) => getItem(item, item, ""))
          ),
          getItem(
            "Type",
            params[2],
            response.type.map((item) => getItem(item, item, ""))
          ),
          getItem("Price", "price", [
            getItem("100$ - 300$", "price1", ""),
            getItem("300$ - 500$", "price2", ""),
            getItem("Higher Than 500$", "price3", ""),
          ]),
          getItem("Stock", "stock", [getItem("Available", "available", "")]),
        ];
        setList(items);
      } catch (error) {
        throw new Error("Invalid Data");
      }
    };
    fetchAPI();
  }, []);

  const onClick = (e) => {
    console.log("click", e.keyPath);
    const parentKey = e.keyPath[1];
    console.log(parentKey);
    switch (parentKey) {
      case "sortby":
      case "brand":
      case "type":
      case "stock":
        console.log(parentKey, "Only 1 value");
        if (
          // if currentKeyPath include e.keyPath, take it out of the arr
          JSON.stringify(currentKeyPath).includes(JSON.stringify(e.keyPath))
        ) {
          const newCurrentKeyPath = currentKeyPath.filter(
            (item) => JSON.stringify(item) !== JSON.stringify(e.keyPath)
          );
          setCurrentKeyPath(newCurrentKeyPath);
          setCurrent(current.filter((item) => item !== e.key));
        } else {
          // if state currentKeyPath doesn't has e.keyPath, but parentKey existed, replace that item by new keyPath
          if (currentKeyPath.some((item) => item.includes(parentKey))) {
            const newCurrentKeyPath = currentKeyPath.filter(
              (item) => !item.includes(parentKey)
            );
            const newCurrent = newCurrentKeyPath.map((item) => item[0]);
            setCurrentKeyPath([...newCurrentKeyPath, e.keyPath]);
            setCurrent([...newCurrent, e.key]);
          } else {
            setCurrentKeyPath((prev) => [...prev, e.keyPath]);
            setCurrent((prev) => [...prev, e.key]);
          }
        }
        break;

      default:
        console.log(parentKey, "Many value");
        if (current.includes(e.key)) {
          const newCurrentKeyPath = currentKeyPath.filter((item) =>
            item.includes(e.key)
          );
          setCurrentKeyPath(newCurrentKeyPath);
          setCurrent(current.filter((item) => item !== e.key));
        } else {
          setCurrentKeyPath((prev) => [...prev, e.keyPath]);
          setCurrent((prev) => [...prev, e.key]);
        }
    }
  };
  console.log("----------------");
  console.log("current", current);
  console.log("currentKeyPath", currentKeyPath);
  return (
    <div className={cx("wrapper")}>
      <Menu
        onClick={onClick}
        selectedKeys={current}
        mode="inline"
        defaultOpenKeys={[]}
        style={{
          flex: 1,
          fontSize: "1.5rem",
          padding: "12px 16px 0",
        }}
        items={list}
        className={cx("menu")}
      />
      <Link to={`/men`} className={cx("btn-filter")}>
        Filter <FontAwesomeIcon icon={faFilter} style={{ marginLeft: "8px" }} />
      </Link>
    </div>
  );
};

export default Sidebar;

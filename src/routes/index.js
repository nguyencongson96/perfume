import ProductList from "../pages/products/ProductList";
import ProductDetail from "../pages/products/ProductDetail";

export const publicRoutes = [
  { path: "/:type", component: ProductList },
  { path: "/:type?:param", component: ProductList },
  { path: "/:type/:id", component: ProductDetail },
];

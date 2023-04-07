import axiosClient from "../utils/axiosClient";

const productAPI = {
  get: (id) => {
    const url = `edit/${id}`;
    return axiosClient.get(url);
  },
  filter: (params) => {
    const url = "products";
    return axiosClient.get(url, { params });
  },
  getDataSidebar: (params) => {
    const url = `products/distinct/${params[0]}-${params[1]}-${params[2]}`;
    return axiosClient.get(url);
  },
};

export default productAPI;

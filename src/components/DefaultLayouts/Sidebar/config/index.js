// // import productAPI from "../../../../services/productAPI";

// import { useEffect, useState } from "react";
// import productAPI from "../../../../services/productAPI";

// // export const SIDEBAR_STRUCTURE = [
// //   {
// //     title: "Sort by",
// //     children: [
// //       {
// //         title: "A -> Z",
// //         isActive: false,
// //       },
// //       {
// //         title: "Z -> A",
// //         isActive: false,
// //       },
// //       {
// //         title: "Price Low To High",
// //         isActive: false,
// //       },
// //       {
// //         title: "Price High To Low",
// //         isActive: false,
// //       },
// //     ],
// //   },
// //   {
// //     title: "Aroma",
// //     children: [
// //       { title: "Floral", isActive: false },
// //       { title: "Bergamot", isActive: false },
// //     ],
// //   },
// //   {
// //     title: "Brand",
// //     children: [
// //       { title: "Killian", isActive: false },
// //       { title: "Le Labo", isActive: false },
// //       { title: "Byredo", isActive: false },
// //     ],
// //   },
// //   {
// //     title: "Type",
// //     children: [
// //       { title: "Male", isActive: false },
// //       { title: "Female", isActive: false },
// //       { title: "Unisex", isActive: false },
// //     ],
// //   },
// //   {
// //     title: "Price",
// //     children: [
// //       { title: "100$ - 300$", isActive: false },
// //       { title: "301$ - 500$", isActive: false },
// //       { title: "Higher Than 500$", isActive: false },
// //     ],
// //   },
// //   {
// //     title: "Stock",
// //     children: [{ title: "Available", isActive: false }],
// //   },
// // ];
// const dataSidebar = (params) => {
//   function getItem(label, key, children) {
//     return {
//       key,
//       children,
//       label,
//     };
//   }
//   function fetchAPI(params) {
//     const response = productAPI.getDataSidebar(params);
//     return response;
//   }
//   // const fetchAPI = async (params) => {
//   //   try {
//   //     const response = await productAPI.getDataSidebar(params);
//   //     listSidebar = { ...response };
//   //     console.log(listSidebar);
//   //   } catch (error) {
//   //     throw new Error("Invalid Data");
//   //   }
//   // };
//   return [
//     getItem("Sort by", "Sort by", [
//       getItem("A -> Z", "A -> Z", ""),
//       getItem("Z -> A", "Z -> A", ""),
//       getItem("Price Low To High", "L -> H", ""),
//       getItem("Price High To Low", "H -> L", ""),
//     ]),
//     getItem(
//       "Aroma",
//       params[0],
//       listSidebar.params[0].map((item) => getItem(item, item, ""))
//     ),
//     getItem(
//       "Brand",
//       params[1],
//       listSidebar.params[1].map((item) => getItem(item, item, ""))
//     ),
//     getItem(
//       "Type",
//       params[2],
//       listSidebar.params[2].map((item) => getItem(item, item, ""))
//     ),
//     getItem("Price", "Price", [
//       getItem("100$ - 300$", "Price1", ""),
//       getItem("300$ - 500$", "Price2", ""),
//       getItem("Higher Than 500$", "Price3", ""),
//     ]),
//     getItem("Stock", "Stock", [getItem("Available", "Available", "")]),
//   ];
// };

// export default dataSidebar;

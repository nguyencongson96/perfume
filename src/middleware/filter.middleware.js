import _throw from "#root/utils/throw.js";
import keyQuery from "#root/config/product/keyQuery.config.js";
import sortConfig from "#root/config/product/sortStyle.config.js";

const filterCheck = (req, res, next) => {
  const query = req.query,
    keyArr = Object.keys(query);

  //Check whether req.query has any key-value pairs or not
  keyArr.length === 0 && _throw(400, "Query Params is required");

  //Check whether query has any key match allowKey array, if not send status 400
  !keyArr.every((val) => keyQuery.filter.some((key) => val.includes(key))) &&
    _throw(400, "Invalid key Query");

  //Check sort value
  query.sort && !Object.values(sortConfig).includes(query.sort) && _throw(400, "Invalid sort Query");

  //Check slice value
  query.page && (!Number(query.page) || query.page < 1) && _throw(400, "Invalid page Query");

  next();
};

export default filterCheck;
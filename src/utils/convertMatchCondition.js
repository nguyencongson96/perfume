import keyQuery from "#root/config/keyQuery.config.js";

export default function convertMatchCondition(type, query) {
  //Function convert value of each item of query to the format of MongoDB filter
  function convert(type, obj) {
    //Get key, value from obj
    const [key, arr] = Object.entries(obj)[0];

    return arr.map((item, index) => ({
      [key]:
        // If key is numberCompare
        keyQuery[type].numberCompare.includes(key)
          ? arr.length === 2
            ? //If value is an array with 2 item then first item is greater than ,second item is lower than
              { [index === 0 ? "$gte" : "$lte"]: Number(item) }
            : //If value is only one item then item is equal to
              { $eq: Number(item) }
          : //If key is includeCompare
          keyQuery[type].includeCompare.includes(key)
          ? //Find include
            new RegExp(item, "i")
          : //Find equal
            new RegExp(`^${item}$`, "i"),
    }));
  }

  const result = Object.entries(query).reduce(
    (obj, [key, value]) => {
      !keyQuery.uncompare.includes(key) &&
        //If value contain letter - meaning and operator
        (value.includes("-")
          ? obj.$and.push(...convert(type, { [key]: value.split("-") }))
          : //If value contain letter . meaning or operator
          value.includes(".")
          ? obj.$or.push(...convert(type, { [key]: value.split(".") }))
          : //Else push directly to result
            (obj = { ...obj, ...convert(type, { [key]: value.split() })[0] }));
      return obj;
    },
    { $and: [], $or: [] }
  );
  result.$and.length === 0 && delete result.$and;
  result.$or.length === 0 && delete result.$or;
  console.log(result);

  return result;
}

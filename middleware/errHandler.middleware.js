import { logEvents } from "./logEvents.middleware.js";

const errHandler = (err, req, res, next) => {
  logEvents(`${err.status || err.name}: ${err.message}`, "errLog.txt");
  console.log(err.stack);
  return err.name === "ValidationError"
    ? res.status(400).json(
        Object.keys(err.errors).reduce((obj, key) => {
          obj[key] = err.errors[key].message;
          return obj;
        }, {})
      )
    : err.status
    ? res.status(err.status).json(err.message)
    : res.status(500).send("Error occurred while logging in");
};

export default errHandler;

import { logEvents } from "../middleware/logEvents.js";

const errHandler = (err, req, res, next) => {
  logEvents(`${err.name}: ${err.message}`, "errLog.txt");
  console.log(err.stack);
  res.status(500).json(err.message);
  next();
};

export default errHandler;

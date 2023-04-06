import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const fsPromises = fs.promises;
const logEvents = async (msg, logName) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const dateTime = format(new Date(), "HH:mm:ss\tdd-MM-yyyy");
  const logItem = `${dateTime}\t${uuidv4()}\t${msg}\n`;
  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs")))
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};

const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt");
  console.log(req.method, req.path);
  next();
};

export { logEvents, logger };

const whiteList = ["http://localhost:3000", "http://localhost:4000", "https://perfume-frontend.onrender.com/"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || origin === "null" || whiteList.indexOf(origin) !== -1) return callback(null, true);
    else return callback(new Error("Not allowed by CORS"), false);
  },
  methods: ["GET", "PUT", "POST", "DELETE"],
  credentials: true,
};

export { whiteList, corsOptions };

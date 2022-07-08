const { application } = require("express");
const express = require("express");
const { typeError } = require("./middleware/errors");
const app = express();
require("dotenv").config();
const swaggerUI = require("swagger-ui-express");
const docs = require("./docs/index");
const PORT = process.env.PORT || 8080;
const { dbConnection } = require("./config/config");
const cors = require("cors");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");

  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");

  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");

  next();
});

app.use(cors());
app.use(express.json());
app.use(express.static("./images"));
dbConnection();

app.use("/posts", require("./routes/posts"));
app.use("/users", require("./routes/users"));
app.use("/comments", require("./routes/comments"));
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(docs));

app.use(typeError);

app.listen(PORT, console.log(`Server started on port ${PORT}`));

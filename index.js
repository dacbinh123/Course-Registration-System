const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 3030;
const dbConnect = require("./config/dbConnect");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser")
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const path = require("path");
const methodOverride = require("method-override");


dbConnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(morgan("dev"))
app.use(methodOverride("_method"));

const hbs = exphbs.create({
  helpers: {
      eq: (a, b) => a === b,  // Định nghĩa helper "eq"
  },
});
app.engine(
  "hbs",
  exphbs.engine({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
    helpers: {
      eq: (a, b) => a === b, // Định nghĩa helper "eq"
    },
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));



const homeRoutes = require("./route/homeRoute");
const authRoutes = require("./route/authRoute");

app.use("/", homeRoutes);
app.use("/", authRoutes);



app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
});

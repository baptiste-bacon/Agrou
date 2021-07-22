require("dotenv").config();

const logger = require("morgan");
const express = require("express");
const errorHandler = require("errorhandler");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const app = express();
const path = require("path");
const port = 3000;

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(errorHandler());
app.use(express.static(path.join(__dirname, "../public")));

const Prismic = require("@prismicio/client");
const PrismicDOM = require("prismic-dom");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

const initApi = (req) => {
  return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req,
  });
};

app.use((req, res, next) => {
  // add PrismicDOM in locals to access them in templates.
  res.locals.PrismicDOM = PrismicDOM;
  next();
});

const handleRequest = async (api) => {
  const meta = await api.getSingle("meta");
  const preloader = await api.getSingle("preloader");
  return {
    meta,
    preloader,
  };
};

app.get("/", async (req, res) => {
  const api = await initApi(req);
  const defaults = await handleRequest(api);
  const home = await api.getSingle("home");

  res.render("pages/home", {
    ...defaults,
    home,
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

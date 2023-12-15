const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./weather-api/graphql/schema");
const path = require("path");
require("dotenv").config(); //load .env variables

const mainRoute = require("./frontend/routes/main-route");

const app = express();
app.set("view engine", "ejs"); //EJS

app.use("/static", express.static(path.join(__dirname, "frontend", "public"))); //middleware to serve static files

app.use(mainRoute);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.listen(process.env.PORT, () => {
  const timestamp = new Date().toLocaleString();
  console.log(`🚀 Server is running and listening on port at ${timestamp} 🚀`);
});

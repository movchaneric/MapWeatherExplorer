const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./weather-api/graphql/schema");
require("dotenv").config(); //load .env variables
const app = express();

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

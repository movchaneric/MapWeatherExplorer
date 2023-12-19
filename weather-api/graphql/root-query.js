const axios = require("axios");
const path = require("path");
const { GraphQLObjectType, GraphQLFloat } = require("graphql");

const weatherLatLon = require("./currentWeather");
console.log(path.join(__dirname, "..", ".."));
require("dotenv").config({ path: path.join(__dirname, "../", "..", "/.env") }); //load .env variables

module.exports = new GraphQLObjectType({
  name: "RootQuery",
  fields: () => ({
    currentWeather: {
      type: weatherLatLon,
      args: {
        lat: {
          type: GraphQLFloat,
        },
        lgn: {
          type: GraphQLFloat,
        },
      },
      resolve: async (parent, args) => {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${args.lat}&lon=${args.lgn}&units=metric&appid=${process.env.WEATHER_API}`
        );
        console.log(res.data.main);
        return res.data;
      },
    },
  }),
});

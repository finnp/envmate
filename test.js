const envmate = require("./");
const { port, email } = require("envalid");

const env = envmate({
  PORT: port(),
  EMAIL: email({ default: "admin@example.com" }),
});
console.log("Lets go:", env);

# envmate

envalid + dotenv + cli prompts = <3

This is mostly just a little experiment/test for myself.

```js
const envmate, { port, email } = require("envmate");
const { port, email } = require("envalid");

const env = envmate({
  PORT: port(),
  EMAIL: email({ default: "admin@example.com" }),
});
```

It will use variables from `.env` or environment. If some are missing it will
ask prompt for missing variables and save them into `.env`.

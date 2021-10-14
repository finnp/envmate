require("dotenv").config();
const envalid = require("envalid");
const prompt = require("prompt-sync")();
const { readFileSync, writeFileSync } = require("fs");

module.exports = function envmate(envalidOptions) {
  return envalid.cleanEnv(process.env, envalidOptions, {
    reporter: async ({ errors, env }) => {
      const missingEnvs = [];
      let hasErrors = false;
      for (const [envVar, err] of Object.entries(errors)) {
        if (err instanceof envalid.EnvMissingError) {
          missingEnvs.push(envVar);
        } else {
          console.error(`${envVar}: ${err.message}`);
          hasError = true;
        }
      }
      if (hasErrors) process.exit(1);

      if (missingEnvs.length > 0) {
        const newEnvValues = {};
        for (const env of missingEnvs) {
          newEnvValues[env] = prompt(`${env}: `);
        }

        for (const [envVar, value] of Object.entries(newEnvValues)) {
          process.env[envVar] = value;
        }
        envalid.cleanEnv(process.env, envalidOptions);

        const oldEnvValues = getCurrentEnvValues();

        saveEnvFile({
          ...oldEnvValues,
          ...newEnvValues,
        });
        console.error("Values written to .env");
      }
    },
  });
};

exports.str = envalid.str;

function saveEnvFile(envValues) {
  writeFileSync(".env", stringifyEnvValues(envValues));
}

function stringifyEnvValues(envValues) {
  return Object.entries(envValues).reduce((acc, [key, value]) => {
    acc += `${key}=${value}\n`;
    return acc;
  }, "");
}

function getCurrentEnvValues() {
  try {
    const vars = readFileSync(".env", "utf-8");

    return vars.split("\n").reduce((acc, line) => {
      const [key, value] = line.split("=");
      if (!key) return acc;
      acc[key] = value;
      return acc;
    }, {});
  } catch (e) {
    return {};
  }
}

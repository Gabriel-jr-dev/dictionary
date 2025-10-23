const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const ensureDatabase = require("./scripts/ensure-database.cjs");

try {
  ensureDatabase({ quiet: true });
} catch (error) {
  console.error(error.message);
  if (error.cause) {
    console.error(error.cause.message || error.cause);
  }
  throw error;
}

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });

const { getDefaultConfig } = require("expo/metro-config");
const { resolve } = require("metro-resolver");
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

const previousResolveRequest = config.resolver?.resolveRequest;

config.resolver = {
  ...config.resolver,
  resolveRequest(context, moduleName, platform) {
    if (moduleName === "expo-sqlite/next") {
      return resolve(context, "expo-sqlite", platform);
    }

    if (typeof previousResolveRequest === "function") {
      return previousResolveRequest(context, moduleName, platform);
    }

    return resolve(context, moduleName, platform);
  },
};

config.resolver.assetExts.push('db', 'sqlite');


module.exports = withNativeWind(config, { input: "./global.css" });

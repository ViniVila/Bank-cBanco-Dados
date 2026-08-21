const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Permite arquivos WebAssembly
config.resolver.assetExts.push("wasm");

// Cabeçalhos necessários para SharedArrayBuffer no navegador
config.server.enhanceMiddleware = (middleware) => {
  return (req, res, next) => {
    res.setHeader(
      "Cross-Origin-Opener-Policy",
      "same-origin"
    );

    res.setHeader(
      "Cross-Origin-Embedder-Policy",
      "credentialless"
    );

    return middleware(req, res, next);
  };
};

module.exports = config;
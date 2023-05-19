#!/usr/bin/env node

const bootstrap = require("../compiler/bootstrap");

(async () => {
  await bootstrap();
  require("../dist/index.js");
})();

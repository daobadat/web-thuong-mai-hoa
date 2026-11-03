"use strict";

const path = require("path");
const Module = require("module");

// Thư mục gốc của project (chứa server.js, index.js, package.json,...)
const rootDir = path.resolve(__dirname, "..");

// 1. Bổ sung rootDir vào NODE_PATH
if (!process.env.NODE_PATH) {
  process.env.NODE_PATH = rootDir;
} else if (!process.env.NODE_PATH.split(path.delimiter).includes(rootDir)) {
  process.env.NODE_PATH = rootDir + path.delimiter + process.env.NODE_PATH;
}

// 2. Mở rộng Module._nodeModulePaths để Node tìm thấy các module tại thư mục gốc
const originalNodeModulePaths = Module._nodeModulePaths;
Module._nodeModulePaths = function (from) {
  const paths = originalNodeModulePaths.call(this, from);
  if (from.indexOf("node_modules") === -1 && !paths.includes(rootDir)) {
    paths.unshift(rootDir);
  }
  return paths;
};

// 3. Tự động ánh xạ (alias resolution) cho các thư mục gốc của project
const originalResolveFilename = Module._resolveFilename;
const ROOT_DIRS = new Set([
  "configs",
  "database",
  "i18n",
  "kernels",
  "middlewares",
  "models",
  "modules",
  "public",
  "routes",
  "swagger",
  "utils",
]);

Module._resolveFilename = function (request, parentModule, isMain, options) {
  if (typeof request === "string" && !request.startsWith(".") && !request.startsWith("/")) {
    const slashIndex = request.indexOf("/");
    const topDir = slashIndex === -1 ? request : request.slice(0, slashIndex);

    if (ROOT_DIRS.has(topDir)) {
      const target = path.join(rootDir, request);
      return originalResolveFilename.call(this, target, parentModule, isMain, options);
    }
  }

  return originalResolveFilename.call(this, request, parentModule, isMain, options);
};

// 4. Cập nhật paths của require.main nếu đã khởi tạo
if (require.main && Array.isArray(require.main.paths) && !require.main.paths.includes(rootDir)) {
  require.main.paths.unshift(rootDir);
}

module.exports = rootDir;


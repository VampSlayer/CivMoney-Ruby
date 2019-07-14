module.exports = {
  outputDir: "public",
  devServer: {
    proxy: {
      "/api/*": {
        target: "http://localhost:9292"
      }
    }
  },
  pages: {
    index: {
      entry: "src/main.js",
      template: "src/public/index.html",
      filename: "index.html"
    }
  }
};

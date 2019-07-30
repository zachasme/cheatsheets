module.exports = {
  locales: ["en"],
  catalogs: [
    {
      path: "src/locales/{locale}",
      include: ["src"]
    }
  ],
  format: "po",
  sourceLocale: "en"
};

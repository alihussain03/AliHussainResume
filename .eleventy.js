const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
  // Rewrites absolute URLs when --pathprefix is set (GitHub Pages project URL)
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  eleventyConfig.addPassthroughCopy("src/assets");
  // Assets are copy-only — never compiled as templates (e.g. the README in files/)
  eleventyConfig.ignores.add("src/assets/**");

  eleventyConfig.addCollection("posts", (collection) =>
    collection.getFilteredByGlob("src/blog/posts/*.md").reverse()
  );

  eleventyConfig.addFilter("htmlDateString", (value) => {
    const date = value instanceof Date ? value : new Date(value);
    return date.toISOString().slice(0, 10);
  });

  eleventyConfig.addFilter("readableDate", (value) => {
    const date = value instanceof Date ? value : new Date(value);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");

  // Add date filters
  eleventyConfig.addFilter("dateToISO", function(date) {
    return new Date(date).toISOString();
  });

  eleventyConfig.addFilter("dateToString", function(date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  // Add global data
  eleventyConfig.addGlobalData("helpers", {
    currentYear: () => new Date().getFullYear()
  });

  // Copy assets
  eleventyConfig.addPassthroughCopy("assets");
  
  // Create posts collection
  eleventyConfig.addCollection("posts", function(collection) {
    return collection.getFilteredByGlob("posts/*.md").map(post => {
      post.data.permalink = `${post.date.toISOString().split('T')[0]}-${post.fileSlug}/`;
      return post;
    }).sort((a, b) => {
      return b.date - a.date;
    });
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
      output: "_site"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};
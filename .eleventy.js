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

  // Add this new filter
  eleventyConfig.addFilter("formatDate", function(date) {
    return new Date(date).toISOString().slice(0,10);
  });

  // Add redirect configuration
  eleventyConfig.addFilter("redirected", function(url) {
    // This regex matches URLs like 2024-03-25-post-name/
    const dateRegex = /^\d{4}-\d{2}-\d{2}-(.*)/;
    const match = url.match(dateRegex);
    
    if (match) {
      // Return the URL without the date prefix
      return `/${match[1]}`;
    }
    return url;
  });

  // Create a collection for redirects
  eleventyConfig.addCollection("redirects", function(collection) {
    const posts = collection.getFilteredByGlob("posts/*.md");
    return posts.map(post => {
      const date = post.data.date ? new Date(post.data.date).toISOString().split('T')[0] : '';
      return {
        from: `/${date}-${post.fileSlug}`,
        to: `/${post.fileSlug}`
      };
    });
  });
  
  // Create a redirects.json file
  eleventyConfig.addPassthroughCopy({
    "redirects.njk": "/_redirects"
  });
  
  // Create posts collection
  eleventyConfig.addCollection("posts", function(collection) {
    const posts = collection.getFilteredByGlob("posts/*.md");
    console.log(`Found ${posts.length} posts`);
    
    posts.forEach(post => {
      console.log('Post debug info:', {
        fileSlug: post.fileSlug,
        date: post.data.date,
        rawData: post.data
      });
    });

    return posts.sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
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
    dataTemplateEngine: "njk",
    // Add this permalink configuration
    pathPrefix: "/",
    // Configure permalinks per directory
    permalinks: {
      posts: data => {
        if (data.date) {
          const date = new Date(data.date);
          return `${date.toISOString().split('T')[0]}-${data.page.fileSlug}/`;
        }
        return `${data.page.fileSlug}/`;
      }
    }
  };
};
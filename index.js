const { parse } = require("url");
const micro = require("micro");
const got = require("got");
const metascraper = require("metascraper");
const cache = require("memory-cache");

const TWENTY_FOUR_HOURS = 86400000 * 3;

const server = micro(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const {
    query: { url }
  } = parse(req.url, true);
  if (!url)
    return micro.send(res, 401, {
      message: "Please supply an URL to be scraped in the url query parameter."
    });

  const cachedResult = cache.get(url);
  if (cachedResult) return micro.send(res, 200, cachedResult);

  let statusCode, data;
  try {
    const { body: html } = await got(url);
    data = await metascraper({ url, html });
    statusCode = 200;
  } catch (err) {
    console.log(err);
    statusCode = 401;
    data = {
      message: `Scraping the open graph data from "${url}" failed.`,
      suggestion:
        "Make sure your URL is correct and the webpage has open graph data, meta tags or twitter card data."
    };
  }

  micro.send(res, statusCode, data);
  // Cache results for 24 hours
  cache.put(url, data, TWENTY_FOUR_HOURS);
});

server.listen(3010, () => console.log("Listening on http://localhost:3010"));

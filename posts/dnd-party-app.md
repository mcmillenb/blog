# DnD Party Management App

I've started running a DnD campaign with college friends during The Quarantine. We're using [DnD Beyond](https://dndbeyond.com) for character creation and management. We're seven people total, and I'm finding that I need to have everyone's character sheet up on DnD beyond so that I can get a quick glimpse at who has the highest Natural Perception, or which party member between two has the highest Dexterity, etc. Currently, DnD Beyond does have a succinct view of the party's data, and I'd like to build one. I'm going to be writing this post as I go through the process of making an app for summarizing party data using the data stored in DnD Beyond.

## Getting the data

### Make a character in DnD Beyond

First thing's first: I need to see how I can gather the data from DnD Beyond. If you haven't used DnD Beyond before, they make it pretty easy to set up a character. Just follow these steps:

1. [Create a DnD Beyond Account](https://www.dndbeyond.com/create-account), or [sign in](https://www.dndbeyond.com/sign-in) if you already have an account.
2. Go through the [Character Builder](https://www.dndbeyond.com/characters/builder#/). For this walkthrough, it doesn't matter what kind of character you create. Just choose whatever you want.
3. Once you've create your character, you should be able to view the character's page, which should have a url similar to this: <https://www.dndbeyond.com/profile/myprofilename/characters/26681628>
4. If you've already got characters, or if you can't figure out how to view your character, you can find all of your characters here: <https://www.dndbeyond.com/my-characters>

### Decide how to retrieve the data

Now that we have a character created, let's see how to get that data from DnD Beyond. First thought is that there might be a development api for DnD Beyond... Hmm, looks like [they are planning on it](https://www.dndbeyond.com/forums/d-d-beyond-general/bugs-support/32487-d-d-beyond-api) but it's not available yet.

Okay, so we'll need to get creative. Let's see if we can scrape the pages for data. I like JavaScript, so I'll look for ways to do it in Node. [Looks like node has a built-in way to make http requests.](https://nodejs.dev/making-http-requests-with-nodejs) That's good, so I'll [start a node project in VS Code](/posts/node-project.md) and then [push that project up to GitHub](/posts/push-to-github.md).

I've created [this repo for the project](https://github.com/mcmillenb/dnd-party-manager). I'll link to the different versions of the project as we go along. The very initial state of the project is [`v0.0.1`](https://github.com/mcmillenb/dnd-party-manager/tree/v0.0.1), if you want to check it out.

### Set up a node project

First, let's add a couple scripts in the `package.json` file:

```json
{
  // ...
  "scripts": {
    "test": "jest",
    "serve": "node src/index.js"
  }
}
```

We've added simple scripts that will now run via `npm run test` and `npm run serve`.

The `test` script is simply running the `jest` command. So we'll need to add the `jest` npm package as a dependency. You can do that like so:

```bash
npm i -D jest
```

In the above command, `i` is equivalent to `install` and the `-D` flag specifies the package as a dev dependency, meaning that the package isn't needed for our package to run, but just for development purposes (testing in our case).

The `serve` script is telling `node` to process and execute the `src/index.js` file. You should already have `node` installed (if you don't, go to <https://nodejs.org> and download it).

Let's add code for a simple node server in the `src/index.js` file:

```js
// src/index.js
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

Now, from your project's root directory, run `npm run serve` to make sure that node can serve the app as expected. You should see a `"Server running at http://127.0.0.1:3000"` message and visiting <http://127.0.0.1:3000> should load with a "Hello World" message in the browser.

If you want to see the code at this point, you can [view `v0.0.2` here](https://github.com/mcmillenb/dnd-party-manager/tree/v0.0.2).

### Parse data from DnD Beyond character page

So now we have a basic node app that we can run via `npm run serve`. Let's start trying to get our DnD character's data in our app.

Our app is using the built-in `http` library to create a server. [Looking at the docs](https://nodejs.org/api/http.html), it seems like we can also use this library to make requests via [the `http.request` method](https://nodejs.org/api/http.html#http_http_request_url_options_callback).

Following the example for the `http.request` method in the docs, let's add these few lines of code to the bottom of our `index.js` file, using the url for our DnD character:

```js
// src/index.js
// ...
const characterUrl = 'https://www.dndbeyond.com/profile/brianmcmillen1/characters/6626114';
const req = http.request(characterUrl, (resp) => {
  resp.setEncoding('utf8');
  resp.on('data', (data) => {
    console.log(`BODY: ${data}`);
  });
  resp.on('end', () => {
    console.log('No more data in response.');
  });
});
req.end();
```

Hmm, if we try running this via `npm run serve`, we get an error saying:

> Protocol "https:" not supported. Expected "http:"

And if we change the `https:` to `http:` we just get this message:

> No more data in response.

Seems like we might not be able to roll our own HTTP client as easily as I'd thought. No worries, other people have certainly hit this problem before. They've even created their own free npm packages that we can use in our project to abstract away whatever issue we're running into.

Let's try using [the `axios` package](https://github.com/axios/axios) as our HTTP Client instead. It's a js library specifically designed for it.

First, we'll need to install it as a dependency in our project:

```bash
npm i -S axios
```

This time, we've used the `-S` flag, which installs the package as a regular dependency, meaning that we're depending on it to actually run the app.

After `axios` has been installed, we can use it in our `index.js` file. First, `require` it as a variable at the top of our file:

```js
// src/index.js
const http = require('http');
const axios = require('axios');
// ...
```

Remove the `const characterUrl = ...` line and everything after. Replace it with the following lines of code:

```js
// src/index.js
// ...
axios({
  url: 'https://www.dndbeyond.com/profile/brianmcmillen1/characters/6626114',
  method: 'get',
  withCredentials: true,
  headers: {
    'Cache-Control': 'no-cache',
    'Cookies': 'foo=bar',
    'User-Agent': 'dnd-party-manager',
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive'
  }
}).then((resp) => {
  console.log('Data: ', resp.data);
}).catch((error) => {
  console.error(error);
});
```

This `axios` call handles everything for us and now we're able to log the full page data for the requested url.

So, now we've gotten the html data, but we're also going to need to parse it so that we can organize it into a useful structure.

Let's google "node html parser" to see what comes up: Ah, a [package named `cheerio` seems useful](https://github.com/cheeriojs/cheerio). But let's compare it to other similar packages on [npmtrends.com](https://npmtrends.com). First, I'll search for [cherrio](https://www.npmtrends.com/cheerio), and yep it seems popular enough, but let's now [compare it using a few of the suggested similar packages](https://www.npmtrends.com/cheerio-vs-htmlparser2-vs-jsdom-vs-parse5-vs-scraper). Okay wow [the `parse5` library](https://github.com/inikulin/parse5) has a lot of downloads. Hmm, but it doesn't have as many stars on GitHub, so it's maybe not as intuitive to use. Well, I'm going to bet on `cheerio` since it's README on GitHub was more inviting and it does have the most stars.

Okay! So let's install `cheerio` into our project:

```bash
npm i -S cheerio
```

Once it's installed, let's `require` it in the top of our `index.js` file:

```js
// src/index.js
const http = require('http');
const axios = require('axios');
const cheerio = require('cheerio');
// ...
```

And now let's use it to parse the html we receive in the `axios` response callback:

```js
// src/index.js
// ...
}).then((resp) => {
  const $ = cheerio.load(resp.data);
  console.log('Title', $('h1.page-title').text().trim());
}).catch((error) => {
// ...
```

Now we're getting somewhere. Now, if we run `npm run serve`, our app should make a request to our character's page, parse the response html, and then print out our character's title like so: `"Title: Rikstiivs"` (my DnD character's name is Rikstiivs).

If you want to see the code at this point, you can [view `v0.0.3` here](https://github.com/mcmillenb/dnd-party-manager/tree/v0.0.3).

## Display the data

So now we have a server, and we're able to fetch and parse the data for our DnD Beyond character. But we only see that data in the terminal. We need to figure out some way to display the data in the server's response so that we get the formatted info we want when we load our app.

The easiest thing to do will be to just take out that `const server = ...` and `server.listen(...)` code and jam it into the axios response callback, like so:

```js
// src/index.js
// ...
}).then((resp) => {
  const $ = cheerio.load(resp.data);
  const title = $('h1.page-title').text().trim();

  const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`Title: ${title}`);
  });

  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
}).catch((error) => {
// ...
```

Now, when we run `npm run serve` and then navigate to <http://127.0.0.1:3000>, we should see "Title: [Your Character's Name]" displayed.

We'll almost certainly need to take this code back out and handle the data fetching and serving in a more flexible way. But for now it works!

If you want to see the code at this point, you can [view `v0.0.4` here](https://github.com/mcmillenb/dnd-party-manager/tree/v0.0.4).

## Wait where's the rest of the data?

So, here's the thing: what it looks like is happening is that we aren't getting the fully loaded page with the `axios` call. A lot of webpages will initially only load basic html and then use JavaScript to add the rest of the functionality or content. Seems like the page for the DnD Beyond character sheet is doing just that. We are able to get the character's name, but if we look through the rest of the html, we're only getting the header content before seeing a bunch of `<script>` tags which are assumably being used to then load the rest of the page's content.

So what does that mean? Well, `axios` probably won't work for getting the data from the DnD Beyond page after all. So, let's get rid of it and try out another library that might get the job done: `puppeteer`. I've heard of this library before, and know that it functions closer to a web browser and should be able to load the content of a page after it's fully loaded.

So first let's remove the `const axios = require('axios')` statement at the top of the file and replace it with `

Okay so first let's install `puppeteer` and uninstall `axios` (using the `un` command instead of `i`):

```bash
npm i -S puppeteer
npm un -S axios
```

Now let's `require` it instead of `axios` in the top of our `index.js` file:

```js
// src/index.js
const http = require('http');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
// ...
```

Now let's write our own function, using the `puppeteer` library, to get the html of any given page:

```js
async function getHtml(url) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  const html = await page.content();
  await browser.close();
  return html;
}
```

The `puppeteer` library comes installed with [Chromium](https://www.chromium.org/), which is an open-source browser that Google Chrome is based off of. So, in the first line of the `getHtml` function, we are actually launching a browser that we'll be able to load webpages with. The second line is telling the browser to open a new page and the third line is telling the page to go to the `url` that gets passed in as the parameter of the function. the `{ waitUntil: 'networkidle2' }` config object is telling the page to wait until the page has completely loaded before resolving and allowing our function to continue. The next line gets the `html` content from the page, and the line after that closes the browser. Finally, our function returns the `html` that was retrieved from the page.

We can add that function to the top of the page and then we can replace the entire `axios` call with simply `getHtml(characterUrl)`.

Since we're returning the `html` just like the `axios` call was, we can keep the `then` handler and just tweak the param being passed to it:

```js
// ...
getHtml(characterUrl).then((html) => {
  const $ = cheerio.load(html);
  // ...
});
```

At this point we should be able to run the `npm run serve` command and see the same results as when we used `axios`.

If you want to see the code at this point, you can [view `v0.0.5` here](https://github.com/mcmillenb/dnd-party-manager/tree/v0.0.5).

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

The `puppeteer` library comes installed with [Chromium](https://www.chromium.org/), which is an open-source browser that Google Chrome is based off of. So, in the first line of the `getHtml` function, we are actually launching a browser that we'll be able to load webpages with. The second line is telling the browser to open a new page and the third line is telling the page to go to the `url` that gets passed in as the parameter of the function. The `{ waitUntil: 'networkidle2' }` config object is telling the page to wait until the page has completely loaded before resolving and allowing our function to continue. The next line gets the `html` content from the page, and the line after that closes the browser. Finally, our function returns the `html` that was retrieved from the page.

We can add that function to the top of the page and then we can replace the entire `axios` call with simply `getHtml(characterUrl)`.

Since we're returning the `html` just like the `axios` call was, we can keep the `then` handler and just tweak the param being passed to it:

```js
// ...
getHtml(characterUrl).then((html) => {
  const $ = cheerio.load(html);
  // ...
});
```

At this point we should be able to run the `npm run serve` command and see the same results as when we used `axios` in the previous section.

If you want to see the code at this point, you can [view `v0.0.5` here](https://github.com/mcmillenb/dnd-party-manager/tree/v0.0.5).

## Parsing some useful data

In the last section we switched tactics to use the `puppeteer` library to render the content of the DnD Beyond webpage and read it in our app. So, now let's explore that content to parse out some useful stats from our DnD character.

Let's first go to the actual page that we are trying to parse information out of. For example, [here in the character sheet](https://www.dndbeyond.com/profile/brianmcmillen1/characters/6626114') for my character named Rikstiivs. On that page we can right-click a stat that we're interested in and choose the "Inspect" option from the menu that pops up. The dev tools will open up and we'll be able to see where in the html the stat is located and what css classes it has. This will be helpful for accessing it with the `cheerio` library.

Here's what my character sheet looked like at the time of writing this:

![DnD Beyond Character Sheet](~@/assets/images/DnD_character_sheet.png)

As an example, we can right-click on the Strength stat at the top-left corner of the character sheet and "Inspect" it (the 23, not the +6 modifier value). It looks like the element displaying the 23 has a `ct-ability-summary__secondary` class, and so do the other elements displaying these six main stats. So, in our code, let's try to access that value using a css selector in the `cheerio` instance we've already created:

```js
// ...
const title = $('h1.page-title').text().trim();
const stat = '.ct-ability-summary__secondary';
const strength = $(stat).eq(0).text();

console.log({ strength });
// ...
```

The above code should print `{ strength: '26' }` to the console when we run `npm run serve`.

We can now use the same logic to get the values for each of the six main stats and then render those values in the server's response. The entire `then` callback will then look something like this:

```js
// ...
getHtml(characterUrl).then((html) => {
  const $ = cheerio.load(html);
  const title = $('h1.page-title').text().trim();
  const stats = $('.ct-ability-summary__secondary');
  const str = stats.eq(0).text();
  const dex = stats.eq(1).text();
  const con = stats.eq(2).text();
  const int = stats.eq(3).text();
  const wis = stats.eq(4).text();
  const cha = stats.eq(5).text();

  const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`
      Title: ${title}
      STR ${str}
      DEX ${dex}
      CON ${con}
      INT ${int}
      WIS ${wis}
      CHA ${cha}
    `);
  });

  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
});
// ...
```

And now, when we run `npm run serve` and then navigate to `127.0.0.1:3000`, we should see a page rendered with the following text:

```txt
Title: Rikstiivs
STR 23
DEX 15
CON 14
INT 12
WIS 14
CHA 12
```

If you want to see the code at this point, you can [view `v0.0.6` here](https://github.com/mcmillenb/dnd-party-manager/tree/v0.0.6).

## Dynamic character stats

So, now we have an app that will parse the stats from the character sheet url that we've specified in the code and then display those stats in the server's response. What we want to do next is to be able to calculate these stats for any DnD Beyond character sheet on the fly. That means we'll need to call our `getHtml` function in response to a HTML request from the client (or the person navigating to our site). The client will need to somehow tell the server which character sheet it wants to parse and the server will need to render the correct stats based on that information.

First, let's see if we can get the server to call the `getHtml` method only once the client has made a request to the server.

We'll put the `getHtml` call inside the `http.createServer` callback. We'll need to make the callback `async` and then `await` the return of the `getHtml` function. It should look something like this:

```js
const characterUrl = 'https://www.dndbeyond.com/profile/brianmcmillen1/characters/6626114';
const server = http.createServer(async (req, res) => {
  const html = await getHtml(characterUrl);
  const $ = cheerio.load(html);
  const title = $('h1.page-title').text().trim();
  const stats = $('.ct-ability-summary__secondary');
  const str = stats.eq(0).text();
  // ...
  const cha = stats.eq(5).text();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(`
    Title: ${title}
    ...
  `);
// ...
```

That looks like it's working! So now we'll want to take the id of our character out of the `characterUrl` variable so that we can add it to requests made to our app. Instead of loading our app at `http://127.0.0.1:3000`, we'll load `http://127.0.0.1:3000/6626114`, passing our character's id in the url.

Our server code will need to add the id from the request (the `req` variable) to the `characterUrl` which now is id-less.

```js
const characterUrl = 'https://www.dndbeyond.com/profile/brianmcmillen1/characters';
const server = http.createServer(async (req, res) => {
  const { url } = req;
  if (!url.match(/^[\/]\d+$/)) {
    res.end('bad id');
    return;
  }
  const html = await getHtml(`${characterUrl}${url}`);
  const $ = cheerio.load(html);
// ...
```

In the code above we're first taking the url string (`/6626114` in our case) from the request to the server. Then we're seeing if the url matches the regular expression `/^[\/]\d+$/`. This regular expression will match the string if it begins (`^`) with a single `/` character (`[\/]`), followed by one or more (`+`) numbers (`\d`) and then nothing more (`$`). If the url string does not match that criteria, the server will response with a simple `'bad id'` message. If the string does match the regular expression, we'll call `getHtml` and pass in the character url with our request`s url appended to it.

Now when we run `npm run serve` and navigate to `http://127.0.0.1:3000/6626114`, we should see the same stats we loaded before for our character. But what's more: we can now navigate to any character id in our app and see the stats for that character. For example: `http://127.0.0.1:3000/24118826` should load my Moonbean character's stats.

We're now able to load the basic stats of any DnD Beyond character just based on their id! If you want to see the code at this point, you can [view `v0.0.7` here](https://github.com/mcmillenb/dnd-party-manager/tree/v0.0.7).

## Formatting the response data

So, now we're able to get the stats for any character. But it would be nicer to get that data in an easy-to-parse format, instead of just plain-text. Next we'll see if we can structure the data as JSON so that we can work with the retrieve data more easily.

First, we'll want to put the data we parse from our character's page into a JavaScript object:

```js
const server = http.createServer(async (req, res) => {
  // ...
  const $ = cheerio.load(html);
  const title = $('h1.page-title').text().trim();
  const stats = $('.ct-ability-summary__secondary');
  const str = stats.eq(0).text();
  const dex = stats.eq(1).text();
  const con = stats.eq(2).text();
  const int = stats.eq(3).text();
  const wis = stats.eq(4).text();
  const cha = stats.eq(5).text();

  const data = {
    title,
    stats: { str, dex, con, int, wis, cha }
  };
// ...
```

Then, we'll want to return the `data` as a JSON string in our response:

```js
const server = http.createServer(async (req, res) => {
  // ...

  const data = {
    title,
    stats: { str, dex, con, int, wis, cha }
  };

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
});
// ...
```

Now, when we run our app and navigate to the page for our character, we should see our response looks something like this:

```json
{
  "title": "Rikstiivs",
  "stats": {
    "str": "23",
    "dex": "15",
    "con": "14",
    "int": "12",
    "wis": "14",
    "cha": "12"
  }
}
```

Nice and formatted! Just the way I like it. If you want to see the code at this point, you can [view `v0.0.8` here](https://github.com/mcmillenb/dnd-party-manager/tree/v0.0.8).

## Load stats for a whole party

Now, what's really going to set this app over the top is to be able to load each member of a campaign at the same time and display it on the same screen. Campaigns in DnD Beyond can also be accessed by a single id, like the character sheets can. So what we'll want to do now is load the page for a campaign and return all of the character ids from it.

First, let's pull the logic specific to the character sheet parsing to its own function that we can call from the server's response callback:

```js
// ...
async function parseCharacterSheet(url) {
  const characterUrl = 'https://www.dndbeyond.com/profile/brianmcmillen1/characters';
  const html = await getHtml(`${characterUrl}${url}`);
  const $ = cheerio.load(html);
  const title = $('h1.page-title').text().trim();
  const stats = $('.ct-ability-summary__secondary');
  const str = stats.eq(0).text();
  const dex = stats.eq(1).text();
  const con = stats.eq(2).text();
  const int = stats.eq(3).text();
  const wis = stats.eq(4).text();
  const cha = stats.eq(5).text();

  return {
    title,
    stats: { str, dex, con, int, wis, cha }
  };
}

const server = http.createServer(async (req, res) => {
  const { url } = req;
  let data = {};
  if (url.match(/^[\/]\d+$/)) {
    data = await parseCharacterSheet(url);
  } else {
    res.end('bad id');
    return;
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
});
// ...
```

You should also note that the `if` statement has been flipped around so that now the `parseCharacterSheet` function will be called if the url string matches our regular expression and otherwise the response will end with `'bad id'`.

Now, what I would have done next is make another regex comparison to a different url path for our app which would specifically be used to parse the campaign page for individual character ids.

```js
// ...
  if (url.match(/^[\/]\d+$/)) {
    data = await parseCharacterSheet(url);
  } else if (url.match(/^[\/]party[\/]\d+$/)) {
    data = await parsePartyPage(url);
  } else {
// ...
```

But, unfortunately, what I just now discovered is that, while campaigns do indeed have id-specific pages in DnD Beyond, you need to be logged in to view them. And boy howdy, I'm not going to try to authenticate our app against DnD Beyond. It might be possible to do, but you gotta know when to fold 'em.

So, anyways, I'm going to call it for this post. We did manage to tidy up our code a bit, and we also technically have a working app. So I'm going to increase the project's minor version to `v0.1.0`. So if you want to see the code at this point, you can [view `v0.1.0` here](https://github.com/mcmillenb/dnd-party-manager/tree/v0.1.0).

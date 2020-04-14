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
  ...
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

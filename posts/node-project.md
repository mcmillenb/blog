# Node Project in VS Code

The following section will describe why I like JavaScript, Node, and VS Code as my default project setup. If you're not interested in that and just want to get the dang thing running, jump to the next section.

I like programming in JavaScript, because it's so versatile. It's super unopinionated, which means it has a very low barrier-to-entry. (It also means that you can develop bad habits if you're not careful, so look up [best practices](https://jstherightway.org/) and then break them when you need to.)

I like [Node](nodejs.org) because it's written in JavaScript and allows you to run server-side code. I remember in college (2010 - 2014) my CS Professor saying that Node was an interesting idea, but wouldn't ever be seriously used in the "real world", because it's so much slower compared to other server-side languages. Well, that professor was wrong. Node is used all the time for all different types of applications, nevermind how slow it is. It gets the job done and doesn't require you to learn a new language if you already know JavaScript. It also comes with the unopinionateness of JS that you don't get with other languages. (Some people really like things to be opinionated btw, so this isn't innately a good thing.) But, anyways, I like Node and, at least for my projects, I'll use it when I can.

I like using [VS Code](https://code.visualstudio.com/) as an IDE, because it's free, highly customizable, has a large community of users supporting it, and has a [built-in terminal](https://code.visualstudio.com/docs/editor/integrated-terminal). I used Eclipse in college, when I mostly programmed in Java. Then, I used Sublime for a while when I was programming in JavaScript professionally. But for the past three or so years I've been using VS Code for pretty much anything (even Java code for my actual job). VS Code has extensions for almost every language or type of file, and the customizing makes it easy to tweak anything that frustrates me about the default settings.

All of that to say: I like using Node in VS Code as a default setup for personal projects, because I am familiar with them and they allow me the lowest barrier-to-entry when wanting to test out a new idea. But I also believe they are inherently easy to pick up and would be a good starting point for anyone following along in my walkthroughs, so I'd encourage anyone to try them out.

## Installing VS Code

You can install VS Code here: <https://code.visualstudio.com/download>

## Installing Node

You can install Node here: <https://nodejs.org/en/download/>

Node should come installed with the Node Package Manager (`npm`), but if it doesn't you can install it from here: <https://www.npmjs.com/get-npm>.

## Simple Node Project

Once you have VS Code and Node installed, create a new folder in your file manager and then open it with VS Code. You should then add a single `index.js` file to the project folder and add the following code to the file:

```js
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

Then, in your terminal execute `node index.js` from your project's directory to run this simple node app. You should see a message saying `"Server running at http://127.0.0.1:3000/"` in you terminal. Then, once you navigate to <http://127.0.0.1:3000/> in your browser, you should see a page that just displays the text "Hello World".

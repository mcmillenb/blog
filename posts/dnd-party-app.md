# DnD Party Management App

I've started running a DnD campaign with college friends during The Quarantine. We're using [DnD Beyond](https://dndbeyond.com) for character creation and management. We're seven people total, and I'm finding that I need to have everyone's character sheet up on DnD beyond so that I can get a quick glimpse at who has the highest Natural Perception, or which party member between two has the highest Dexterity, etc. Currently, DnD Beyond does have a succinct view of the party's data, and I'd like to build one. I'm going to be writing this post as I go through the process of making an app for summarizing party data using the data stored in DnD Beyond.

## 1. Getting the Data

First thing's first: I need to see how I can gather the data from DnD Beyond. If you haven't used DnD Beyond before, they make it pretty easy to set up a character. Just follow these steps:

1. [Create a DnD Beyond Account](https://www.dndbeyond.com/create-account), or [sign in](https://www.dndbeyond.com/sign-in) if you already have an account.
2. Go through the [Character Builder](https://www.dndbeyond.com/characters/builder#/). For this walkthrough, it doesn't matter what kind of character you create. Just choose whatever you want.
3. Once you've create your character, you should be able to view the character's page, which should have a url similar to this: <https://www.dndbeyond.com/profile/myprofilename/characters/26681628>
4. If you've already got characters, or if you can't figure out how to view your character, you can find all of your characters here: <https://www.dndbeyond.com/my-characters>

Now that we have a character created, let's see how to get that data from DnD Beyond. First thought is that there might be a development api for DnD Beyond... Hmm, looks like [they are planning on it](https://www.dndbeyond.com/forums/d-d-beyond-general/bugs-support/32487-d-d-beyond-api) but it's not available yet.

Okay, so we'll need to get creative. Let's see if we can scrape the pages for data. I like JavaScript, so I'll look for ways to do it in Node. [Looks like node has a built-in way to make http requests.](https://nodejs.dev/making-http-requests-with-nodejs) That's good, so I'll [start a node project in VS Code](posts/node-project.md) and then [push that project up to GitHub](posts/push-to-github.md).

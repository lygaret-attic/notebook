# notebook

A sticky note style notebook, implemented as a purely client-side applicotion, backed by Dropbox.
You can store notes (text, files, links, etc.), which will be persisted as entries in a markdown
based plain text journal file in your dropbox. Features full-text search, tagging, etc.

## Why?

For science. 

And also politics. I might write a blog post.

## Running

1. Get a dropbox API key
    1. visit the [dropbox app console](https://www.dropbox.com/developers/apps) and create an app
    1. copy the `App key` from your newly created application
2. Move the `env.json` file into place, and replace the api key
    1. `$ cd src`
    1. `$ cat env.json.example | sed 's/APIKEY/[your api key you just copied]/' > env.json`
3. Install deps and get running!
    1. `$ npm install`
    1. `$ bower install`
    1.  $ grunt serve`

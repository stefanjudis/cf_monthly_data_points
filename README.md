# DevRel Monthly Data Points

This is an experiment in creating a simple data source in Contentful, and a quick and dirty CLI to retrieve the values in a nice-looking table.

# Usage

- clone this repo
- run `npm install` to get all dependencies
- create your config file with the following format (save as ./config.js):

```
module.exports = {
  contentful : {
    spaceId     : 'space_id',
    accessToken : 'access_token',
    contentType : 'monthEntry'
  }
}
```

# Sample output

![](http://drops.ricardoalcocer.com/contentful_drops/Screen%20Shot%202017-03-28%20at%2010.04.46%20AM.png)

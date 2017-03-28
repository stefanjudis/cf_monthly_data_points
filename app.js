'use strict'

const moment              = require('moment');
const contentful          = require('contentful');
const config              = require('./config');
const Table               = require('cli-table');
const upArrow             = '⬆';
const dwArrow             = '⬇';

/*
config.js contains something like this

module.exports = {
  contentful : {
    spaceId     : 'space_id',
    accessToken : 'access_token',
    contentType : 'content type'
  }
}

Implemented it this way so I could change data sources without revealing my access token or space name
*/

// this is in case we want to account for
var baseline = {
  events        : 100,
  cf_libs       : 100,
  other_libs    : 100,
  talks         : 100,
  blogposts     : 100
}

var previous = {
  events      : 0,
  cf_libs     : 0,
  other_libs  : 0,
  talks       : 0,
  blogposts   : 0
};

const client = contentful.createClient({
  space       : config.contentful.spaceId,
  accessToken : config.contentful.accessToken
})

client.getEntries({
  'content_type' : config.contentful.contentType,
  'order' : "fields.monthYear"
}).then((response) => {
    var table = new Table({
        head: ['Date', 'Events', 'CF Libraries', 'Other Libraries', 'Talks', 'BlogPosts']
      //, colWidths: [50, 50]
    });
    response.items.forEach(function(val){
      var myDate = moment(val.fields.monthYear, 'YYYY/MM/DD')
      var month = myDate.format('MMMM')
      var year  = myDate.format('YYYY')
      
      table.push(
          [
            month + ' ' + year,
            val.fields.eventsAttended       + getDiff(val.fields.eventsAttended,'events')        ,
            val.fields.contentfulLibraries  + getDiff(val.fields.contentfulLibraries,'cf_libs')  ,
            val.fields.communityLibraries   + getDiff(val.fields.communityLibraries,'other_libs'),
            val.fields.talks                + getDiff(val.fields.talks, 'talks')                 ,
            val.fields.blogposts            + getDiff(val.fields.blogposts,'blogposts')          ,
          ]
      );
      previous.events     = val.fields.eventsAttended;
      previous.cf_libs    = val.fields.contentfulLibraries;
      previous.other_libs = val.fields.communityLibraries;
      previous.talks      = val.fields.talks ;
      previous.blogposts  = val.fields.blogposts;
    })
    //console.log(JSON.stringify(out, false, '\t'));)
    console.log(table.toString())
  }).catch((error) => {
    console.log('\x1b[31merror occured')
    console.log(error)
})

function getDiff(val,tag){
  var out;

  switch (tag){
    case 'events' :
      out = (val - previous.events);
      break;
    case 'cf_libs' :
      out = (val - previous.cf_libs);
      break;
    case 'other_libs' :
      out = (val - previous.other_libs);
      break;
    case 'talks' :
      out = (val - previous.talks);
      break;
    case 'blogposts' :
      out = (val - previous.blogposts);
      break;
  }
  if (out > 0){
    out = '\x1b[32m' + ' (' + out;
    out += upArrow;
    out += ' )'
  }else if (out < 0){
    out = '\x1b[31m' + ' (' + out;
    out += dwArrow;
    out += ' )'
  }
  return out;
}

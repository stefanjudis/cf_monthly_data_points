'use strict'

const moment              = require('moment');
const contentful          = require('contentful');
const config              = require('./config');
const Table               = require('cli-table');
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

// this is in case we want to account for data before we started using this tool
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
        head: ['Date', 'Events', 'CF Libs', 'Other Libs', 'Talks', 'BlogPosts']
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
  var diff,out;
  const upArrow             = '⬆';
  const dwArrow             = '⬇';

  switch (tag){
    case 'events' :
      diff = (val - previous.events);
      break;
    case 'cf_libs' :
      diff = (val - previous.cf_libs);
      break;
    case 'other_libs' :
      diff = (val - previous.other_libs);
      break;
    case 'talks' :
      diff = (val - previous.talks);
      break;
    case 'blogposts' :
      diff = (val - previous.blogposts);
      break;
  }

  if (diff > 0){
    out = '\x1b[32m' + ' [';
    out += diff;
    out += upArrow;
    out += ' ]'
  }else if (diff < 0){
    out = '\x1b[31m' + ' [';
    out += diff;
    out += dwArrow;
    out += ' ]'
  }else{
    out = diff;
  }
  return out;
}

'use strict'

const moment              = require('moment');
const contentful          = require('contentful')
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

var baseline = {
  events_attended       : 100,
  contentful_libraries  : 100,
  community_libraries   : 100,
  talks                 : 100,
  blogposts             : 100
}

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


      // TOFIX:
      // this is supposed to comare with prev month
      // the idea is that each entry shows the delta from the previous month

      table.push(
          [
            month + ' ' + year,
            val.fields.eventsAttended       + '➖ [ ' + 1 + dwArrow + ' ]',
            val.fields.contentfulLibraries  + '➖ [ ' + 2 + upArrow + ' ]',
            val.fields.communityLibraries   + '➖ [ ' + 3 + dwArrow + ' ]',
            val.fields.talks                + '➖ [ ' + 4 + upArrow + ' ]',
            val.fields.blogposts            + '➖ [ ' + 5 + dwArrow + ' ]',
          ]
      );
    })
    //console.log(JSON.stringify(out, false, '\t'));)
    console.log(table.toString())
  }).catch((error) => {
    console.log('\x1b[31merror occured')
    console.log(error)
})

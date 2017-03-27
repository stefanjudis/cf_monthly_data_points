'use strict'

const moment              = require('moment');
const contentful          = require('contentful')
const values              = require('./setup');

/*
setup.js contains something like this

exports.settings = {
  spaceId     : 'ikuhazn2m6br',
  accessToken : '53d84f2621c3cf041ed81872aea607364aac0bff7da155897a51bf6d85a7bd5e',
  contentType : 'monthEntry'
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
  space       : values.settings.spaceId,
  accessToken : values.settings.accessToken
})

client.getEntries({
  'content_type' : values.settings.contentType,
  'order' : "fields.monthYear"
}).then((response) => {
    var Table = require('cli-table');
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
            val.fields.eventsAttended,
            val.fields.contentfulLibraries,
            val.fields.communityLibraries,
            val.fields.talks,
            val.fields.blogposts
          ]
      );
    })
    //console.log(JSON.stringify(out, false, '\t'));)
    console.log(table.toString())
  }).catch((error) => {
    console.log('\x1b[31merror occured')
    console.log(error)
})

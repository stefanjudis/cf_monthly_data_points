import React, { PropTypes } from "react"
import { createClient } from "contentful"
import styles from "./index.css"
import config from "../../../config.json"

class MonthlyOverview extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
      items           : [],
      isLoading       : true,
      tableValues    : [
        {
          label : 'Month',
          name  : 'title'
        },
        {
          label : 'Events',
          name  : 'eventsAttended'
        },
        {
          label : 'CF Libs',
          name  : 'contentfulLibraries'
        },
        {
          label : 'Other libs',
          name  : 'communityLibraries'
        },
        {
          label        : 'Blog posts',
          name         : 'blogposts',
          isReferences : true
        },
        {
          label        : 'Talks',
          name         : 'talks',
          isReferences : true
        }
      ]
    }

    createClient( config )
      .getEntries( {
        content_type : 'monthEntry',
        order : '-fields.from'
      } )
      .then( ( response ) => this.setState( { items : response.items, isLoading : false } ) );
  }

  render() {
    return (
      <table className={ styles.monthlyOverviewTable }>
        <thead>
          <tr>
            {
              this.state.tableValues.map(
                column => <td key={ column.name }>{ column.label }</td>
              )
            }
          </tr>
        </thead>
        <tbody>
          {
            this.state.items.map( item => {
              return (
                <tr key={ item.sys.id }>
                  {
                    this.state.tableValues.map(
                      column => {
                        return (
                          <td key={ `${ item.sys.id }-${ column.name }`}>
                            {
                              column.isReferences && item.fields[ column.name ] ?
                              item.fields[ column.name ].length || 0:
                              item.fields[ column.name ]
                            }
                          </td>
                        );
                      }
                    )
                  }
                </tr>
              );
            } )
          }
        </tbody>
      </table>
    )
  }
}

MonthlyOverview.propTypes = {
  contentTypeId: PropTypes.string.isRequired,
}

export default MonthlyOverview

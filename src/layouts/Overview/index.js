import React from "react"
import MonthlyOverview from '../../components/MonthlyOverview'
import Page from "../Page"

const Overview = (props) => {
  return (
    <Page { ...props }>
      <MonthlyOverview contentTypeId="foo" />
    </Page>
  )
}

export default Overview
import React from "react"

export default class NoSearchResultText extends React.Component {
  render() {
    return(
      <p id="NoSearchResult" style={{marginTop:'20px', visibility:'hidden'}}>No Seach Result for: {this.props.query} </p>
    )
  }
}
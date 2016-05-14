import React from "react"
import NoSearchResultText from "./NoSearchResultText"

export default class SearchBar extends React.Component {
  render() {
    return (
      <div id="searchBarContainer">
        <form className="pure-form" onSubmit={this.props.searchWordTrie}>
          <input type="text" id="searchBar" className="pure-input" style={{marginRight:"10px"}}/>
          <input type="submit" value="Search" className="pure-button" />
        </form>
      </div> 
    )
  }
} 


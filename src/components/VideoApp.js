import React from "react"
import { Link } from 'react-router'
import InputBar from "./InputBar"
import Firebase from "firebase"
import SearchBar from "./SearchBar"
import Axios from "axios"
import Main from "./Main"
import NoSearchResultText from "./NoSearchResultText"

export default class VideoApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchResults: []
    }
  }

  searchWordTrie(event) {
    event.preventDefault()
    let query = document.getElementById("searchBar").value

    if (query != "") {
      query = query.toUpperCase()
      Axios.get('http://46.101.123.73:8080/video_search/' + '?query=' + query)
        .then(response => {
          let filteredWords = response.data.filter(wordObj => {
            return wordObj.cost < 3
          }).map(wordObj => {
            return wordObj.wordId
          })
          this.setState({
            searchResults: filteredWords
          })
        })
    }

  }

  insertVideo() {
    this.player = new YT.Player('video', {
      width: 600,
      height: 400,
      videoId: 'Ks-_Mh1QhMc'
    }) 
  }

  componentDidMount() {
    window.onYouTubeIframeAPIReady = () => {
      console.log("YOUTUBE API READY")
      this.insertVideo()
    } 

    if (typeof YT.Player == "function") {
      this.insertVideo()
    } 
  }

  componentWillUpdate() {
    console.log("componentWillUpdate")
    console.log("QUERY", this.query)
    console.log("this.state.searchResults.length", this.state.searchResults.length)
    let searchBarContainer = document.getElementById("searchBarContainer")
    if (this.state.searchResults.length > 0) {
      let noSearchResultText = document.getElementById("NoSearchResult")
      if (NoSearchResult != undefined) {
        noSearchResultText.parentNode.removeChild(noSearchResultText)
      }
    } else if (this.query != undefined) {
      console.log("ABC")
      searchBarContainer.parentNode.insertBefore(
        <NoSearchResultText query={this.query} />,
        searchBarContainer.nextSibling
        )
    }
  }

  render() {

    let body = {
      display: 'flex',
      justifyContent: 'space-around'
    }

    let description = {
      width: '60%',
      textAlign: 'center',
      margin: 'auto'
    }

    let answers = this.state.searchResults.map((ans) => {
      let minutes = Math.floor(ans / 60)
      let seconds = ans % 60
      let onClick = () => {
        this.player.seekTo(ans)
        e.preventDefault()
      }
      return (
        <li> <a href="#" onClick={onClick}>{minutes}:{seconds}</a></li>
      )
    })

    return (
      <div>
      <Main />
      <div>
        <div style={description}>
          <p>MetaLang Video App searches through a video phonetically</p>
          <p>Instructions:</p>
          <p> 1. Search for terms that might be in the video</p>
          <p> 2. Click on one of the returned timestamps</p>
        </div>
        <div style={body}>
          <div>
            <h3 style={{marginTop:'0px'}}>Query</h3>
            <SearchBar searchWordTrie={this.searchWordTrie.bind(this)} resultTimestamps={this.searchResults}/>
            <ul>
              {answers}
            </ul>
          </div>
          <div id="videoContainer">
            <div id="video">
            </div>
          </div>
        </div>
      </div>
      </div>
    )
  }

}

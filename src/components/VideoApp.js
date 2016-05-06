import React from "react"
import { Link } from 'react-router'
import InputBar from "./InputBar"
import Firebase from "firebase"
import SearchBar from "./SearchBar"
import Axios from "axios"

export default class VideoApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      listOfAnswers: []
    }
  }

  searchWordTrie(event) {
    console.log("INSIDEJ")
    event.preventDefault()
    let query = document.getElementById("searchBar").value

    if (query != "") {
      query = query.toUpperCase()
      Axios.get('http://46.101.123.73:8080/video_search/' + '?query=' + query)
        .then(response => {
          console.log("WORKING")
          console.log(response)

          let filteredWords = response.data.filter(wordObj => {
            console.log(1)
            console.log(wordObj)
            return wordObj.cost < 5
          }).map(wordObj => {
            console.log(2)
            console.log(wordObj)
            return wordObj.wordId
          })
          console.log(filteredWords)

          this.setState({
            listOfAnswers: filteredWords
          })
        })
    }

  }

  componentDidMount() {
    this.player = new YT.Player('video', {
        width: 600,
        height: 400,
        videoId: 'Ks-_Mh1QhMc'
    })
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

    let answers = this.state.listOfAnswers.map((ans) => {
      console.log(ans)
      let onClick = () => {
        this.player.seekTo(ans)
      }
      return (
        <li onClick={onClick}>{ans}</li>
      )
    })

    return (
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
            <SearchBar searchWordTrie={this.searchWordTrie.bind(this)}/>
            <ul>
              {answers}
            </ul>
          </div>
          <div>
            <div id="video">
            </div>
          </div>
        </div>
      </div>
    )
  }

}

import React from "react"
import { Link } from 'react-router'
import InputBar from "./InputBar"
import Firebase from "firebase"
import SearchBar from "./SearchBar"
import Axios from "axios"
import Main from "./Main"
import NoSearchResultText from "./NoSearchResultText"

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.firebaseRef = new Firebase("https://word-search-demo.firebaseio.com/word_search")
    this.state = {
      listOfIdsAndWords: {},
      searchResults: []
    }

    this.firebaseRef.on("child_added", (snapshot) => {
      this.state.listOfIdsAndWords[snapshot.val()] = snapshot.key()
      this.setState({
        listOfIdsAndWords: this.state.listOfIdsAndWords
      })
    })
  }

  writeToFirebase(event) {
    event.preventDefault()

    let word = document.getElementById("inputBar").value
    word = word.toUpperCase()
    let word_json = {}
    word_json[word] = ""

    this.firebaseRef.once("value", (snapshot) => {
      this.firebaseRef.child(word).set(snapshot.numChildren() + 1 )
    })
  }

  searchWordTrie(event) {
    this.query = document.getElementById("searchBar").value

    if (this.query != "") {
      this.query = this.query.toUpperCase()
      Axios.get('http://46.101.123.73:8080/word_search/' + '?query=' + this.query)
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

    event.preventDefault()
  }

  componentWillUpdate() {
    let answerTable = document.getElementById("searchResults")
    let noSearchResultText = document.getElementById("NoSearchResult")
    if (this.state.searchResults.length > 0) {
      answerTable.style.visibility = "visible"
      noSearchResultText.style.visibility = "hidden"
    } else if (this.query != undefined) {
      answerTable.style.visibility = "hidden"
      noSearchResultText.style.visibility = "visible"
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

    let listOfIds = Object.keys(this.state.listOfIdsAndWords)

    listOfIds.sort()

    let listOfIdsAndWords = listOfIds.map((id) => {
      let word = this.state.listOfIdsAndWords[id]
      return(
        <tr>
          <td>{id}</td>
          <td>{word}</td>
        </tr> 
      )
    })

    let WordsAndIds = {}
    listOfIds.forEach((id) => {
      let word = this.state.listOfIdsAndWords[id]
      WordsAndIds[word] = id 
    })

    let searchResults = this.state.searchResults.map((word) => {
      let id = WordsAndIds[word]
      return(
        <tr>
          <td>{id}</td>
          <td>{word}</td>
        </tr>
      )
    })

    return (
      <div>
      <Main />
      <div>
          <div style={description}>
            <p>MetaLang is a multi-language phonetic search engine. 
            For example, searching for "Mohammed" will match against "محمد" "Muhammed", "Mahamed", "Mohamed" because all the terms are phonetically the same! </p>
            <p>Instructions:</p>
            <p> 1. Add new words that are phonetically similar into the database </p>
            <p> 2. Search for the word under the Query bar </p>
          </div>

          <div style={body}>
            <div>
              <h3>Query</h3>
              <SearchBar searchWordTrie={this.searchWordTrie.bind(this)}/>
              <NoSearchResultText query={this.query} style={{marginTop:'20px', visibility:'hidden'}}/>
              <table className="pure-table" id="searchResults" style={{marginTop:'20px', visibility:'hidden'}}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Words</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults}
                </tbody>
              </table>  

            </div>
            <div>
              <h3>Database</h3>
              <InputBar writeToFirebase={this.writeToFirebase.bind(this)}/>

              <table className="pure-table" id="listOfWords" style={{marginTop:'20px'}}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Words</th>
                  </tr>
                </thead>
                <tbody>
                  {listOfIdsAndWords}
                </tbody>
              </table>
            </div>

        </div>
      </div>
      </div>
    )
  }

}

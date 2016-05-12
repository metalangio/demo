import React from "react"
import { Link } from 'react-router'
import InputBar from "./InputBar"
import Firebase from "firebase"
import SearchBar from "./SearchBar"
import Axios from "axios"
import Main from "./Main"

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.firebaseRef = new Firebase("https://word-search-demo.firebaseio.com/word_search")
    this.state = {
      listOfIdsAndWords: {},
      listOfAnswers: []
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
    let query = document.getElementById("searchBar").value

    if (query != "") {
      query = query.toUpperCase()
      Axios.get('http://46.101.123.73:8080/word_search/' + '?query=' + query)
        .then(response => {

          let filteredWords = response.data.filter(wordObj => {
            return wordObj.cost < 3
          }).map(wordObj => {
            return wordObj.wordId
          })

          this.setState({
            listOfAnswers: filteredWords
          })
        })
    }

    event.preventDefault()
  }

  componentWillUpdate() {
    let answerTable = document.getElementById("listOfAnswers")
    if (this.state.listOfAnswers.length > 0) {
      answerTable.style.visibility = "visible"
    } else {
      answerTable.style.visibility = "hidden"
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

    let listOfAnswers = this.state.listOfAnswers.map((word) => {
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
              <table className="pure-table" id="listOfAnswers" style={{marginTop:'20px', visibility:'hidden'}}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Words</th>
                  </tr>
                </thead>
                <tbody>
                  {listOfAnswers}
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

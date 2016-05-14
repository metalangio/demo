import React from "react"
import { Link } from 'react-router'

export default class App extends React.Component {
  render() {

    let font = {
      fontFamily: 'Noto Sans'
    }

    let title = {
      textAlign:'center',
      color:'#1E69A6'
    }

    let navigation = {
      textAlign: 'center',
      margin: 'auto'
    }

    let link = {
      margin: '10px'
    }

    return(
      <div style={font}>
        <h2 style={title}>MetaLang phonetic search</h2>
        <div style={navigation}>
          <Link style={link} to="/video">Video Search</Link>
          <Link style={link} to="/text">Text Search</Link>
        </div>
        <div>
          {this.props.children}
        </div>
      </div>
    )
  }
}

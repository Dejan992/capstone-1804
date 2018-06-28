import { createFuzzyMatchThunk, createMatchAllInCategoryThunk } from '../store'
import React, {Component} from 'react'
import { withRouter, Link } from 'react-router-dom'
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux'
import styled from "styled-components"

const DropDown = styled.div`
  position: absolute;
  z-index: 0;
  background-color: white;
  padding-left: 40px;
  padding-right: 40px;
  max-height:200px;
  overflow: scroll;
`

const MatchRow = styled.div`
  height: auto;
  width: autl;
  padding-left: 4px;
  padding-right: 4px;
  border-radius: 6px;
  margin: 0;
  &:hover {
    background-color: #efe6f2;
  }
`

class SearchAny extends Component {
  constructor(props) {
    super(props)
    this.state = {
      input: ''
    }
  }

  handleChange = async (event) => {
      await this.setState({
        input: event.target.value
      })
      //if you have your routes set up correctly, this clause should make it so
      //that you don't have to pass in any additional props
        if(this.props.match.params.categoryName){
          this.props.fuzzyMatchByCategory(this.state.input, this.props.category)
        }else{
          this.props.fuzzyMatch(this.state.input)
        }
    }


  handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      return this.props.matches
    }
  }

  mapOptions = () => {
    const matches = this.props.matches
    if(matches.length && this.state.input !== ''){
      return(<div>
        {
          matches.map((match) => {
            const {name, uid, slug, url} = match
            if(match.type === 'Path'){
              return <Link to={`/paths/${uid}/${slug}`} key={uid}><MatchRow><p>{name}</p></MatchRow></Link>
            }else{
              //coming soon!
              // return <Link to={`/resources/${uid}/${slug}`} key={uid}><MatchRow><p>{name}</p></MatchRow></Link>
              return <a href={url} key={uid}><MatchRow><p>{name}</p></MatchRow></a>
            }
          })
        }
        </div>

      )
    }
  }

  render () {
    return (
      <div style={{height:80}}>
      <TextField
        id="search"
        onChange={this.handleChange}
        onKeyPress={(e) => {
          if(e.key === 'Enter')
          this.handleKeyPress(e)
        }}
        value={this.state.input}
        label={`Refine your search`}
        type="search"
        margin="normal"
      />
      <DropDown>
        {
          this.mapOptions()
        }
      </DropDown>
      </div>
    )

  }

}

const mapState = (state) => {
    return {
      matches: state.searchMatches
    }
}

const mapDispatch = (dispatch) => {
  return {
    fuzzyMatchByCategory : (string, category)=> {
      dispatch(createMatchAllInCategoryThunk(string, category))
    },
    fuzzyMatch : (string) => {
      dispatch(createFuzzyMatchThunk(string))
    }
  }
}

export default withRouter(connect(mapState, mapDispatch)(SearchAny))


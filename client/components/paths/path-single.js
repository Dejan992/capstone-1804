import React, { Component } from 'react'
import { connect } from 'react-redux'
import PathProgress from './path-progress'
import AddResource from './add-resource'
import PathToggleStatus from './path-toggle-status'

import { deleteSinglePathThunk, getStepCompletionSingleUserThunk, toggleStepCompletionThunk } from '../../store'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'

const styles = {
  container: {
    backgroundColor: 'white',
    borderWidth: '1px',
    borderColor: '#efefef',
    borderStyle: 'solid'
  },
  deleteButton: {
    marginTop: 20,
    float: 'right'
  },
  chip: {
    fontWeight: 100,
    marginRight: 20
  }
}

class SinglePath extends Component {
  constructor(){
    super()

    this.state = {
      selectedItems: []
    }
  }

  componentDidMount = () => {
    const path = this.props.path[0]
    if(path.steps.length > 1) {
      const pathUid = path.details.properties.uid
      const username = this.props.user
      this.props.getCompletedSteps(pathUid, username)
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.path[0] !== this.props.path[0]){
      const pathUid = nextProps.path[0].details.properties.uid
      const username = this.props.user

      this.props.getCompletedSteps(pathUid, username)
    }
  }

  handleDropdownClick = (step) => {
    this.setState((prevState) => {
      return {
        selectedItems: prevState.selectedItems.filter((el) => el !== step)
      }
    })
  }

  handleCollapseClick = (step) => {
    this.setState((prevState) => {
      return {
        selectedItems: prevState.selectedItems.concat([step])
      }
    })
  }

  handleCompletedClick = stepUrl => async () => {
    const pathUid = this.props.path[0].details.properties.uid
    const username = this.props.user
    const bool = await this.checkForComplete(stepUrl)

    this.props.toggleStepCompletion(pathUid, username, stepUrl, bool)
  }

  handleDeletePath = (event) => {
    event.preventDefault()
    const pathName = this.props.path[0].details.properties.name
    const uid = this.props.path[0].details.properties.uid
    if (window.confirm(`Are you sure you want to delete ${pathName}?`)){
      this.props.deleteSinglePath(uid)
    }
  }

  checkForComplete = (url) => {
    const completedSteps = this.props.completedSteps
    let found = false

    for(let i = 0; i < completedSteps.length; i++) {
      const stepUrl = completedSteps[i].stepUrl
      if(stepUrl === url && completedSteps[i].completed) {
        found = true
        break
      }
    }

    return found
  }

  getCompletePercentage = () => {
    const steps = this.props.completedSteps
    const total = this.props.completedSteps.length
    let completed = 0

    if(steps.length === 0) {
      return 0
    } else {
      steps.forEach(step => step.completed ? completed++ : '')
      return Math.round( (completed / total) * 100 )
    }
  }

  render(){
    const { user, path } = this.props
    const pathDetails = path[0].details.properties
    const pathSteps = path[0].steps
    return (
      <div>
        <h3>
          { pathDetails.status === 'draft' &&
            <Chip label='owner' style={styles.chip}/>
          }
          {pathDetails.name}
        </h3>
        <p>{pathDetails.description}</p>

        { pathSteps[0].step !== null &&
          <PathProgress progress={this.getCompletePercentage()} />
        }

        <div style={styles.container}>
          <List>
            { pathSteps[0].step !== null &&
              pathSteps.map(step => {
                const stepUrl = step.resource.properties.url
                const resourceImg = step.resource.properties.imageUrl
                return (
                <div key={stepUrl}>
                  <ListItem
                    key={stepUrl}
                    role={undefined}
                    dense
                    button
                    disableRipple
                  >
                    <Checkbox
                      onChange={this.handleCompletedClick(stepUrl)}
                      checked={this.checkForComplete(stepUrl)}
                      disableRipple
                    />

                    {
                      <img src={resourceImg ? resourceImg : "../../default.png"} width={75} />
                    }

                    <ListItemText primary={step.resource.properties.name} />

                    {this.state.selectedItems.indexOf(stepUrl) !== -1 ?
                      <ExpandLess
                        onClick={() => this.handleDropdownClick(stepUrl)}
                      /> :
                      <ExpandMore
                        onClick={() => this.handleCollapseClick(stepUrl)}
                      />
                    }

                  </ListItem>

                  <Collapse
                    in={this.state.selectedItems.indexOf(stepUrl) !== -1}
                    timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <ListItem button>
                        <ul>
                          <li>Description: {step.resource.properties.description}</li>
                          <li>Visit resource: <a href={step.resource.properties.url} target="_blank">{step.resource.properties.name}</a></li>
                        </ul>
                      </ListItem>
                    </List>
                  </Collapse>

                  </div>
                )
            } ) }

          { path[0].details.properties.owner === user &&
            <AddResource user={user} path={path} />
          }

          </List>

        </div>

        { path[0].details.properties.owner === user &&
          <div>
            <Button
              style={styles.deleteButton}
              onClick={this.handleDeletePath}
              variant="outlined"
              color="secondary"
            >
            Delete Path
            </Button>

            <PathToggleStatus
              toggleStatus={this.state.toggleStatus}
              style={styles.status} />

          </div>
        }

      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    completedSteps: state.step.completedSteps
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteSinglePath: (uid) => {
      dispatch(deleteSinglePathThunk(uid))
    },
    getCompletedSteps: (pathUid, username) => {
      dispatch(getStepCompletionSingleUserThunk(pathUid, username))
    },
    toggleStepCompletion: (pathUid, username, stepUrl, bool) => {
      dispatch(toggleStepCompletionThunk(pathUid, username, stepUrl, bool))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SinglePath)

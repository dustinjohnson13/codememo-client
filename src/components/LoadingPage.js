//@flow
import React, { Component } from 'react'
import Spinner from 'react-spin'

type Props = {
  +nospin: boolean
}

class LoadingPage extends Component<Props, void> {

  rawMarkup () {
    var spinner = new Spinner().spin()
    return {__html: spinner}
  }

  render () {
    if (this.props.nospin) {
      return <div></div>
    } else {
      var spinCfg = {
        width: 12,
        radius: 35
      }
      return <Spinner config={spinCfg}/>
    }
  }
}

export default LoadingPage

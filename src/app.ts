import { Component } from 'react'
import './app.less'

class App extends Component {
  constructor(props) {
    super(props);
    wx.cloud.init({
      // traceUser:true,
      // env:'tianfang-prod-q4y3q'
      env:'tianfang-test-dfn71'
    });
  }

  componentDidMount () {

  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // this.props.children 是将要会渲染的页面
  render () {
    return this.props.children
  }
}

export default App

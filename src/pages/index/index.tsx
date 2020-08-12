import React, { Component } from 'react';
import { View, Text } from '@tarojs/components';
import { AtButton,AtFab,AtRate } from 'taro-ui';
import "taro-ui/dist/style/components/button.scss" // 按需引入
import "taro-ui/dist/style/components/rate.scss";
import "taro-ui/dist/style/components/icon.scss";
import './index.less';
import Taro from '@tarojs/taro';

interface IndexState {

  value: number;

}
export default class Index extends Component<any,IndexState> {
  constructor (props) {
    super(props)
    this.state = {
      value: 2
    }
  }
  handleChange (value) {
    this.setState({
      value
    })
  }
  componentWillMount () { }

  componentDidMount () {
    wx.cloud.init({
      // traceUser:true,
    });
    const db = wx.cloud.database();
    const suggestions = db.collection('suggestions');
    suggestions.get().then(res => {
      // res.data 包含该记录的数据
      console.log(res.data)
    });
    // console.log(wx);
    this.getLogin()
  }
  getLogin () {
    Taro.cloud
        .callFunction({
            name: "prod",
            data: {}
        })
        .then(res => {
            const context1 = JSON.stringify(res.result);
            console.log(context1)
        })
}
  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Text>Hello world!</Text>
        <AtButton type='primary'>I need Taro UI</AtButton>
        <Text>Taro UI 支持 Vue 了吗？</Text>
        <AtButton type='primary' circle={true}>支持</AtButton>
        <AtRate
        size={30}
        value={this.state.value}
        onChange={this.handleChange.bind(this)}
      />
      </View>
    )
  }
}

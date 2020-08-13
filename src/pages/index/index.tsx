import React, { Component } from 'react';
import { View, Text } from '@tarojs/components';
import { AtButton,AtRate,AtTextarea,AtMessage } from 'taro-ui';
import "taro-ui/dist/style/components/flex.scss";
import "taro-ui/dist/style/components/button.scss"; // 按需引入
import "taro-ui/dist/style/components/rate.scss";
import "taro-ui/dist/style/components/icon.scss";
import "taro-ui/dist/style/components/textarea.scss";
import "taro-ui/dist/style/components/message.scss";
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
    wx.setNavigationBarTitle({
      title: "建议反馈"
    })
  }
  handleChange (value) {
    this.setState({
      value
    })
  }

  handleClick (type?) {
    Taro.atMessage({
      'message': '消息通知',
      'type': type,
    })
  }

  componentDidMount () {
    this.handleClick()
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
    wx.cloud
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
        <AtMessage />

        <AtRate
          size={30}
          value={this.state.value}
          onChange={this.handleChange.bind(this)}
        />
        <View style='height:30px' />
        <AtTextarea
          value={this.state.value}
          onChange={this.handleChange.bind(this)}
          maxLength={200}
          placeholder='你的问题是...'
          height={250}
        />
        <View style='height:20px' />
        <View className='at-row at-row__justify--center at-row__align--center'>
          <AtButton
            type='secondary'
            circle
          >清除已输入</AtButton>
          <AtButton
            type='primary'
            circle
          >提交</AtButton>
        </View>

      </View>

    )
  }
}

import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton,AtFab } from 'taro-ui'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './index.less'

export default class Index extends Component {

  componentWillMount () { }

  componentDidMount () {
    wx.cloud.init();
    const db = wx.cloud.database();
    const suggestions = db.collection('suggestions');
    suggestions.get().then(res => {
      // res.data 包含该记录的数据
      console.log(res.data)
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
        <Text>共建？</Text>
      </View>
    )
  }
}

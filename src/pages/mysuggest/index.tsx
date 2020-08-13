import React, { Component } from 'react';
import { View, Text } from '@tarojs/components';
import { AtCard,AtMessage } from 'taro-ui';
// import "taro-ui/dist/style/components/flex.scss";
import "taro-ui/dist/style/components/card.scss";
import "taro-ui/dist/style/components/message.scss";

import './index.less';
import Taro from '@tarojs/taro';


interface IndexState {
  listData: {
    content:string,
    date:number
  }[];
}
export default class Index extends Component<any,IndexState> {
  constructor (props) {
    super(props)
    this.state = {
      listData :[]
    }
  }

  componentDidMount () {
    const db = wx.cloud.database();
    const suggestions = db.collection('suggestions');
    suggestions.orderBy('date', 'desc').get().then(res => {
      if(!res.data || !res.data.length){
        Taro.atMessage({
          'message': '暂无提交数据',
          'type': "error",
          'duration':700
        })
      }else{
        this.setState({
          listData: res.data
        })
      }
    });
  }

  componentWillUnmount () { }

  formatTime(dateNum) {
    const date = new Date(parseInt(dateNum));
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(this.formatNumber).join('/') + ' ' + [hour, minute, second].map(this.formatNumber).join(':')
  }

  formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n
  }

  render () {
    const listData = this.state.listData;
    return (
      <View className='mysuggests'>
        <AtMessage />
        {
          listData.map((item,index)=>{
            return <View
              key={index}
              className='suggestItem'
            >
              <AtCard
                title={`${this.formatTime(item.date)}`}
              >
                {item.content}
              </AtCard>
            </View>

          })
        }

      </View>

    )
  }
}

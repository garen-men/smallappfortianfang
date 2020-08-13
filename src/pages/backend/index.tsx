import React, { Component } from 'react';
import { View, Text } from '@tarojs/components';
import { AtButton,AtRate,AtTextarea,AtModal } from 'taro-ui';
import "taro-ui/dist/style/components/flex.scss";
import "taro-ui/dist/style/components/button.scss"; // 按需引入
import "taro-ui/dist/style/components/rate.scss";
import "taro-ui/dist/style/components/icon.scss";
import "taro-ui/dist/style/components/textarea.scss";
import "taro-ui/dist/style/components/modal.scss";
import './index.less';
import Taro from '@tarojs/taro';

interface IndexState {
  listData: {
    content:string,
    date:number
  }[];
  islogin:boolean;

}

export default class Index extends Component<any,IndexState> {
  constructor (props) {
    super(props)
    this.state = {
      islogin:undefined,
      listData:[]
    }
  }


  // handleClick (type?) {
  //   Taro.atMessage({
  //     'message': '消息通知',
  //     'type': type,
  //   })
  // }

  componentDidMount () {
    wx.cloud
        .callFunction({
            name: "removeall",
            data: {}
        })
        .then(res => {
            const context1 = JSON.stringify(res);
            console.log(context1,1)
        })



    wx.cloud
        .callFunction({
            name: "prod",
            data: {}
        })
        .then(res => {
          this.setState({
            islogin: res.result.manager
          })
          
        })

  }
  componentWillUnmount () { }


  render () {
    if(this.state.islogin === undefined){
      return <Text>loading</Text>
    }
    if(this.state.islogin === false){
      return <Text>您不是管理员</Text>
    }
    return (
      <View className='backend-page'>
        <Text>总评分: </Text>

        {/*<View style='height:30px' />*/}
        {/*<Text>反馈</Text>*/}
        {/*<Text>匿名评论，不会获取包括昵称、头像在内的任何隐私信息</Text>*/}
        {/*<AtTextarea*/}
        {/*  value={this.state.comment}*/}
        {/*  onChange={this.handleCommentChange.bind(this)}*/}
        {/*  maxLength={200}*/}
        {/*  placeholder='您的反馈是...'*/}
        {/*  height={250}*/}
        {/*/>*/}
        {/*<View style='height:20px' />*/}
        {/*<View className='at-row at-row__justify--center at-row__align--center'>*/}
        {/*  <AtButton*/}
        {/*    type='secondary'*/}
        {/*    circle*/}
        {/*  >查看我的反馈</AtButton>*/}
        {/*  <AtButton*/}
        {/*    type='primary'*/}
        {/*    circle*/}
        {/*    onClick={this.clickSubmit}*/}
        {/*  >提交</AtButton>*/}
        {/*</View>*/}
        {/*<View className='skip-backend'>*/}
        {/*  /!*<View style='height:100px' className='at-col'>D</View>*!/*/}
        {/*  <Text>{">>转到后台管理页面"}</Text>*/}
        {/*</View>*/}
        {/*<AtModal*/}
        {/*  isOpened={this.state.isOpen}*/}
        {/*  cancelText='取消'*/}
        {/*  confirmText='确认'*/}
        {/*  onClose={this.handleClose}*/}
        {/*  onCancel={this.handleClose}*/}
        {/*  onConfirm={this.handleConfirm}*/}
        {/*  content='确定要提交吗，提交后不可修改'*/}
        {/*/>*/}
      </View>

    )
  }
}

import React, { Component } from 'react';
import { View, Text } from '@tarojs/components';
import { AtButton,AtRate,AtTextarea,AtMessage,AtModal } from 'taro-ui';
import "taro-ui/dist/style/components/flex.scss";
import "taro-ui/dist/style/components/button.scss"; // 按需引入
import "taro-ui/dist/style/components/rate.scss";
import "taro-ui/dist/style/components/icon.scss";
import "taro-ui/dist/style/components/textarea.scss";
import "taro-ui/dist/style/components/message.scss";
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
      islogin:false,
      listData:[]
    }
    // wx.setNavigationBarTitle({
    //   title: "建议反馈"
    // })
  }


  handleClick (type?) {
    Taro.atMessage({
      'message': '消息通知',
      'type': type,
    })
  }

  componentDidMount () {
    // wx.cloud
    //     .callFunction({
    //         name: "removeall",
    //         data: {}
    //     })
    //     .then(res => {
    //         const context1 = JSON.stringify(res);
    //         console.log(context1)
    //     })
  }
  componentWillUnmount () { }


  handleClose=()=>{
    this.setState({
      isOpen:false
    })
  }
  handleConfirm=()=>{
    //db 发送
    // 发送时禁用提交按钮,
    // 返回成功 显示消息  清空输入 打开提交
    // 返回失败 显示x消息  打开提交
  }
  clickSubmit=()=>{
    this.setState({
      isOpen:true
    })
  }

  render () {
    return (
      <View className='backend-page'>
        <AtMessage />
        <Text>总评分: </Text>

        {/*  size={30}*/}
        {/*  margin={10}*/}
        {/*  value={this.state.rate}*/}
        {/*  onChange={this.handleRateChange.bind(this)}*/}
        {/*/>*/}
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

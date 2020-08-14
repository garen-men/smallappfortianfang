import React, { Component } from 'react';
import { View, Text } from '@tarojs/components';
import { AtButton,AtRate,AtTextarea,AtMessage,AtModal,AtInput,AtTag } from 'taro-ui';
import "taro-ui/dist/style/components/flex.scss";
import "taro-ui/dist/style/components/button.scss"; // 按需引入
import "taro-ui/dist/style/components/rate.scss";
import "taro-ui/dist/style/components/icon.scss";
import "taro-ui/dist/style/components/textarea.scss";
import "taro-ui/dist/style/components/message.scss";
import "taro-ui/dist/style/components/modal.scss";
import "taro-ui/dist/style/components/input.scss";
import "taro-ui/dist/style/components/tag.scss";
import './index.less';
import Taro from '@tarojs/taro';

interface IndexState {
  isOpen: boolean;
  rate: number;
  comment:string;
  disableBtn: boolean;
  name: string;
  label:string;
  usualTips:string;
}

export default class Index extends Component<any,IndexState> {
  constructor (props) {
    super(props)
    this.state = {
      isOpen:false,
      rate: 5,
      comment: "",
      disableBtn:false,
      name: "",
      label:"",
      usualTips:""
    }
    const db = wx.cloud.database();
    const rates = db.collection('rates');
    rates.get().then(ratecol => {
      if(ratecol.data && ratecol.data.length===1){
        this.setState({
          rate:ratecol.data[0].rate,
        })
      }
    })
  }
  handleRateChange (rate) {
    this.setState({
      rate
    })
  }
  handleNameChange(name) {
    this.setState({
      name
    })
  }
  handleLabelChange({name}){
    this.setState({
      label:name
    })
  }
  handleCommentChange (comment) {
    this.setState({
      comment
    })
  }

  async componentDidMount () {
    const usual= await wx.cloud.callFunction({
      name: "getUsual",
      data: {}
    })
    this.setState({
      usualTips:usual.result.tip
    })
  }

  componentWillUnmount () { }

  handleClose=()=>{
    this.setState({
      isOpen:false
    })
  }
  handleConfirm=()=>{
    // 关闭弹框 & 发送前禁用提交按钮
    this.setState({
      isOpen:false,
      disableBtn:true
    })
    // db 发送
    const db = wx.cloud.database();
    const suggestions = db.collection('suggestions');
    const rates = db.collection('rates');
    suggestions.add({
      data:{
        content:this.state.comment.trim(),
        date:+ new Date(),
        name:this.state.name.trim(),
        label:this.state.label
      }
    }).then(res=>{
      // 返回成功 显示消息  清空输入 打开提交
      // 返回失败 显示x消息  打开提交
      Taro.atMessage({
        'message': '提交成功',
        'type':'info',
        'duration':700
      })
      this.setState({
        disableBtn:false,
        comment:""
      })

      // 评分的逻辑
      rates.get().then(ratecol => {
        if(ratecol.data && ratecol.data.length===0){
          rates.add({
            data:{
              rate:this.state.rate,
              date:+ new Date()
            }
          })
        }
        else if(ratecol.data && ratecol.data.length===1){
          rates.doc(ratecol.data[0]['_id']).update({
            data: {
              rate:this.state.rate,
              date:+ new Date()
            }
          })
        }
        else{

        }
      })

    }).catch(e=>{
      Taro.atMessage({
        'message': '提交失败',
        'type': "error",
        'duration':700
      })
      this.setState({
        disableBtn:false
      })
    })

  }

  clickSubmit=()=>{
    if(this.state.comment.trim() === "" ){
      Taro.atMessage({
        'message': '请输入内容',
        'type': 'error',
        'duration':700
      })
    }else if(this.state.label === "" ){
      Taro.atMessage({
        'message': '请输入类型',
        'type': 'error',
        'duration':700
      })
    }
    else{
      this.setState({
        isOpen:true
      })
    }
  }

  clickSuggestion=()=>{
    Taro.navigateTo({
      url: '/pages/mysuggest/index'
    })
  }

  clickBackend=()=>{
    Taro.navigateTo({
      url: '/pages/backend/index'
    })
  }

  render () {
    return (
      <View className='index'>
        <AtMessage />
        <Text className='large'>{`说明：${this.state.usualTips || '无'}`}</Text>
        <Text className='large'>评分：</Text>
        <View className='large'>
        <AtRate
          size={30}
          margin={10}
          value={this.state.rate}
          onChange={this.handleRateChange.bind(this)}
        />
        </View>
        <AtInput
          name='value'
          title='昵称：'
          type='text'
          placeholder='可选填'
          border={false}
          value={this.state.name}
          onChange={this.handleNameChange.bind(this)}
        />
        <View className='at-row at-row__justify--between at-row__align--center'>
          <Text className='large'>类型：</Text>
          <AtTag
            name='训练'
            type='primary'
            circle
            active={this.state.label === '训练'}
            onClick={this.handleLabelChange.bind(this)}
          >
            训练
          </AtTag>
          <AtTag
            name='管理'
            type='primary'
            circle
            active={this.state.label === '管理'}
            onClick={this.handleLabelChange.bind(this)}
          >
            管理
          </AtTag>
          <AtTag
            name='后勤'
            type='primary'
            circle
            active={this.state.label === '后勤'}
            onClick={this.handleLabelChange.bind(this)}
          >
            后勤
          </AtTag>
          <AtTag
            name='其它'
            type='primary'
            circle
            active={this.state.label === '其它'}
            onClick={this.handleLabelChange.bind(this)}
          >
            其它
          </AtTag>
        </View>
        <View style='height:10px' />

        <Text className='large'>反馈：</Text>
        <Text className='small'>匿名评论，不会获取包括昵称、头像在内的任何隐私信息</Text>
        <AtTextarea
          value={this.state.comment}
          onChange={this.handleCommentChange.bind(this)}
          maxLength={500}
          placeholder='您的反馈是...'
          height={250}
        />
        <View style='height:20px' />
        <View className='at-row at-row__justify--center at-row__align--center'>
          <AtButton
            type='secondary'
            circle
            onClick={this.clickSuggestion}
          >查看我的反馈</AtButton>
          <AtButton
            type='primary'
            circle
            onClick={this.clickSubmit}
            disabled={this.state.disableBtn}
          >提交</AtButton>
        </View>
        <View className='skip-backend' onClick={this.clickBackend}>
          <Text className='small'>{">>转到后台管理页面"}</Text>
        </View>
        <AtModal
          isOpened={this.state.isOpen}
          cancelText='取消'
          confirmText='确认'
          title='确定要提交吗,提交后不可修改'
          onClose={this.handleClose}
          onCancel={this.handleClose}
          onConfirm={this.handleConfirm}
        />
      </View>

    )
  }
}

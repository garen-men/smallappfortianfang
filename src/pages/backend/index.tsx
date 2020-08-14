import React, { Component } from 'react';
import { View, Text } from '@tarojs/components';
import {AtButton, AtCard, AtInput,AtToast} from 'taro-ui';
import "taro-ui/dist/style/components/flex.scss";
import "taro-ui/dist/style/components/button.scss"; // 按需引入
import "taro-ui/dist/style/components/card.scss";
import "taro-ui/dist/style/components/input.scss";
import "taro-ui/dist/style/components/toast.scss";
import './index.less';


interface IndexState {
  listData: {
    content:string,
    date:number,
    name:string,
    label:string
  }[];
  islogin:boolean;
  rate:number;
  notice:string;
  sunmitbtn:boolean;
}

export default class Index extends Component<any,IndexState> {
  constructor (props) {
    super(props)
    this.state = {
      islogin:undefined,
      listData:[],
      rate:0,
      notice:"",
      sunmitbtn:false
    }
  }


  async componentDidMount () {
    // wx.cloud
    //     .callFunction({
    //         name: "removeall",
    //         data: {}
    //     })
    //     .then(res => {
    //         const context1 = JSON.stringify(res);
    //         console.log(context1,1)
    //     })

    const res = await wx.cloud.callFunction({
            name: "prod",
            data: {}
        })
    this.setState({
      islogin: res.result.manager
    })
    const rateres = await wx.cloud.callFunction({
      name: "calrate",
      data: {}
    })
    this.setState({
      rate: rateres.result.rate || 0
    })
    const  alldata= await wx.cloud.callFunction({
      name: "getAlldata",
      data: {}
    })
    this.setState({
      listData: alldata.result.data
    })
  }
  componentWillUnmount () { }
  changeNotice(notice){
    this.setState({
      notice
    })
  }
  onsubmit= async ()=>{
    await wx.cloud.callFunction({
      name: "upNotice",
      data: {
        notice: this.state.notice
      }
    })
    this.setState({
      sunmitbtn:true
    })
  }
  onreset = ()=>{
    this.setState({
      notice:""
    })
  }

  render () {
    if(this.state.islogin === undefined){
      return <Text>loading</Text>
    }
    if(this.state.islogin === false){
      return <Text>您不是管理员</Text>
    }
    const listData = this.state.listData;
    return (
      <View className='backend-page'>
        <AtToast isOpened={this.state.sunmitbtn} text='成功' duration={500}></AtToast>
        <Text>{"总评分: " + this.state.rate}</Text>
        <View>
          <AtInput
            name='value'
            title='自定义说明'
            type='text'
            placeholder='提交后可展示在首页,也可不填'
            border={false}
            value={this.state.notice}
            onChange={this.changeNotice.bind(this)}
          />
          <View className='changenotice at-row at-row__justify--center at-row__align--center'>
          <AtButton  onClick={this.onreset}>重置</AtButton>
            <AtButton type='primary' onClick={this.onsubmit}>提交</AtButton>
          </View>
        </View>

        {
          listData.map((item,index)=>{
            const lastId = item['_openid'].substr(item['_openid'].length-4);
            const itemName = item.name ? item.name : (`游客${lastId}`);
            return <View
              key={index}
              className='suggestItem'
            >
              <AtCard
                title={itemName}
                note={`${this.formatTime(item.date)}`}
                extra={item.label || "无"}
              >
                {item.content}
              </AtCard>
              {/*<Text>删除</Text>*/}
            </View>
          })
        }
        <Text>目前最多显示100条记录,待完善</Text>
      </View>
    )
  }

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
}

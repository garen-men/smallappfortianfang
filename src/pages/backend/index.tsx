import React, { Component } from 'react';
import { View, Text } from '@tarojs/components';
import { AtButton, AtCard, AtInput, AtDivider, AtTag, AtIcon, AtModal} from 'taro-ui';
import "taro-ui/dist/style/components/flex.scss";
import "taro-ui/dist/style/components/button.scss"; // 按需引入
import "taro-ui/dist/style/components/card.scss";
import "taro-ui/dist/style/components/input.scss";
import "taro-ui/dist/style/components/divider.scss";
import "taro-ui/dist/style/components/tag.scss";
import "taro-ui/dist/style/components/icon.scss";
import "taro-ui/dist/style/components/modal.scss";

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
  sunmitbtn: boolean;
  dlebtn: boolean;
  label: string;
  count: number;
  countall: number;
  countperson: number;
}

export default class Index extends Component<any, IndexState> {

  private willDelId

  constructor (props) {
    super(props)
    this.state = {
      islogin:undefined,
      listData:[],
      rate:0,
      notice:"",
      sunmitbtn: false,
      dlebtn: false,
      label: "",
      count: 0,
      countall: 0,
      countperson: 0,
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
    if (this.state.islogin) {
      const alldataPromise = wx.cloud.callFunction({
        name: "getAlldata",
        data: {
          limit:10,
          offset:0,
          login:true
        }
      })

      const ratePromise =  wx.cloud.callFunction({
        name: "calrate",
        data: {}
      })

      const alldata = await alldataPromise;
      const rateres = await ratePromise;

      this.setState({
        listData: alldata.result.data,
        rate: rateres.result.rate || 0,
        count: rateres.result.count || 0,
        countall: rateres.result.countall || 0,
        countperson: rateres.result.countperson || 0,
      })
    }

  }
  componentWillUnmount() { }

  changeNotice(notice){
    this.setState({
      notice
    })
  }
  handleLabelChange({name}) {
    this.setState({
      label: name
    });
    wx.cloud.callFunction({
      name: "getAlldata",
      data: {
        limit: 10,
        offset: 0,
        label: name,
      }
    }).then((res) => {
      this.setState({
        listData: res.result.data
      })
    })
  }
  onsubmit= async ()=>{
    this.setState({
      sunmitbtn:true
    })
  }
  handleClose = () => {
      this.setState({
        sunmitbtn: false
      })
  }
  handleNoticeConfirm = async() => {
    this.setState({
      sunmitbtn: false
    })
    await wx.cloud.callFunction({
      name: "upNotice",
      data: {
        notice: this.state.notice
      }
    })
    wx.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 700
    })
  }
  onreset = ()=>{
    this.setState({
      notice:""
    })
  }

  deleteitem(id) {
    // console.log('%ccomponentDid1Show: ', 'color: MidnightBlue; background: Aquamarine; font-size: 20px;',id);
    this.willDelId = id;
    this.setState({
      dlebtn: true
    })
  }
  handleDelClose = () => {
    this.setState({
      dlebtn: false
    })
  }
  handleDelConfirm = () => {
    this.setState({
      dlebtn: false
    })
    if (!this.willDelId) {
      return
    }
    wx.cloud.callFunction({
      name: "delitem",
      data: {
        id: this.willDelId
      }
    }).then((res) => {
      wx.showToast({
        title: res.result.msg || "",
        icon: 'success',
        duration: 700
      })

    })
    this.willDelId = undefined;
  }

  render() {
    if (this.state.islogin === undefined) {
      return <Text>loading</Text>
    }
    if (this.state.islogin === false) {
      return <Text>您不是管理员</Text>
    }
    const listData = this.state.listData;
    return (
      <View className='backend-page'>
        <AtModal
          isOpened={this.state.sunmitbtn}
          title='提交公告'
          cancelText='取消'
          confirmText='确认'
          onClose={this.handleClose}
          onCancel={this.handleClose}
          onConfirm={this.handleNoticeConfirm}
          content='一但提交，将会推送给全体人员，内容会覆盖首页说明区域'
        />
        <AtModal
          isOpened={this.state.dlebtn}
          title='删除指定记录'
          cancelText='取消'
          confirmText='确认'
          onClose={this.handleDelClose}
          onCancel={this.handleDelClose}
          onConfirm={this.handleDelConfirm}
          content='谨慎，一旦删除，该条数据无法找回'
        />
        <AtDivider content='首页设置' fontColor='#2d8cf0' lineColor='#2d8cf0' />
        <Text className='large'>{"总评分: " + this.state.rate}</Text>
        <View >
          <AtInput
            name='value'
            title='自定义说明'
            type='text'
            placeholder='提交后可展示在首页,也可不填'
            border={false}
            value={this.state.notice}
            onChange={this.changeNotice.bind(this)}
          />
          <View className='at-row at-row__justify--center at-row__align--center'>
            <AtButton  onClick={this.onreset} size={'small'}>重置</AtButton>
            <AtButton type='primary' size={'small'} onClick={this.onsubmit}>提交</AtButton>
          </View>
        </View>
        <AtDivider content='列表管理' fontColor='#2d8cf0' lineColor='#2d8cf0' />
        <Text className='large'>{"有 " + this.state.countperson + " 人登录过，共提交了 " + this.state.countall + " 条建议"}</Text>
        <Text className='large'>{"截至上次查看，又新增了 " + this.state.count + " 条建议"}</Text>
        <View className='tagview at-row at-row__justify--between at-row__align--center'>
          <AtTag
            name=''
            type='primary'
            circle
            active={this.state.label === ''}
            onClick={this.handleLabelChange.bind(this)}
          >
            全部
          </AtTag>
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
        {
          listData.map((item,index)=>{
            const lastId = item['_openid'].substr(item['_openid'].length-4);
            const itemName = item.name ? (`游客${lastId}-${item.name}`) : (`游客${lastId}`);
            return <View
              key={index}
              className='suggestItem'
            >
              <AtCard
                title={itemName}
                note={`${this.formatTime(item.date)}`}
                extra={item.label || "无"}
              >
                {this.decrypt(item.content)}
              </AtCard>
              {/* <View className='itemdelete' > */}
                {/* <AtButton type='secondary' size={'small'} onClick={this.onsubmit}>删除</AtButton> */}
              <AtIcon value='trash' size='20' color='#F00' onClick={this.deleteitem.bind(this, item['_id'])}></AtIcon>
              {/* </View> */}
            </View>
          })
        }
        <Text>目前最多显示100条记录,待完善</Text>
        <Text>拉黑用户功能,待增加</Text>
        <Text>统计各类型数量展示角标功能,待增加</Text>
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

  private decrypt = (str) => {
    if (typeof str !== 'string' || !str) {
      return ''
    }
    let newstr = '';
    for (let i = 0; i < str.length; i++) {
      newstr += String.fromCharCode(str.charCodeAt(i) - 9)
    }
    return newstr
  }
}

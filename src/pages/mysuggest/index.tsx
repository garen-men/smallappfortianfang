import React, { Component } from 'react';
import { View, Text } from '@tarojs/components';
import { AtCard,AtToast } from 'taro-ui';
import "taro-ui/dist/style/components/card.scss";
import "taro-ui/dist/style/components/toast.scss";
import './index.less';


interface IndexState {
  listData: {
    _id:DB.DocumentId;
    content:string,
    date:number
  }[] | DB.IDocumentData;
  isOpenToast:boolean;

}
export default class Index extends Component<any,IndexState> {
  constructor (props) {
    super(props)
    this.state = {
      listData :[],
      isOpenToast:false
    }
  }

  componentDidMount () {
    const db = wx.cloud.database();
    const suggestions = db.collection('suggestions');
    suggestions.orderBy('date', 'desc').get().then(res => {
      if(!res.data || !res.data.length){
        this.setState({
          isOpenToast:true
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
          <AtToast
            isOpened={this.state.isOpenToast}
            text="暂无提交数据"
            status="error"
            duration={1500}
            ></AtToast>        {
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

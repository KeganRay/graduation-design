import React, { Component } from 'react';
import { Button } from 'antd';
import { sendtest } from '../../services/services';

class HouseDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  //
  sendaxios = () => {
    const param = {
      account: 'admin',
      password: 'admin123',
    };
    sendtest(param).then((res) => {
      console.log('请求结果：', res);
    });
  };

  render() {
    return (
      <div>
        <h1>详情页</h1>
        <Button onClick={this.sendaxios}>发请求</Button>
      </div>
    );
  }
}

export default HouseDetail;

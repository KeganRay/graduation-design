import React, { Component, useState } from 'react';
import { Alert, message, Tabs, Modal, Form, Input, Radio, Button, Select, Popover, Progress } from 'antd';
import { SmileTwoTone, HeartTwoTone, CheckCircleTwoTone } from '@ant-design/icons';
import styles from './index.less';
import * as services from './services';
import { registeuser } from './services';

const { Option } = Select;

class Register extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      isRegister: false,//是否弹出注册框
      visible: false,
      sex: null,//性别(Number) 男1女0
      sexDetail: '',//性别中文(String)
      Aftermail: '@qq.com',//邮箱后缀
    };
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  //显示注册弹框
  handleRegister = () => {
    this.setState({ isRegister: true });
  };

  //性别的更改
  handleSexChange = (value) => {
    if (value) {
      if (value.target.value === '1') {
        this.setState({ sex: value.target.value, sexDetail: '男' });
      } else if (value.target.value === '0') {
        this.setState({ sex: value.target.value, sexDetail: '女' });
      }
    }
  };

  //注册提交
  handleFinish = () => {
    console.log(this.state.Aftermail);
    this.formRef.current.validateFields().then((values) => {
      const param = {
        ...values,
        email: `${values.email}${this.state.Aftermail}`,
      };

      services.registeuser(param).then((res) => {
        if (res && res.data && res.data.code === 0) {
          message.success(
            {
              content:'注册成功',
              icon:<SmileTwoTone />,
              onClose:()=>{ this.setState({ isRegister: false });}
            });
        }
      });
    }).catch(error => {
      console.log(error);
    });
  };

  render() {
    //字段布局方式
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 8 },
    };
    const { isRegister } = this.state;
    //邮箱后缀
    const selectAfter = (
      <Select
        name={'mail'}
        defaultValue='@qq.com'
        className='select-after'
        onChange={(value) => {
          this.setState({ Aftermail: value }, () => {
            console.log(this.state.Aftermail);
          });
        }}>
        <Option value='@qq.com'>@qq.com</Option>
        <Option value='@163.com'>@163.com</Option>
        <Option value='@126.com'>@126.com</Option>
        <Option value='@sina.com'>@sina.com</Option>
        <Option value='@gmail.com'>@gmail.com</Option>
      </Select>
    );

    return (
      <div>
        <Modal
          okText={'注册'}
          maskClosable={false}
          visible={isRegister}
          width={'1000px'}
          title={<div>注册用户</div>}
          onOk={this.handleFinish}
          onCancel={() => {
            this.formRef.current.resetFields();//重置
            this.setState({ isRegister: false });
          }}
        >
          <Form {...layout} ref={this.formRef}>
            <Form.Item label='姓名' name={'name'} rules={[{ required: true, message: '请输入姓名' }]}>
              <Input placeholder='请输入姓名' />
            </Form.Item>
            <Form.Item label='电话号码(作为账号登录)' name={'phone'} rules={[
              { required: true, message: '请输入电话号码' },
              {
                validator: async (rule, value, callback) => {
                  if (value) {
                    if (!/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/.test(value)) {
                      return Promise.reject('请正确输入电话号码');
                    }
                  }
                },
              }]}>
              <Input placeholder='请输入电话号码' />
            </Form.Item>
            <Form.Item label='密码' name={'password'} rules={[{ required: true, message: '请输入密码' }]}>
              <Input.Password placeholder='请输入密码' />
            </Form.Item>
            <Form.Item label='年龄' name={'age'} rules={[{ required: true, message: '请输入年龄' }]}>
              <Input min={1} max={10} placeholder='请输入年龄' />
            </Form.Item>
            <Form.Item label='性别' name={'sex'} rules={[{ required: true, message: '请选择性别' }]}>
              <Radio.Group placeholder='请选择性别' onChange={this.handleSexChange}>
                <Radio value={1}>男</Radio>
                <Radio value={0}>女</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label='身份证号码' name={'IDcardNumber'} rules={[{ required: false }, {
              validator: (rule, value, callback) => {
                if (!/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value)) {
                  callback('请正确输入身份证号码');
                }
                callback();
              },
            }]}>
              <Input placeholder='请输入身份证号码' />
            </Form.Item>
            <Form.Item label='邮箱' name={'email'} rules={[{ required: false }]}>
              <Input placeholder='请填写邮箱' addonAfter={selectAfter} />
            </Form.Item>
            <Form.Item label='联系地址' name={'ContactAddress'} rules={[{ required: false }]}>
              <Input placeholder='请填写联系地址' />
            </Form.Item>
            <Form.Item label='用户类型' name={'userType'} rules={[{ required: true, message: '请选择用户类型' }]}>
              <Radio.Group placeholder='请选择用户类型'>
                <Radio value={1}>房东</Radio>
                <Radio value={2}>租客</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Register;


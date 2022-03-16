import React, { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, Upload, message, Form, Radio } from 'antd';
import ProForm, {
  ProFormDependency,
  ProFormFieldSet,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { useModel, useRequest } from 'umi';
import { queryCurrent } from '../service';
import { queryProvince, queryCity } from '../service';
import styles from './BaseView.less';
import * as services from '../services/service';

const validatorPhone = (rule, value, callback) => {
  if (!value[0]) {
    callback('Please input your area code!');
  }

  if (!value[1]) {
    callback('Please input your phone number!');
  }

  callback();
}; // 头像组件 方便以后独立，增加裁剪之类的功能

const AvatarView = ({ avatar }) => (
  <>
    <div className={styles.avatar_title}>头像</div>
    <div className={styles.avatar}>
      <img src={avatar} alt='avatar' />
    </div>
    <Upload showUploadList={false} action={''}>
      <div className={styles.button_view}>
        <Button>
          <UploadOutlined />
          更换头像
        </Button>
      </div>
    </Upload>
  </>
);

const BaseView = () => {
  const [userDetail] = Form.useForm();//房东的公告
  const { initialState, setInitialState } = useModel('@@initialState'); //用于全局管理登陆者信息
  const userInfo = initialState.currentUser;
  const [sex, setSex] = useState(null);
  const [sexDetail, setSexDetail] = useState('');

  //componentdidmount
  useEffect(() => {
    console.log('用户信息：', userInfo);
    userDetail.setFieldsValue({
      ...userInfo,
    });
  }, []);


  /**
   * @Description:提交函数
   * @date 2022/3/16
   */
  const handleFinish = async (values) => {
    const param = {
      userId:userInfo.userId,
      ...values
    }
    await services.updateUserInfo(param).then((res)=>{
      console.log(res);
      if(res&&res.data&&res.data.code===0){
        message.success(res.data.data,1)
      }
    })
  };


  //性别的更改
  const handleSexChange = (value) => {
    if (value) {
      setSex(value.target.value);
      if (value.target.value === '1') {
        setSexDetail('男');
      } else if (value.target.value === '0') {
        setSexDetail('女');
      }
    }
  };

  return (
    <div className={styles.baseView}>
      {(
        <>
          <div className={styles.left}>
            <ProForm
              form={userDetail}
              layout='vertical'
              onFinish={async (values) => {
                await handleFinish(values);
              }}
              submitter={{
                resetButtonProps: {
                  style: {
                    display: 'none',
                  },
                },
                submitButtonProps: {
                  style: {
                    display: 'none',
                  },
                },
              }}
              hideRequiredMark
            >
              <ProFormText
                width='md'
                name='name'
                label='姓名'
                rules={[
                  {
                    required: true,
                    message: '请输入您的姓名!',
                  },
                ]}
              />
              <ProFormText
                width='md'
                name='IDcardNumber'
                label='身份证号码'
                rules={[
                  {
                    required: true,
                    message: '请输入您的身份证号码!',
                  },
                ]}
              />
              <Form.Item label='性别' name={'sex'} rules={[{ required: true, message: '请选择性别' }]}>
                <Radio.Group placeholder='请选择性别' onChange={handleSexChange}>
                  <Radio value={1}>男</Radio>
                  <Radio value={0}>女</Radio>
                </Radio.Group>
              </Form.Item>
              <ProFormText
                width='md'
                name='email'
                label='邮箱'
              />
              <ProFormText
                width='md'
                name='phone'
                label='联系电话'
                rules={[
                  {
                    required: true,
                    message: '请输入您的联系电话!',
                  },
                  {
                    validator: validatorPhone,
                  },
                ]}
              />
              <ProFormText
                width='md'
                name='age'
                label='年龄'
                rules={[
                  {
                    required: true,
                    message: '请输入您的年龄!',
                  },
                ]}
              />
              <ProFormText
                width='xl'
                name='ContactAddress'
                label='联系地址'
                rules={[
                  {
                    required: true,
                    message: '请输入您的联系地址!',
                  },
                ]}
              />
              <Button type='primary' htmlType='submit'>提交</Button>
            </ProForm>
          </div>
          <div className={styles.right}>
            <AvatarView avatar={userInfo.avatar} />
          </div>
        </>
      )}
    </div>
  );
};

export default BaseView;

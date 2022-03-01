import React, { useEffect, useRef, useState } from 'react';
import { Card, Result, Button, Descriptions, Divider, Alert, Statistic, message } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProForm, {
  ProFormUploadButton,
  ProFormDigit,
  ProFormCascader,
  ProFormText,
  StepsForm,
} from '@ant-design/pro-form';
import styles from './style.less';
import addressData from '../../../../../public/addressData';
import { useModel, history } from 'umi';
import * as services from '../../services/services';

const widthData = '750px';

const StepResult = (props) => {
  return (
    <Result
      status='success'
      title='添加房源成功'
      subTitle='请用户登录系统查看'
      extra={
        <>
          <Button type='primary' onClick={props.onFinish}>
            再转一笔
          </Button>
          <Button type='primary' onClick={() => {
            history.push('/houseSummary');
          }}>
            完成
          </Button>
        </>
      }
      className={styles.result}
    >
      {props.children}
    </Result>
  );
};

const StepForm = () => {
  const [stepData, setStepData] = useState({});//每走一步的值
  const [address, setAddress] = useState('');//省市区
  const { initialState } = useModel('@@initialState'); //用于全局管理登陆者信息
  useEffect(() => {
    console.log('stepData:', stepData);
  }, [stepData]);
  /**
   * @param 省市区的值数组
   * @return
   * @Description:房屋地址改变的地址
   * @date 2022--06-27
   */
  const handleAddressChange = (value) => {
    const provinceCode = value[0];//省
    const cityCode = value[1];//市
    const areaCode = value[2];//区
    const province = addressData.filter((target) => {
      return target.value === provinceCode;
    })[0];
    const city = province.children.filter((target) => {
      return target.value === cityCode;
    })[0];
    const area = city.children.filter((target) => {
      return target.value === areaCode;
    })[0];
    if (province && city && area) {
      setAddress(`${province.label}${city.label}${area.label}`);
    }
  };

  /**
   * @param file
   * @Description: 在新的页面预览照片
   * @date 2022--05-27
   */
  const handlePreview = async file => {
    console.log(file);
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  const [current, setCurrent] = useState(0);
  const formRef = useRef();
  return (
    //头顶信息
    <PageContainer content='注册房源：请填写房源信息以及租客信息'>
      <Card bordered={false}>
        <Button style={{ float: 'right' }} onClick={() => {
          history.push('/houseSummary');
        }}>返回</Button>
        <StepsForm
          current={current}
          onCurrentChange={setCurrent}
          submitter={{
            render: (props, dom) => {
              if (props.step === 2) {
                return null;
              }
              return dom;
            },
          }}
        >
          {/*第一步*/}
          <StepsForm.StepForm
            formRef={formRef}
            title='填写房屋信息'
            initialValues={stepData}
            onFinish={async (values) => {
              setStepData({ ...stepData, houseAddress: address, ...values });
              return true;
            }}
          >
            <ProFormText
              label='房屋名字'
              width={widthData}
              name='houseName'
              placeholder={'请填写房屋名字'}
              rules={[
                {
                  required: true,
                  message: '请填写房屋名字',
                },
              ]}
            />

            <ProForm.Group title='房屋地址' size={10}>
              <ProFormCascader
                width={'sm'}
                name='houseEasyAddress'
                fieldProps={{ options: addressData, onChange: handleAddressChange }}
                rules={[
                  {
                    required: true,
                    message: '请选择省市区',
                  },
                ]}
                placeholder={'请填写省市区'}

              >
              </ProFormCascader>


              <ProFormText
                width={'524px'}
                name='houseAddressDetail'
                rules={[
                  {
                    required: true,
                    message: '请填写房屋地址的详情地址',
                  },
                ]}
                placeholder='请填写房屋地址的详情地址'
              />
            </ProForm.Group>

            <ProFormDigit
              label='租金'
              name='housePrice'
              width={widthData}
              rules={[
                {
                  required: true,
                  message: '请输入租金',
                },
                {
                  pattern: /^(\d+)((?:\.\d+)?)$/,
                  message: '请输入合法金额数字',
                },
              ]}
              placeholder='请输入租金'
              fieldProps={{
                prefix: '￥',
              }}
            />

            <ProForm.Group>
              <ProFormDigit
                label='水费标准'
                name='waterPrice'
                rules={[
                  {
                    required: true,
                    message: '请输入水费标准',
                  },
                  {
                    pattern: /^(\d+)((?:\.\d+)?)$/,
                    message: '请输入合法金额数字',
                  },
                ]}
                placeholder='请输入水费标准'
                fieldProps={{
                  prefix: '￥',
                }}
                width={'360px'}
              />
              <ProFormDigit
                label='电费标准'
                name='electricityPrice'
                rules={[
                  {
                    required: true,
                    message: '请输入电费标准',
                  },
                  {
                    pattern: /^(\d+)((?:\.\d+)?)$/,
                    message: '请输入合法金额数字',
                  },
                ]}
                placeholder='请输入电费标准'
                fieldProps={{
                  prefix: '￥',
                }}
                width={'360px'}
              />
            </ProForm.Group>

            <ProFormDigit
              fieldProps={{
                addonAfter: 'm²',
              }}
              label='可用面积'
              width={widthData}
              rules={[
                {
                  required: true,
                  message: '请输入可用面积',
                },
                {
                  pattern: /^(\d+)((?:\.\d+)?)$/,
                  message: '请输入合法金额数字',
                },
              ]}
              name='houseArea'
              placeholder='请输入可用面积'
            />

            <ProFormUploadButton
              name='housePic'
              label='房子的照片'
              max={5}
              fieldProps={{
                name: 'file',
                listType: 'picture-card',
                onPreview: handlePreview,
              }}
              action='/upload.do'
            />
          </StepsForm.StepForm>

          {/*第二步*/}
          <StepsForm.StepForm
            title='填写租客信息'
            onFinish={async (values) => {
              if (initialState.currentUser && values) {
                const { name, phone, userId } = initialState.currentUser;
                const param = {
                  ...stepData,
                  tenantMessage: values,
                  landlordName: name,
                  landlordPhone: phone,
                  landlordId: userId,
                };
                let createResult = null;
                await services.createHouse(param).then((res) => {
                  if (res && res.data.code === 0) {
                    message.success(res.data.message, 2);
                    createResult = true;
                  } else {
                    message.error(res.data.message, 2);
                    createResult = false;
                  }
                });
                if (createResult) {
                  return true;
                }
              }
            }}
          >
            <div className={styles.result}>
              {/*警示信息*/}
              <Alert
                closable
                showIcon
                message='请核对好租客的电话号码以及证件号，否则将无法进行绑定。'
                style={{
                  marginBottom: 24,
                }}
              />

              <ProFormText
                label='租客姓名'
                width={'xl'}
                name='tenantName'
                placeholder={'请填写租客姓名'}
                rules={[
                  {
                    required: true,
                    message: '请填写租客姓名',
                  },
                ]}
              />

              <ProFormText
                label='租客联系方式'
                width={'xl'}
                name='tenantPhone'
                placeholder={'请填写租客联系方式'}
                rules={[
                  {
                    required: true,
                    message: '请填写租客联系方式',
                  },
                ]}
              />

              <ProFormText
                label='租客证件号'
                width={'xl'}
                name='tenantIDcardNumber'
                placeholder={'请填写租客证件号'}
                rules={[
                  {
                    required: true,
                    message: '请填写租客证件号',
                  }, {
                    // validator: async (rule, value, callback) => {
                    //   if (value) {
                    //     if (!/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value)) {
                    //       return Promise.reject('请正确输入身份证号码');
                    //     }
                    //   }
                    // },
                  },
                ]}
              />
              <Divider
                style={{
                  margin: '24px 0',
                }}
              />
            </div>
          </StepsForm.StepForm>

          {/*第三步*/}
          <StepsForm.StepForm title='完成'>
            <StepResult
              onFinish={async () => {
                setCurrent(0);
                formRef.current?.resetFields();
              }}
            >
              {/*<StepDescriptions stepData={stepData} />*/}
            </StepResult>
          </StepsForm.StepForm>
        </StepsForm>

        {/*下面卡片说明*/}
        <Divider
          style={{
            margin: '40px 0 24px',
          }}
        />
        <div className={styles.desc}>
          <h3 style={{ fontWeight: 'bold' }}>说明</h3>
          <p>
            房源的添加必须如实填写个人信息，不能填写昵称或者其他名字，否则无法进行房源绑定。
          </p>
          <p>
            请如实核对房源信息再进行信息的填写，谢谢。
          </p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default StepForm;

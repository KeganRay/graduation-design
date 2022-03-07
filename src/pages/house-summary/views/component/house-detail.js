import {
  DownOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import {
  Button,
  Card,
  Statistic,
  Descriptions,
  Dropdown,
  Menu,
  Modal,
  Image,
  Empty,
  Form,
  DatePicker,
  Divider,
  Input,
  InputNumber,
  message,
} from 'antd';
import { GridContent, PageContainer, RouteContext } from '@ant-design/pro-layout';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import currency from 'currency.js';
import { history } from 'umi';
import styles from './house-detail.less';
import * as services from '../../services/services';
import WaterEle from '../component/WaterEle';

const ButtonGroup = Button.Group;


const houseDetail = () => {
  const waterEleRef = useRef();
  const [houseData, setHouseData] = useState({});//房屋数据
  const [tenantMessage, setTenantMessage] = useState({});//租客数据
  const [tabStatus, seTabStatus] = useState({
    tabActiveKey: 'houseDetail',//头顶tab页的默认值
    operationKey: 'tab2',//下面操作日志的默认值
  });
  const [isShowWE, setisShowWE] = useState(false);//设置是否显示设置水电的弹窗
  const [isShowWEUnit, setisShowWEUnit] = useState(false);//设置是否显示设置水电收费标准弹窗
  const [currentMonth, setCurrentMonth] = useState(moment().format('YYYY-MM'));//当前月份的数据
  const [weType, setWeType] = useState('');//水电弹框的初始值

  //componentDidmount
  useEffect(() => {
    const { houseId } = history.location.query;
    services.queryByhouseId(houseId).then((res) => {
      if (res.data && res.data.code === 0) {
        setHouseData(res.data.data);
        //更新子组件的水电数据
        if (waterEleRef.current) {
          waterEleRef.current.updateWaterData(res.data.data.waterPrice);
          waterEleRef.current.updateEleData(res.data.data.elePrice);
        }
        //查询租客信息
        if (res.data.data.tenantMessage.tenantIDcardNumber) {
          services.queryByIdCardNumber(res.data.data.tenantMessage.tenantIDcardNumber).then((ress) => {
            if (ress && ress.data && ress.data.code === 0) {
              setTenantMessage(ress.data.data[0]);
            }
          });
        }
      }
    });
  }, []);

  const onTabChange = (tabActiveKey) => {
    console.log(tabStatus, tabActiveKey);
    seTabStatus({ ...tabStatus, tabActiveKey });
  };


  /**
   * @Description:显示水电费的弹框
   * @date 2022--19-07
   */
  const showModal = (type) => {
    setisShowWE(true);
    setWeType(type);
  };


  /**
   * @Description:当月份改变的时候的回调;
   * @date 2022--18-07
   */
  const onMonthChant = (value) => {
    setCurrentMonth(value.format('YYYY-MM'));
  };

  /**
   * @Description:提交月份水电回调函数
   * @date 2022--03-07
   */
  const handleWEsubmit = (value) => {
    console.log(value, houseData);
    if (value) {
      const yearAndmonth = value.month.format('YYYY-MM').split('-');//做字符串的分割
      const year = yearAndmonth[0];
      const month = yearAndmonth[1];
      if (value.WaterNum && houseData.waterUnitPrice) {//水费的
        const param = {
          houseId: houseData.houseId ? houseData.houseId : '',
          year: parseInt(year),
          month: parseInt(month),
          waterNum: value.WaterNum,
          waterPrice: currency(value.WaterNum).multiply(houseData.waterUnitPrice).value,
        };
        console.log(param);
        services.submitMonthWaterPrice(param).then((res) => {
          if (res.data.status === 0) {
            message.success('添加水费数据成功', 1, () => {
              setisShowWE(false);
              //重新调用接口查询水电数据，更新组组件的数据
              services.queryByhouseId(houseData.houseId).then((ress) => {
                console.log(ress);
                // //更新子组件的水电数据
                if (ress && ress.data.code === 0) {
                  if (waterEleRef.current) {
                    waterEleRef.current.updateWaterData(ress.data.data.waterPrice);
                    waterEleRef.current.updateEleData(ress.data.data.elePrice);
                  }
                }
              });
            });
          }
        });
      } else if (value.electricityNum && houseData.electricityUnitPrice) {//电费的
        const param = {
          houseId: houseData.houseId ? houseData.houseId : '',
          year: parseInt(year),
          month: parseInt(month),
          eleNum: value.electricityNum,
          elePrice: currency(value.electricityNum).multiply(houseData.electricityUnitPrice).value,
        };
        services.submitMonthElePrice(param).then((res) => {
          if (res.data.code === 0) {
            message.success('添加电费数据成功', 1, () => {
              setisShowWE(false);
              //重新调用接口查询水电数据，更新组组件的数据
              services.queryByhouseId(houseData.houseId).then((ress) => {
                if (ress && ress.data.code === 0) {
                  //更新子组件的水电数据
                  if (waterEleRef.current) {
                    waterEleRef.current.updateWaterData(ress.data.data.waterPrice);
                    waterEleRef.current.updateEleData(ress.data.data.elePrice);
                  }
                }
              });
            });
          }
        });
      }
    }


  };


  /**
   * @Description:填写水电收费标准
   * @date 2022--03-07
   */
  const handleWEUnitsubmit = (value) => {
    console.log(value);
    if (value.waterUnit || value.eleUnit) {
      const param = {
        houseId: houseData.houseId,
        waterUnitPrice: value.waterUnit ? value.waterUnit : houseData.waterUnitPrice ? houseData.waterUnitPrice : '',
        electricityUnitPrice: value.eleUnit ? value.eleUnit : houseData.electricityUnitPrice ? houseData.electricityUnitPrice : '',
      };
      services.submitWEUnit(param).then((res) => {
        if (res.data.code === 0) {
          message.success('修改成功', 1, () => {
            setisShowWEUnit(false);
          });
        }
      });
    } else {
      message.error('请填写数据', 1);
    }
  };

  /**
   * @Description:DOM
   * @date 2022--16-05
   */
    // 头顶顶部描述
  const description = (
      <RouteContext.Consumer>
        {({ isMobile }) => {
          const {
            tenantMessage,
            contractTime,
            houseAddress,
            houseAddressDetail,
            houseArea,
            housePic,
            waterUnitPrice,
            electricityUnitPrice,
          } = houseData;
          return (
            <div>
              <Descriptions className={styles.headerList} size='small' column={isMobile ? 1 : 2}>
                <Descriptions.Item
                  label='租客'>{tenantMessage?.tenantName ? tenantMessage.tenantName : ''}</Descriptions.Item>
                <Descriptions.Item
                  label='租客联系电话'>{tenantMessage?.tenantPhone ? tenantMessage.tenantPhone : ''}</Descriptions.Item>
                <Descriptions.Item label='房屋起租日期'>{contractTime ? contractTime[0] : ''}</Descriptions.Item>
                <Descriptions.Item label='房屋详细地址'>
                  {`${houseAddress}${houseAddressDetail}` || ''}
                </Descriptions.Item>
                <Descriptions.Item
                  label='合同生效日期'>{contractTime ? `${contractTime[0]}  ~  ${contractTime[1]}` : ''}</Descriptions.Item>
                <Descriptions.Item label='房屋大小'>{houseArea ? houseArea : ''} m²</Descriptions.Item>
                <Descriptions.Item label='水费标准（每吨）'>￥ {waterUnitPrice ? waterUnitPrice : ''}</Descriptions.Item>
                <Descriptions.Item
                  label='电费标准（每度）'>￥ {electricityUnitPrice ? electricityUnitPrice : ''}</Descriptions.Item>
              </Descriptions>
              <div className={styles.avatarHolder}>
                <img alt='' src={housePic && housePic[0] && housePic[0].thumbUrl ? housePic[0].thumbUrl : ''} />
              </div>
            </div>
          );
        }}
      </RouteContext.Consumer>
    );

  // 头顶右半边描述
  const extra = (
    <div className={styles.moreInfo}>
      <Statistic title='月租金' value={houseData.housePrice || ''} prefix='¥' />
      <Statistic title='已缴纳租金' value={'666'} prefix='¥' />
    </div>
  );

  //其他材料
  const showhousePic = {
    empty: <Empty />,
    houselist: <div>
      {houseData && houseData.housePic ? houseData.housePic.map((item) => {
        return (
          <Image
            width={200}
            key={item.name}
            src={item.thumbUrl}
          />
        );
      }) : ''}
    </div>,
  };

  const menu = (
    <Menu>
      <Menu.Item key='1'>选项一</Menu.Item>
      <Menu.Item key='2'>选项二</Menu.Item>
      <Menu.Item key='3'>选项三</Menu.Item>
    </Menu>
  );
  const mobileMenu = (
    <Menu>
      <Menu.Item key='1'>操作一</Menu.Item>
      <Menu.Item key='2'>操作二</Menu.Item>
      <Menu.Item key='3'>选项一</Menu.Item>
      <Menu.Item key='4'>选项二</Menu.Item>
      <Menu.Item key=''>选项三</Menu.Item>
    </Menu>
  );
  const action = (
    <RouteContext.Consumer>
      {({ isMobile }) => {
        if (isMobile) {
          return (
            <Dropdown.Button
              type='primary'
              icon={<DownOutlined />}
              overlay={mobileMenu}
              placement='bottomRight'
              onClick={() => {
                history.push('/houseSummary');
              }}
            >
              返回
            </Dropdown.Button>
          );
        }

        return (
          <Fragment>
            <ButtonGroup>
              <Button onClick={() => {
                setisShowWEUnit(true);
              }}>设置水电费标准</Button>
              <Button>发布公告</Button>
              <Dropdown overlay={menu} placement='bottomRight'>
                <Button>
                  <EllipsisOutlined />
                </Button>
              </Dropdown>
            </ButtonGroup>
            <Button type='primary' onClick={() => {
              history.push('/houseSummary');
            }}>返回</Button>
            <Modal
              visible={isShowWEUnit}
              title={'设置水电费收费标准'}
              width={'50%'}
              onCancel={() => {
                setisShowWEUnit(false);
              }}
              footer={null}>
              <Form
                onFinish={handleWEUnitsubmit}
              >
                <Form.Item
                  label='水费'
                  name='waterUnit'
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                >
                  <InputNumber style={{ width: '70%' }} addonAfter={'元/吨'}
                               placeholder={`当前收费标准为：${houseData.waterUnitPrice}元/吨`} />
                </Form.Item>
                <Form.Item
                  label='电费'
                  name='eleUnit'
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                >
                  <InputNumber style={{ width: '70%' }} addonAfter={'元/度'}
                               placeholder={`当前收费标准为：${houseData.electricityUnitPrice}元/度`} />
                </Form.Item>
                <Divider style={{ margin: '12px 0' }} />
                <div className={styles.modalfooter}>
                  <Button onClick={() => {
                    setisShowWEUnit(false);
                  }}>取消</Button>
                  <Button type='primary' htmlType='submit' style={{ marginLeft: '20px' }}>确定</Button>
                </div>
              </Form>
            </Modal>
          </Fragment>
        );
      }}
    </RouteContext.Consumer>
  );

  const { houseName } = houseData;
  return (
    <div className={styles.container}>
      <PageContainer
        title={houseName || ''}
        extra={action}//右边的操作
        className={styles.pageHeader}
        content={description}
        extraContent={extra}
        tabActiveKey={tabStatus.tabActiveKey}
        onTabChange={onTabChange}
        tabList={[
          {
            key: 'houseDetail',
            tab: '房屋详情',
          },
        ]}
      >
        <div className={styles.main}>
          <GridContent>
            <Card
              title='租客信息'
              style={{
                marginBottom: 24,
              }}
              bordered={false}
            >
              <Descriptions
                style={{
                  marginBottom: 24,
                }}
              >
                <Descriptions.Item label='租客姓名'>{tenantMessage?.name || ''}</Descriptions.Item>
                <Descriptions.Item
                  label='租客性别'>{tenantMessage && tenantMessage.sex ? tenantMessage.sex === 1 ? '男' : tenantMessage.sex === 0 ? '女' : '' : ''}</Descriptions.Item>
                <Descriptions.Item
                  label='年龄'>{tenantMessage && tenantMessage.age ? tenantMessage.age : ''} 岁</Descriptions.Item>
                <Descriptions.Item
                  label='身份证'>{tenantMessage && tenantMessage.IDcardNumber ? tenantMessage.IDcardNumber : ''}</Descriptions.Item>
                <Descriptions.Item
                  label='联系方式'>{tenantMessage && tenantMessage.phone ? tenantMessage.phone : ''}</Descriptions.Item>
                <Descriptions.Item
                  label='电子邮箱'>{tenantMessage && tenantMessage.email ? tenantMessage.email : ''}</Descriptions.Item>
                <Descriptions.Item label='联系地址'>
                  {tenantMessage && tenantMessage.registrationAddress ? tenantMessage.registrationAddress : ''}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card
              title='水费电费信息'
              style={{
                marginBottom: 24,
              }}
              bordered={false}
              extra={
                <div>
                  <Button type='primary' onClick={() => {
                    showModal('water');
                  }}>添加水费信息</Button>
                  <Button onClick={() => {
                    showModal('electricity');
                  }} style={{ marginLeft: '20px' }}>添加电费信息</Button>
                </div>}
            >
              <WaterEle ref={waterEleRef} cRef={waterEleRef}></WaterEle>
            </Card>

            <Card
              title='其他材料'
              style={{
                marginBottom: 24,
              }}
              bordered={false}
            >
              {houseData.housePic ? showhousePic['houselist'] : showhousePic['empty']}
            </Card>

            <Modal
              title={'填写水电使用情况'}
              width={'50%'}
              visible={isShowWE}
              onCancel={() => {
                setisShowWE(false);
              }}
              footer={null}
            >
              <Form
                onFinish={handleWEsubmit}
              >
                <Form.Item
                  label='月份'
                  name='month'
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 20 }}
                >
                  <DatePicker onChange={onMonthChant} picker='month' style={{ width: '50%' }} />
                </Form.Item>
                {
                  weType === 'water' ? (
                    <Form.Item
                      label='用水量'
                      name='WaterNum'
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 20 }}
                    >
                      <InputNumber style={{ width: '50%' }} addonAfter={'/吨'} />
                    </Form.Item>
                  ) : weType === 'electricity' ? <Form.Item
                    label='用电量'
                    name='electricityNum'
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                  >
                    <InputNumber style={{ width: '50%' }} addonAfter={'/度'} />
                  </Form.Item> : ''
                }
                {
                  weType === 'water' ?
                    <Form.Item
                      label='水费标准'
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 20 }}
                      name='waterUnitPrice'
                    >
                      <Input disabled={true} placeholder={`￥  ${houseData?.waterUnitPrice || ''}`}
                             style={{ width: '50%' }} addonAfter={'/吨'} />
                    </Form.Item>
                    : <Form.Item
                      label='电费标准'
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 20 }}
                      name='electricityUnitPrice'
                    >
                      <Input disabled={true} placeholder={`￥  ${houseData?.electricityUnitPrice || ''}`}
                             style={{ width: '50%' }} addonAfter={'/度'} />
                    </Form.Item>
                }
                <Divider style={{ margin: '12px 0' }} />
                <div className={styles.modalfooter}>
                  <Button onClick={() => {
                    setisShowWE(false);
                  }}>取消</Button>
                  <Button type='primary' htmlType='submit' style={{ marginLeft: '20px' }}>添加</Button>
                </div>
              </Form>
            </Modal>
          </GridContent>
        </div>
      </PageContainer>
    </div>
  );
};

export default houseDetail;

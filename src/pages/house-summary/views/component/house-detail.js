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
import React, { forwardRef, Fragment, useEffect, useRef, useState } from 'react';
import currency from 'currency.js';
import { history, useModel } from 'umi';
import styles from './house-detail.less';
import * as services from '../../services/services';
import WaterEle from '../component/WaterEle';
import noDataLogo from '../../../../../public/image/noData.jpg';
import { WechatOutlined } from '@ant-design/icons';

const ButtonGroup = Button.Group;


const houseDetail = () => {
    const { initialState, setInitialState } = useModel('@@initialState'); //用于全局管理登陆者信息

    const waterEleRef = useRef();
    // const announcementRef = React.createRef();
    const [announceForm] = Form.useForm();//房东的公告
    const [messageForm] = Form.useForm();//租客的信息
    const [istenant, setIsTenant] = useState(false);//是否是租客
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
    const [isShowAnnouncement, setisShowAnnouncement] = useState(false);//房东的是否显示公告框
    const [isSendMessage, setIsSendMessage] = useState(false);//租客是否显示发信息的框
    const [ispay, setIspay] = useState(false);//是否显示支付框

    //componentDidmount
    useEffect(() => {
      refreshData();
      const { userType } = initialState.currentUser;
      if (userType === 1) {//房东
        setIsTenant(false);
      } else if (userType === 2) {//租客
        setIsTenant(true);
      }
    }, []);

    // useEffect(() => {
    //   //监听有没有打开公告的modal，如果有打开就能获取表单的ref进行塞值
    //   if (isShowAnnouncement) {
    //     announcementRef.current.setFieldsValue({ announcement: houseData.announcement });
    //   }
    // }, [isShowAnnouncement]);

    const onTabChange = (tabActiveKey) => {
      console.log(tabStatus, tabActiveKey);
      seTabStatus({ ...tabStatus, tabActiveKey });
    };


    /**
     * @Description:刷新数据
     * @date 2022--34-07
     */
    const refreshData = () => {
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
            if (res.data.code === 0) {
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
              refreshData();
              setisShowWEUnit(false);
            });
          }
        });
      } else {
        message.error('请填写数据', 1);
      }
    };

    /**
     * @Description:公告提交的回调函数
     * @date 2022--58-08
     */
    const handleAnnouncementSubmit = (value) => {
      const param = {
        houseId: houseData.houseId || '',
        announcement: value.announcement,
      };
      if (value && value.announcement) {
        services.submitAnnouncement(param).then((res) => {
          if (res && res.data && res.data.code === 0) {
            message.success(res.data.msg, 1, () => {
              setisShowAnnouncement(false);
              refreshData();
            });
          }
        });
      }
    };

    /**
     * @Description:租客信息提交
     * @date 2022--03-10
     */
    const handleMessageSubmit = (value) => {
      if (value && value.tolandlordMessage) {
        const Time = new Date().toLocaleDateString().split('/');
        const currentTime = `${Time[0]}-${Time[1]}-${Time[2]}`;
        const param = {
          landlordId: houseData.landlordId || '',//房东ID
          avatar: "https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png",//消息的logo
          title: `${houseData.tenantMessage.tenantName || ''}  发来一条信息`,//标题
          description: value.tolandlordMessage || '',//描述
          isRead: false,//信息是否已读
          noticeType: 'message',//message为租客给房东发的信息 feeInfo为缴费信息
          date: currentTime,//时间
        };
        console.log(param);
        services.submitMessage(param).then((res) => {
          if (res && res.data && res.data.code === 0) {
            message.success(res.data.msg, 1, () => {
              setIsSendMessage(false);
              refreshData();
            });
          }
        });
      }
    };

    /**
     * @Description:房客缴纳费用
     * @date 2022--03-14
     */
    const handlePay = (value) => {
      if (!value) {
        return;
      }

      const Time = new Date().toLocaleDateString().split('/');
      const currentTime = `${Time[0]}-${Time[1]}-${Time[2]}`;
      const param = {
        landlordId: houseData.landlordId || '',//房东ID
        avatar: 'http://images.shejidaren.com/wp-content/uploads/2020/03/36365.jpg',//消息的logo
        title: `${houseData.tenantMessage.tenantName || ''}  的缴费信息`,//标题
        description: `${houseData.tenantMessage.tenantName || ''}  通过扫码支付了${value.fee}元`,//标题
        isRead: false,//信息是否已读
        noticeType: 'pay',//message为租客给房东发的信息 feeInfo为缴费信息
        date: currentTime,//时间
      };

      services.payFee(param).then((res) => {
        console.log(res);
        if (res && res.data.code === 0) {
          message.success(res.data.msg, 1, () => {
            setIspay(false);
          });
        }
      });
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
              announcement,
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
                  <Descriptions.Item label='公告'> {announcement ? announcement : '暂无公告...'}</Descriptions.Item>
                </Descriptions>
                <div className={styles.avatarHolder}>
                  <img alt='' src={housePic ? `http://localhost:27018/upload/getImages/${housePic[0]}` : noDataLogo} />
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
        {/*<Statistic title='已缴纳租金' value={'666'} prefix='¥' />*/}
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
              key={item}
              src={item ? `http://localhost:27018/upload/getImages/${item}` : noDataLogo}
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
        {
          ({ isMobile }) => {
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
                {
                  istenant ?
                    <ButtonGroup>
                      <Button onClick={() => {
                        setIsSendMessage(true);
                      }}>发布信息</Button>
                      <Button onClick={() => {
                        setIspay(true);
                      }} style={{ margin: '0 10px' }}>缴纳费用</Button>
                    </ButtonGroup> :
                    <ButtonGroup>
                      <Button onClick={() => {
                        setisShowWEUnit(true);
                      }}>设置水电费标准</Button>
                      <Button onClick={() => {
                        setisShowAnnouncement(true);
                        announceForm.setFieldsValue({ announcement: houseData.announcement });
                      }}>发布公告</Button>
                      <Dropdown overlay={menu} placement='bottomRight'>
                        <Button>
                          <EllipsisOutlined />
                        </Button>
                      </Dropdown>
                    </ButtonGroup>
                }
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
                <Modal
                  visible={isShowAnnouncement}
                  title={'设置房屋公告'}
                  width={'50%'}
                  onCancel={() => {
                    setisShowAnnouncement(false);
                  }}
                  footer={null}
                  forceRender>
                  <Form form={announceForm} onFinish={handleAnnouncementSubmit}
                    // ref={announcementRef}
                  >
                    <Form.Item
                      name='announcement'
                    >
                      <Input.TextArea style={{ width: '100%', height: '200px' }}
                                      placeholder='请输入房屋公告...'></Input.TextArea>
                    </Form.Item>
                    <Divider style={{ margin: '12px 0' }} />
                    <div className={styles.modalfooter}>
                      <Button onClick={() => {
                        setisShowAnnouncement(false);
                      }}>取消</Button>
                      <Button type='primary' htmlType='submit' style={{ marginLeft: '20px' }}>确定</Button>
                    </div>
                  </Form>
                </Modal>
                <Modal
                  visible={isSendMessage}
                  title={'给房东发点消息吧'}
                  width={'50%'}
                  onCancel={() => {
                    setIsSendMessage(false);
                  }}
                  footer={null}
                  forceRender>
                  <Form form={messageForm} onFinish={handleMessageSubmit}
                    // ref={announcementRef}
                  >
                    <Form.Item
                      name='tolandlordMessage'
                    >
                      <Input.TextArea style={{ width: '100%', height: '200px' }}
                                      placeholder='请输入想给房东发送的信息...'></Input.TextArea>
                    </Form.Item>
                    <Divider style={{ margin: '12px 0' }} />
                    <div className={styles.modalfooter}>
                      <Button onClick={() => {
                        setIsSendMessage(false);
                      }}>取消</Button>
                      <Button type='primary' htmlType='submit' style={{ marginLeft: '20px' }}>确定</Button>
                    </div>
                  </Form>
                </Modal>
                <Modal
                  visible={ispay}
                  title={'缴纳费用'}
                  width={'25%'}
                  onCancel={() => {
                    setIspay(false);
                  }}
                  footer={null}>
                  <Form
                    onFinish={handlePay}
                  >
                    <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '20px' }}>
                      <Image
                        width={400}
                        height={600}
                        src={houseData.payPic ? `http://localhost:27018/upload/getImages/${houseData.payPic}` : noDataLogo}
                      />
                    </div>

                    <Form.Item
                      label='缴纳费用'
                      name='fee'
                      labelCol={{ span: 6 }}
                      wrapperCol={{ span: 18 }}
                    >
                      <InputNumber style={{ width: '90%' }} addonAfter={'元'} placeholder={`输入你所支付的费用`} />
                    </Form.Item>
                    <Divider style={{ margin: '12px 0' }} />
                    <div className={styles.modalfooter}>
                      <Button onClick={() => {
                        setIspay(false);
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
    console.log(istenant);
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
                    {tenantMessage && tenantMessage.ContactAddress ? tenantMessage.ContactAddress : ''}
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
                  istenant ? <></> : <div>
                    <Button type='primary' onClick={() => {
                      showModal('water');
                    }}>添加水费信息</Button>
                    <Button onClick={() => {
                      showModal('electricity');
                    }} style={{ marginLeft: '20px' }}>添加电费信息</Button>
                  </div>
                }
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
  }
;

export default houseDetail;

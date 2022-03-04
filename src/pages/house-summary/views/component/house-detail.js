import {
  DingdingOutlined,
  DownOutlined,
  EllipsisOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import {
  Badge,
  Button,
  Card,
  Statistic,
  Descriptions,
  Dropdown,
  Menu,
  Popover,
  Modal,
  Table,
  Image,
  Empty,
  Form,
  DatePicker,
  Divider,
  Input,
  InputNumber,
} from 'antd';
import { GridContent, PageContainer, RouteContext } from '@ant-design/pro-layout';
import React, { Fragment, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useRequest, history } from 'umi';
import { queryAdvancedProfile } from '../../../profile/advanced/service';
import styles from './house-detail.less';
import * as services from '../../services/services';
import WaterEle from '../component/WaterEle';

const ButtonGroup = Button.Group;
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
          >
            主操作
          </Dropdown.Button>
        );
      }

      return (
        <Fragment>
          <ButtonGroup>
            <Button>水电费标准</Button>
            <Button>发布公告</Button>
            <Dropdown overlay={menu} placement='bottomRight'>
              <Button>
                <EllipsisOutlined />
              </Button>
            </Dropdown>
          </ButtonGroup>
          <Button type='primary'>主操作</Button>
        </Fragment>
      );
    }}
  </RouteContext.Consumer>
);


const desc1 = (
  <div className={classNames(styles.textSecondary, styles.stepDescription)}>
    <Fragment>
      曲丽丽
      <DingdingOutlined
        style={{
          marginLeft: 8,
        }}
      />
    </Fragment>
    <div>2016-12-12 12:32</div>
  </div>
);
const desc2 = (
  <div className={styles.stepDescription}>
    <Fragment>
      周毛毛
      <DingdingOutlined
        style={{
          color: '#00A0E9',
          marginLeft: 8,
        }}
      />
    </Fragment>
    <div>
      <a href=''>催一下</a>
    </div>
  </div>
);
const popoverContent = (
  <div
    style={{
      width: 160,
    }}
  >
    吴加号
    <span
      className={styles.textSecondary}
      style={{
        float: 'right',
      }}
    >
      <Badge
        status='default'
        text={
          <span
            style={{
              color: 'rgba(0, 0, 0, 0.45)',
            }}
          >
            未响应
          </span>
        }
      />
    </span>
    <div
      className={styles.textSecondary}
      style={{
        marginTop: 4,
      }}
    >
      耗时：2小时25分钟
    </div>
  </div>
);

const customDot = (dot, { status }) => {
  if (status === 'process') {
    return (
      <Popover placement='topLeft' arrowPointAtCenter content={popoverContent}>
        <span>{dot}</span>
      </Popover>
    );
  }

  return dot;
};

const operationTabList = [
  {
    key: 'tab1',
    tab: '操作日志一',
  },
  {
    key: 'tab2',
    tab: '操作日志二',
  },
  {
    key: 'tab3',
    tab: '操作日志三',
  },
];
const columns = [
  {
    title: '操作类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '操作人',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '执行结果',
    dataIndex: 'status',
    key: 'status',
    render: (text) => {
      if (text === 'agree') {
        return <Badge status='success' text='成功' />;
      }

      return <Badge status='error' text='驳回' />;
    },
  },
  {
    title: '操作时间',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
  },
  {
    title: '备注',
    dataIndex: 'memo',
    key: 'memo',
  },
];

const houseDetail = () => {
  const [houseData, setHouseData] = useState({});//房屋数据
  const [tenantMessage, setTenantMessage] = useState({});//租客数据
  const [tabStatus, seTabStatus] = useState({
    tabActiveKey: 'houseDetail',//头顶tab页的默认值
    operationKey: 'tab2',//下面操作日志的默认值
  });
  const [isShowWE, setisShowWE] = useState(false);//设置是否显示设置水电的弹窗
  const [currentMonth, setCurrentMonth] = useState(moment().format('YYYY-MM'));
  const [weType, setWeType] = useState('');
  //componentDidmount
  useEffect(() => {
    const { houseId } = history.location.query;
    services.queryByhouseId(houseId).then((res) => {
      if (res.data && res.data.code === 0) {
        setHouseData(res.data.data);
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

  const { data = {}, loading } = useRequest(queryAdvancedProfile);
  const { advancedOperation1, advancedOperation2, advancedOperation3 } = data;
  const onTabChange = (tabActiveKey) => {
    console.log(tabStatus, tabActiveKey);
    seTabStatus({ ...tabStatus, tabActiveKey });
  };

  const onOperationTabChange = (key) => {
    seTabStatus({ ...tabStatus, operationKey: key });
  };

  const showModal = (type) => {
    setisShowWE(true);
    setWeType(type);
  };

  const onMonthChant = (value) => {
    setCurrentMonth(value.format('YYYY-MM'));
  };

  const contentList = {
    tab1: (
      <Table
        pagination={false}
        loading={loading}
        dataSource={advancedOperation1}
        columns={columns}
      />
    ),
    tab2: (
      <div>44444</div>
    ),
    tab3: (
      <Table
        pagination={false}
        loading={loading}
        dataSource={advancedOperation3}
        columns={columns}
      />
    ),
  };


  // 头顶顶部描述
  const description = (
    <RouteContext.Consumer>
      {({ isMobile }) => {
        const { tenantMessage, contractTime, houseAddress, houseAddressDetail, houseArea, housePic } = houseData;
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

  const mainContentList = {

    houseDetail: (
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
          <WaterEle></WaterEle>
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

        <Card
          className={styles.tabsCard}
          bordered={false}
          tabList={operationTabList}
          onTabChange={onOperationTabChange}
        >
          {contentList[tabStatus.operationKey]}
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
            onFinish={(values) => {
              console.log(values);

              // console.log(values.month.format('YYYY-MM'));
            }}
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
                  label='水费'
                  name='WaterNum'
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 20 }}
                >
                  <InputNumber style={{ width: '50%' }} addonAfter={'/吨'} />
                </Form.Item>
              ) : weType === 'electricity' ? <Form.Item
                label='电费'
                name='electricityNum'
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 20 }}
              >
                <InputNumber style={{ width: '50%' }} addonAfter={'/度'} />
              </Form.Item> : ''
            }
            <Divider style={{ margin: '12px 0' }} />
            <div className={styles.modalfooter}>
              <Button>取消</Button>
              <Button type='primary' htmlType='submit' style={{ marginLeft: '20px' }}>添加</Button>
            </div>
          </Form>
        </Modal>
      </GridContent>
    ),
  };

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
          {mainContentList[tabStatus.tabActiveKey]}
        </div>
      </PageContainer>
    </div>
  )
    ;
};

export default houseDetail;

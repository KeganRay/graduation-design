import {
  DingdingOutlined,
  DownOutlined,
  EllipsisOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Statistic,
  Descriptions,
  Dropdown,
  Menu,
  Popover,
  Steps,
  Table,
  Image,
  Empty,
} from 'antd';
import { GridContent, PageContainer, RouteContext } from '@ant-design/pro-layout';
import React, { Fragment, Suspense, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useRequest, history } from 'umi';
import { queryAdvancedProfile } from '../../../profile/advanced/service';
import styles from './house-detail.less';
import * as services from '../../services/services';
import { queryByhouseId, queryByIdCardNumber } from '../../services/services';
import SalesCard from '@/pages/dashboard/analysis/components/SalesCard';
import { getTimeDistance } from '@/pages/dashboard/analysis/utils/utils';
import { fakeChartData } from '@/pages/dashboard/analysis/service';

const { Step } = Steps;
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
            <Button>操作一</Button>
            <Button>操作二</Button>
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

  const [rangePickerValue, setRangePickerValue] = useState(getTimeDistance('year'));
  const isActive = (type) => {
    if (!rangePickerValue) {
      return '';
    }

    const value = getTimeDistance(type);

    if (!value) {
      return '';
    }

    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }

    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }

    return '';
  };
  const handleRangePickerChange = (value) => {
    setRangePickerValue(value);
  };
  const { loading1, data1 } = useRequest(fakeChartData);
  const selectDate = (type) => {
    setRangePickerValue(getTimeDistance(type));
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


  const onTabChange = (tabActiveKey) => {
    console.log(tabStatus, tabActiveKey);
    seTabStatus({ ...tabStatus, tabActiveKey });
  };

  const onOperationTabChange = (key) => {
    seTabStatus({ ...tabStatus, operationKey: key });
  };

  // 头顶顶部描述
  const description = (
    <RouteContext.Consumer>
      {({ isMobile }) => {
        const { tenantMessage, contractTime, houseAddress, houseAddressDetail, houseArea } = houseData;
        // console.log(houseData);
        return (
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

  const onPreview = async (file)=>{
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
  }

  const showhousePic = {
    empty: <Empty />,
    houselist: <div>
      {houseData && houseData.housePic ? houseData.housePic.map((item) => {
        return (
          <Image
            width={200}
            key={item.name}
            src={item.thumbUrl}
            // onPreview={onPreview(item)}
          />
        );
      }) : ''}
    </div>,
  }

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
              label='租客性别'>{tenantMessage.sex ? tenantMessage.sex === 1 ? '男' : tenantMessage.sex === 0 ? '女' : '' : ''}</Descriptions.Item>
            <Descriptions.Item label='年龄'>{tenantMessage.age || ''} 岁</Descriptions.Item>
            <Descriptions.Item label='身份证'>{tenantMessage.IDcardNumber || ''}</Descriptions.Item>
            <Descriptions.Item label='联系方式'>{tenantMessage.phone || ''}</Descriptions.Item>
            <Descriptions.Item label='电子邮箱'>{tenantMessage.email || ''}</Descriptions.Item>
            <Descriptions.Item label='联系地址'>
              {tenantMessage.registrationAddress || ''}
            </Descriptions.Item>
          </Descriptions>
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
      </GridContent>
    ),
    waterElectricity: (
      <GridContent>
        <Card
          title='租客信息'
          style={{
            marginBottom: 24,
          }}
          bordered={false}
        >
          <SalesCard
            rangePickerValue={rangePickerValue}
            salesData={data1?.salesData || []}
            isActive={isActive}
            handleRangePickerChange={handleRangePickerChange}
            loading={loading1}
            selectDate={selectDate}
          />
        </Card>
      </GridContent>
    ),
  };

  const { houseName } = houseData;
  return (
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
        {
          key: 'waterElectricity',
          tab: '水电费',
        },
      ]}
    >
      <div className={styles.main}>
        {mainContentList[tabStatus.tabActiveKey]}
      </div>
    </PageContainer>
  );
};

export default houseDetail;

import React, { useEffect, useState } from 'react';
import { Card, Typography, List, Button } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import style from './index.less';
import * as services from '@/pages/list/card-list/service';

const { Paragraph } = Typography;
import { history, useModel } from 'umi';
import { queryHouseList } from '@/pages/list/card-list/service';
import noDataLogo from '../../../../public/image/noData.jpg'

const Index = () => {
  //状态
  const [list, setList] = useState([]); //展示列表数组
  const { initialState, setInitialState } = useModel('@@initialState'); //用于全局管理登陆者信息

  //componentDidMount
  useEffect(() => {
    const { userId } = initialState.currentUser;
    if (userId) {
      services.queryHouseList(userId).then((res) => {
        console.log('数组列表', res);
        const list = res?.data || [];
        setList(list);
      });
    }
  }, []);

  const handleNewHouse = () => {
    history.push('/new-house');
  };

  //头顶的文章
  const content = (
    <div className={style.pageHeaderContent}>
      <p>
        利用此系统管理您的房源，用最小的时间收获最大的效益，以下就是您名下注册的房产
      </p>
      <div className={style.contentLink}>
        <a>
          <img alt='' src='https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg' />{' '}
          快速开始
        </a>
        <a>
          <img alt='' src='https://gw.alipayobjects.com/zos/rmsportal/NbuDUAuBlIApFuDvWiND.svg' />{' '}
          产品简介
        </a>
        <a>
          <img alt='' src='https://gw.alipayobjects.com/zos/rmsportal/ohOEPSYdDTNnyMbGuyLb.svg' />{' '}
          产品文档
        </a>
      </div>
    </div>
  );
  const extraContent = (
    <div className={style.extraImg}>
      <img
        alt='这是一个标题'
        src='https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png'
      />
    </div>
  );

  //render
  return (
    <PageContainer content={content} extraContent={extraContent}>
      <div className={style.cardList}>
        <List
          rowKey='id'
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 4,
            xxl: 4,
          }}
          dataSource={[{}, ...list]}
          renderItem={(item) => {
            if (item && item.houseId) {
              return (
                <List.Item key={item.houseId}>
                  <Card
                    hoverable
                    className={style.card}
                    actions={[<a key='option1'>房子详情</a>, <a key='option2'>发布公告</a>]}
                  >
                    <Card.Meta
                      avatar={<img alt='' className={style.cardAvatar} src={item?.housePic[0]?.thumbUrl || noDataLogo} />}
                      title={<a style={{ fontSize: '22px', fontWeight: 'bold' }}>{item?.houseName || ''}</a>}
                      description={
                        <Paragraph
                          className={style.item}
                          ellipsis={{
                            rows: 3,
                          }}
                        >
                          <div className={style.tenantMessage}>
                            房屋地址：{item.houseAddress || ''}
                          </div>
                          <div className={style.item}>
                            <div className={style.tenantMessage}>租客：{item.tenantMessage.tenantName || ''}</div>
                            <div>联系电话：{item.tenantMessage.tenantPhone || ''}</div>
                          </div>
                        </Paragraph>
                      }
                    />
                  </Card>
                </List.Item>
              );
            }
            return (
              <List.Item>
                <Button type='dashed' className={style.newButton} onClick={handleNewHouse}>
                  <PlusOutlined /> 新增产品
                </Button>
              </List.Item>
            );
          }}
        />
      </div>
    </PageContainer>
  );
};

export default Index;

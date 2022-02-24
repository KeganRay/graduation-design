import React, {  useEffect, useState } from 'react';
import {  Card, Typography, List, Button } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import style from './index.less';
import * as services from '@/pages/list/card-list/service';
const { Paragraph } = Typography;
import { history } from 'umi';

const Index = () => {
  //状态
  const [list, setList] = useState([]); //展示列表数组

  //componentDidMount
  useEffect(() => {
    services.queryFakeList({ count: 10 }).then((res) => {
      console.log(res);
      const list = res?.data?.list || [];
      setList(list);
    });
  }, []);

  const handleNewHouse = () => {
    history.push('/');
  };

  //头顶的文章
  const content = (
    <div className={style.pageHeaderContent}>
      <p>
        段落示意：蚂蚁金服务设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，
        提供跨越设计与开发的体验解决方案。
      </p>
      <div className={style.contentLink}>
        <a>
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg" />{' '}
          快速开始
        </a>
        <a>
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/NbuDUAuBlIApFuDvWiND.svg" />{' '}
          产品简介
        </a>
        <a>
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/ohOEPSYdDTNnyMbGuyLb.svg" />{' '}
          产品文档
        </a>
      </div>
    </div>
  );
  const extraContent = (
    <div className={style.extraImg}>
      <img
        alt="这是一个标题"
        src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
      />
    </div>
  );

  //render
  return (
    <PageContainer content={content} extraContent={extraContent}>
      <div className={style.cardList}>
        <List
          rowKey="id"
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 4,
            xxl: 4,
          }}
          dataSource={list ? list : []}
          renderItem={(item) => {
            if (item && item.id) {
              return (
                <List.Item key={item.id}>
                  <Card
                    hoverable
                    className={style.card}
                    actions={[<a key="option1">操作一</a>, <a key="option2">操作二</a>]}
                  >
                    <Card.Meta
                      avatar={<img alt="" className={style.cardAvatar} src={item.avatar} />}
                      title={<a>{item.title}</a>}
                      description={
                        <Paragraph
                          className={style.item}
                          ellipsis={{
                            rows: 3,
                          }}
                        >
                          {item.description}
                        </Paragraph>
                      }
                    />
                  </Card>
                </List.Item>
              );
            }

            return (
              <List.Item>
                <Button type="dashed" className={style.newButton} onClick={handleNewHouse}>
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

import React, { useEffect, useImperativeHandle, useState } from 'react';
import { Card, Col, Row, Tabs, Button, Empty } from 'antd';
import { Column } from '@ant-design/charts';
import styles from './waterELe.less';
import numeral from 'numeral';

const { TabPane } = Tabs;
const rankingListData = [];

for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: `工专路 ${i} 号店`,
    total: 323234,
  });
}

const salesData = [];
for (let i = 0; i < 12; i += 1) {
  salesData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200,
  });
}

const WaterEle = ({ cRef }) => {
  const [waterData, setWaterData] = useState([]);//水的数据
  const [waterListData, setWaterListData] = useState([]);//水的列表数据
  const [eleData, setEleData] = useState([]);//电的数据
  const [eleListData, setEleListData] = useState([]);//电的列表数据


  //useImperativeHandle，第一个参数是目标元素的ref的引用，此处为父组件的引用
  useImperativeHandle(cRef, () => ({
    // 以下给父组件的方法
    updateWaterData: (newdata) => {
      let listData = [];
      newdata.sort(sortBy('month', true));
      //复制一个新的数组
      newdata.map((item) => {
        listData.push(item);
      });
      newdata.forEach((item) => {
        item.month = `${item.month} 月`;
      });

      setWaterData(newdata);//设置图标的数据

      const sortedList = listData.sort(sortBy('waterNum', false));

      setWaterListData(sortedList);
    },
    updateEleData: (newdata) => {
      let listData = [];
      newdata.sort(sortBy('month', true));
      //复制一个新的数组
      newdata.map((item) => {
        listData.push(item);
      });
      newdata.forEach((item) => {
        item.month = `${item.month} 月`;
      });
      setEleData(newdata);
      const sortedList = listData.sort(sortBy('eleNum', false));
      setEleListData(sortedList);
    },
  }));


  const sortBy = (attr, rev) => {
    //第二个参数没有传递 默认升序排列
    if (rev === undefined) {
      rev = 1;
    } else {
      rev = (rev) ? 1 : -1;
    }
    return function(a, b) {
      a = a[attr];
      b = b[attr];
      if (a < b) {
        return rev * -1;
      }
      if (a > b) {
        return rev * 1;
      }
      return 0;
    };
  };

  return (
    <Card
      bordered={false}
      bodyStyle={{
        padding: 0,
      }}
    >
      <div className={styles.WaterEle}>
        <Tabs
          size='large'
          tabBarStyle={{
            marginBottom: 24,
          }}
        >
          <TabPane tab='水费' key='water'>
            <Row>
              <Col xl={18} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.salesBar}>
                  <Column
                    height={300}
                    forceFit
                    data={waterData}
                    xField={`month`}
                    yField='waterPrice'
                    xAxis={{
                      visible: true,
                      title: {
                        visible: false,
                      },
                    }}
                    yAxis={{
                      visible: true,
                      title: {
                        visible: false,
                      },
                    }}
                    title={{
                      visible: true,
                      text: '本年度水费',
                      style: {
                        fontSize: 14,
                      },
                    }}
                    meta={{
                      y: {
                        alias: '访问量',
                      },
                    }}
                  />
                </div>
              </Col>
              <Col xl={6} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.salesRank}>
                  <h4 className={styles.rankingTitle}>水费排行</h4>
                  <ul className={styles.rankingList}>
                    {waterListData.map((item, i) => (
                      <li key={item.title}>
                      <span className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}>
                        {i + 1}
                      </span>
                        <span className={styles.rankingItemTitle} title={item.title}>
                        {item.month ? item.month : ''}
                      </span>
                        <span className={styles.rankingItemTitle}> {item.waterNum ? item.waterNum : ''} 吨</span>
                        <span className={styles.rankingItemValue}>
                        {item.waterPrice ? item.waterPrice : ''} 元
                      </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab='电费' key='electricity'>
            <Row>
              <Col xl={18} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.salesBar}>
                  <Column
                    height={300}
                    forceFit
                    data={eleData}
                    xField={`month`}
                    yField='elePrice'
                    xAxis={{
                      visible: true,
                      title: {
                        visible: false,
                      },
                    }}
                    yAxis={{
                      visible: true,
                      title: {
                        visible: false,
                      },
                    }}
                    title={{
                      visible: true,
                      text: '本年度电费',
                      style: {
                        fontSize: 14,
                      },
                    }}
                    meta={{
                      y: {
                        alias: '电费：',
                      },
                    }}
                  />
                </div>
              </Col>
              <Col xl={6} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.salesRank}>
                  <h4 className={styles.rankingTitle}>电费排行</h4>
                  <ul className={styles.rankingList}>
                    {eleListData.map((item, i) => (
                      <li key={item.title}>
                      <span className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}>
                        {i + 1}
                      </span>
                        <span className={styles.rankingItemTitle} title={item.title}>
                        {item.month ? item.month : ''}
                      </span>
                        <span className={styles.rankingItemTitle}> {item.eleNum ? item.eleNum : ''} 度</span>
                        <span className={styles.rankingItemValue}>
                        {item.elePrice ? item.elePrice : ''} 元
                      </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </div>
    </Card>
  );
};

export default WaterEle;

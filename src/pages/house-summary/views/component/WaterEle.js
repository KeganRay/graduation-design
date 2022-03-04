import React from "react";
import { Card, Col, Row, Tabs,Button } from 'antd';
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

const salesData = []
for (let i = 0; i < 12; i += 1) {
  salesData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200,
  });
}

const WaterEle = ({
  rangePickerValue,
  isActive,
  handleRangePickerChange,
  loading,
  selectDate,
}) => (
  <Card
    loading={loading}
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
        <TabPane tab='销售额' key='sales'>
          <Row>
            <Col xl={16} lg={12} md={12} sm={24} xs={24}>
              <div className={styles.salesBar}>
                <Column
                  height={300}
                  forceFit
                  data={salesData}
                  xField='x'
                  yField='y'
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
                    text: '销售趋势',
                    style: {
                      fontSize: 14,
                    },
                  }}
                  meta={{
                    y: {
                      alias: '销售量',
                    },
                  }}
                />
              </div>
            </Col>
            <Col xl={8} lg={12} md={12} sm={24} xs={24}>
              <div className={styles.salesRank}>
                <h4 className={styles.rankingTitle}>门店销售额排名</h4>
                <ul className={styles.rankingList}>
                  {rankingListData.map((item, i) => (
                    <li key={item.title}>
                      <span className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}>
                        {i + 1}
                      </span>
                      <span className={styles.rankingItemTitle} title={item.title}>
                        {item.title}
                      </span>
                      <span className={styles.rankingItemValue}>
                        {numeral(item.total).format('0,0')}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>
          </Row>
        </TabPane>
        <TabPane tab='访问量' key='views'>
          <Row>
            <Col xl={16} lg={12} md={12} sm={24} xs={24}>
              <div className={styles.salesBar}>
                <Column
                  height={300}
                  forceFit
                  data={salesData}
                  xField='x'
                  yField='y'
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
                    text: '访问量趋势',
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
          </Row>
        </TabPane>
      </Tabs>
    </div>
  </Card>
);

export default WaterEle;

import React, { Component } from 'react';
import { Row, Col, Card, Typography, List, Button } from 'antd';

const { Paragraph } = Typography;
import style from './index.less';
import styles from '@/pages/list/card-list/style.less';
import { PlusOutlined } from '@ant-design/icons';
// import {useRequest} from "umi";
import * as services from '@/pages/list/card-list/service';
import { history } from 'umi';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [], //展示列表数组
    };
  }

  componentDidMount() {
    services.queryFakeList({ count: 10 }).then((res) => {
      console.log(res);
      const list = res?.data?.list || [];
      console.log(1, list);
      this.setState({ list });
    });
  }

  render() {
    const { list } = this.state;
    console.log('ren', list);
    const nullData = {};
    return (
      <div className={style.wrapper}>
        <Row gutter={24}>
          <Col span={24}>
            <List
              rowKey="id"
              // loading={loading}
              grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 3,
                lg: 3,
                xl: 4,
                xxl: 4,
              }}
              dataSource={list}
              renderItem={(item) => {
                if (item && item.id) {
                  return (
                    <List.Item key={item.id}>
                      <Card
                        hoverable
                        className={styles.card}
                        actions={[
                          <a
                            key="option1"
                            onClick={() => {
                              history.push(`/houseSummary/houseDetail?id=${item.id}`);
                            }}
                          >
                            查看详情
                          </a>,
                        ]}
                      >
                        <Card.Meta
                          avatar={<img alt="" className={styles.cardAvatar} src={item.avatar} />}
                          title={<a>{item.title}</a>}
                          description={
                            <Paragraph
                              className={styles.item}
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
                    <Button type="dashed" className={styles.newButton}>
                      <PlusOutlined /> 新增产品
                    </Button>
                  </List.Item>
                );
              }}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Index;

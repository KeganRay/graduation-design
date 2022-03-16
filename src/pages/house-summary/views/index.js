import React, { useEffect, useState } from 'react';
import { Card, Typography, List, Button, Modal, message } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import style from './index.less';
import * as services from '@/pages/list/card-list/service';

const { Paragraph } = Typography;
import { history, useModel } from 'umi';
import noDataLogo from '../../../../public/image/noData.jpg';
import { DeleteOutlined } from '@ant-design/icons';

const Index = () => {
    //状态
    const [list, setList] = useState([]); //展示列表数组
    const { initialState, setInitialState } = useModel('@@initialState'); //用于全局管理登陆者信息
    const [showDel, setShowDel] = useState(false);
    const [houseData, setHouseData] = useState({});


    //componentDidMount
    useEffect(() => {
      const { userId,userType,phone } = initialState.currentUser;
      //房东
      if(userType===1){
        if (userId) {
          services.queryHouseList(userId).then((res) => {
            if (res && res.data.code === 0 && res.data.data.length > 0) {
              console.log('房源列表', res);
              const list = res?.data?.data || [];
              setList(list);
            }
          });
        }
      }else if(userType===2){
        services.tenantFindHouseByAccount(phone).then((ress) => {
          console.log(ress);
          if (ress && ress.data && ress.data.code === 0) {
            history.push(`/house-detail?houseId=${ress.data.data.houseId}`);
          }
        });
      }

    }, []);

    //创建房源
    const handleNewHouse = () => {
      history.push('/new-house');
    };

    //删除房源
    const delHouse = (item) => {
      services.delHouse({houseId:item.houseId}).then((res) => {
        if (res.data && res.data.code === 0) {
          message.success('删除房源成功！', 1, () => {
            const { userId } = initialState.currentUser;
            services.queryHouseList(userId).then((res) => {
              if (res && res.data.code === 0 && res.data.data.length > 0) {
                // console.log('数组列表', res);
                const list = res?.data?.data || [];
                setList(list);
                setShowDel(false)
              }
            });
          });
        }
      });
    };

    const toDetail = (item) => {
      history.push(`/house-detail?houseId=${item.houseId}`);
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
                console.log(item);
                return (
                  <div>
                    <List.Item key={item.houseId}>
                      <Card
                        hoverable
                        className={style.card}
                        actions={[<a key='option1' onClick={() => {
                          toDetail(item);
                        }}>房子详情</a>, <a key='option2' className={style.del} onClick={() => {
                          setHouseData(item);
                          setShowDel(true);
                        }}>删除</a>]}
                      >
                        <Card.Meta
                          avatar={<img alt='' className={style.cardAvatar}
                                       src={`http://localhost:27018/upload/getImages/${item.housePic[0]}` || noDataLogo} />}
                          title={<a
                            style={{ fontSize: '22px', fontWeight: 'bold' }}>{item?.houseName || ''}</a>}
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
                  </div>
                );
              }
              return (
                <List.Item>
                  <Button type='dashed' className={style.newButton} onClick={handleNewHouse}>
                    <PlusOutlined /> 新增房源
                  </Button>
                </List.Item>
              );
            }}
          />
        </div>
        <Modal
          title={<div style={{
            fontSize: '20px',
            fontWeight: 'bold',
          }}><DeleteOutlined /> <span>警告！</span></div>}
          visible={showDel}
          // icon: <DeleteOutlined />
          onOk={() => {
            delHouse(houseData);
          }}
          onCancel={() => {
            setShowDel(false);
          }}
          okText='确认'
          cancelText='取消'
        >
          <span style={{ fontSize: '20px' }}>{`确认删除`} <span
            style={{ fontWeight: 'bold' }}>{houseData.houseName ? houseData.houseName : ''}</span> {`的数据吗？`}</span>
        </Modal>
      </PageContainer>
    );
  }
;

export default Index;

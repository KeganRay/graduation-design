import React, { useEffect, useState } from 'react';
import { DeleteOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Dropdown,
  Input,
  List,
  Menu,
  Modal,
  message,
  Radio,
  Row,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { history } from 'umi';
import OperationModal from './components/OperationModal';
import * as services from '../../services/services';
import styles from './index.less';
import { groupBy } from 'lodash';


const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

/**
 * @Description:根据userType分类  0超管、1房东、2租客
 * @date 2022/3/17
 */
const groupUser = (data) => {
  if (!data || data.length === 0 || !Array.isArray(data)) {
    return [];
  }
  let allUser = groupBy(data, 'userType');//有分类的人
  allUser.allUser = data;//所有人
  return allUser;
};

const Info = ({ title, value, bordered }) => (
  <div className={styles.headerInfo}>
    <span>{title}</span>
    <p>{value}</p>
    {bordered && <em />}
  </div>
);


const ListContent = ({ data: { sex, registrationAddress, percent, status } }) => {
  return (<div className={styles.listContent}>
    {/*<div className={styles.listContentItem}>*/}
    {/*  <span>性别</span>*/}
    {/*  <p></p>*/}
    {/*</div>*/}
    {/*<div className={styles.listContentItem}>*/}
    {/*<span>联系地址</span>*/}
    {/*<p>{registrationAddress}</p>*/}
    {/*</div>*/}
    {/*<div className={styles.listContentItem}>*/}
    {/*  <Progress*/}
    {/*    percent={percent}*/}
    {/*    status={status}*/}
    {/*    strokeWidth={6}*/}
    {/*    style={{*/}
    {/*      width: 180,*/}
    {/*    }}*/}
    {/*  />*/}
    {/*</div>*/}
  </div>);
};


export const userList = () => {
  const [isload, setIsload] = useState(true);
  const [isDel, setIsDel] = useState(false);//删除框
  const [userdata, setUserdata] = useState([]);//所有用户的数据
  const [currentList, setCurrentList] = useState([]);//当前tab页的数据
  const [currentUser, setCurrentUser] = useState('');//当前想要删除的数据的数据


  useEffect(() => {
    initUserData();
  }, []);


  //列表配置
  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize: 7,
    total: currentList?.allUser?.length || '',
  };

  /**
   * @Description:初始化列表数据
   * @date 2022/3/18
   */
  const initUserData = () => {
    services.queryAllUsers().then((res) => {
      if (res && res.data && res.data.code === 0) {
        const userdata = groupUser(res.data.data);
        setUserdata(userdata);
        setCurrentList(userdata.allUser);//设置默认值
        setIsload(false);
      }
    });
  };

  /**
   * @Description:列表切换
   * @date 2022/3/17
   */
  const handleTabChange = (data) => {
    const selTab = data.target.value;
    services.queryAllUsers().then((res) => {
      if (res && res.data && res.data.code === 0) {
        const userdata = groupUser(res.data.data);
        setUserdata(userdata);
        setIsload(false);
        setCurrentList(userdata[selTab]);//设置当前值
      }
    });
  };

  /**
   * @param:搜索的用户名
   * @Description:
   * @date 2022/3/17
   */
  const searchPeople = (value) => {
    console.log(userdata, value);
    if (Array.isArray(userdata.allUser)) {
      const matchPeople = [];
      userdata.allUser.map((item) => {
        if (item.name === value) {
          matchPeople.push(item);
          console.log(matchPeople);
          setCurrentList(matchPeople);
        }
      });
    } else {
      message.error('数据发生错误', 2);
    }
  };

  /**
   * @Description:删除用户
   * @date 2022/3/18
   */
  const delUser = (value) => {
    const { userId } = value;
    services.delUser({ userId }).then((res)=>{
      if(res&&res.data&&res.data.code===0){
        message.success(res.data.message,1,()=>{
          initUserData()
          setIsDel(false)
        })
      }else{
        message.error(res.data.message,1)
      }
    })
  };

  const extraContent = (
    <div className={styles.extraContent}>
      <RadioGroup defaultValue='allUser' onChange={handleTabChange}>
        <RadioButton value='allUser'>全部</RadioButton>
        <RadioButton value='1'>房东</RadioButton>
        <RadioButton value='2'>房客</RadioButton>
      </RadioGroup>
      <Search className={styles.extraContentSearch} placeholder='请输入' onSearch={searchPeople}
      />
    </div>
  );

  return (
    <div>
      <PageContainer>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <Row>
              <Col sm={8} xs={24}>
                <Info title='系统总人数' value={`${userdata?.allUser?.length || ''}`} bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title='房东人数'
                      value={`${userdata && userdata['1'] && userdata['1'].length ? userdata['1'].length : ''}`}
                      bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title='租客人数'
                      value={`${userdata && userdata['2'] && userdata['2'].length ? userdata['2'].length : ''}`}
                      bordered />
              </Col>
            </Row>
          </Card>

          <Card
            className={styles.listCard}
            bordered={false}
            title='基本列表'
            style={{
              marginTop: 24,
            }}
            bodyStyle={{
              padding: '0 32px 40px 32px',
            }}
            extra={extraContent}
          >
            <List
              size='large'
              rowKey='userId'
              loading={isload}
              pagination={paginationProps}
              dataSource={currentList}
              renderItem={(item) => {
                return (
                  <List.Item
                    actions={[
                      <a
                        key='edit'
                        onClick={() => {
                          history.push(`/account/settings?userId=${item.userId}`);
                        }}
                      >
                        编辑
                      </a>,
                      <a
                        key='delete'
                        onClick={() => {
                          setIsDel(true);
                          setCurrentUser(item);
                        }}
                        className={styles.del}

                      >
                        删除
                      </a>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar
                        src={'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'}
                        shape='square' size='large' />}
                      title={<a>{item.name}</a>}
                      description={
                        <div className={styles.descList}>
                          <div>{`电话：${item.phone}`}</div>
                          <div className={styles.descItem}>{`邮箱：${item.email}`}</div>
                          <div>{`性别：${item.sex === 1 ? '男' : item.sex === 2 ? '女' : '未知'}`}</div>
                          <div className={styles.descItem}>{`联系地址：${item.ContactAddress || ''}`}</div>
                        </div>}
                    />
                    <ListContent data={item} />
                  </List.Item>
                );
              }
              }
            />
          </Card>
          <Modal
            visible={isDel}
            width={640}
            title={
              <div style={{
                fontSize: '20px',
                fontWeight: 'bold',
              }}><DeleteOutlined /> <span>警告！</span></div>
            }
            bodyStyle={{
              padding: '32px 40px 48px',
            }}
            destroyOnClose
            onOk={() => {
              delUser(currentUser);
            }}
            onCancel={() => {
              setIsDel(false);
            }}
          >
            <h2>{`确认删除`}  <span style={{fontWeight:"bold"}}>{currentUser?.name || ''}</span>  {`的数据吗？`}</h2>
          </Modal>
        </div>
      </PageContainer>
    </div>
  );
};
export default userList;

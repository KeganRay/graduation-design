import { useIntl, useSt } from 'umi';
import { useState } from 'react';
import { GithubOutlined, WechatOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';
import { Modal } from 'antd';
import myWechat from '../../../public/image/myWechat.jpg';

export default () => {
  const [Visable, setVisable] = useState(false);

  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: '创作人：尤兆荣',
  });
  const currentYear = new Date().getFullYear();
  return (
    <div>
      <DefaultFooter
        copyright={`${currentYear} ${defaultMessage}`}
        links={[
          {
            key: 'github',
            title: <GithubOutlined />,
            href: 'https://github.com/ant-design/ant-design-pro',
            blankTarget: true,
          },
          {
            key: 'Wechat',
            title: (
              <WechatOutlined
                onClick={() => {
                  setVisable(true);
                }}
              />
            ),
            blankTarget: true,
          },
        ]}
      />
      <Modal
        visible={Visable}
        footer={null}
        onCancel={() => {
          setVisable(false);
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <img width={'350px'} height={'450px'} src={myWechat} alt="WeChat" />
        </div>
      </Modal>
    </div>
  );
};

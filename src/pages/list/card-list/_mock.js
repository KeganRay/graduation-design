//名字
const titles = [
  '御水湾',
  '乐府江南',
  '浅水湾',
  '西山枫林',
  '书苑名家',
  '风华里',
  '铂悦府',
  '墨香楼',
  '凌月馆',
  '优山美诗',
  '舞魅楼',
  '清情楼',
  '倾梦轩',
];

//图标
const avatars = [
  'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg1.doubanio.com%2Fview%2Fgroup_topic%2Fl%2Fpublic%2Fp142146668.jpg&refer=http%3A%2F%2Fimg1.doubanio.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1645171265&t=c543f6217a14c4e0c13f190a03112c2e',
  'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0509%252F6657d920j00qstf0m001mc000hs00buc.jpg%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1645171265&t=aa11fdfb4bec408f1eca744c4decf25f',
  'https://ss3.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/e850352ac65c10386557d08cb2119313b07e8956.jpg',
  'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.redocn.com%2Fsheying%2F20150526%2Fxiaoquloupan_4410458.jpg&refer=http%3A%2F%2Fimg.redocn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1645171265&t=fb698ccf2f3caae43c09a3b087264d80',
  'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fis2.qfangimg.com%2Fbroker%2F2015%2F0%2F18%2F800x600%2F1829734f-bcd2-46d3-8ffc-d91c343c0ac0.jpg&refer=http%3A%2F%2Fis2.qfangimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1645171265&t=1f6440ae1f05bd3232e69285ee573ee3',
  'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic17.nipic.com%2F20111023%2F3997131_132223272000_2.jpg&refer=http%3A%2F%2Fpic17.nipic.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1645171265&t=bba36512eecdf56cae7b0897953eb2eb',
  'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.redocn.com%2Fsheying%2F20150408%2Fchifengshizhuzhaixiaoqu_4099208.jpg&refer=http%3A%2F%2Fimg.redocn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1645171265&t=0fc0652ab46b284acdacf662a39c7016',
  'https://img2.baidu.com/it/u=3232214447,1413112475&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=345',
  'https://img2.baidu.com/it/u=1966833169,1791002679&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=355',
  // 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png', // Alipay
  // 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png', // Angular
  // 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png', // Ant Design
  // 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png', // Ant Design Pro
  // 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png', // Bootstrap
  // 'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png', // React
  // 'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png', // Vue
  // 'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png', // Webpack
];

const covers = [
  'https://gw.alipayobjects.com/zos/rmsportal/uMfMFlvUuceEyPpotzlq.png',
  'https://gw.alipayobjects.com/zos/rmsportal/iZBVOIhGJiAnhplqjvZW.png',
  'https://gw.alipayobjects.com/zos/rmsportal/iXjVmWVHbCJAyqvDxdtx.png',
  'https://gw.alipayobjects.com/zos/rmsportal/gLaIAoVWTtLbBWZNYEMg.png',
];
const desc = [
  '那是一种内在的东西， 他们到达不了，也无法触及的',
  '希望是一个好东西，也许是最好的，好东西是不会消亡的',
  '生命就像一盒巧克力，结果往往出人意料',
  '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
  '那时候我只会想自己想要什么，从不想自己拥有什么',
];
const user = [
  '付小小',
  '曲丽丽',
  '林东东',
  '周星星',
  '吴加好',
  '朱偏右',
  '鱼酱',
  '乐哥',
  '谭小仪',
  '仲尼',
];
const address = [
  '广东省广州市天河区建中路1号',
  '广东省广州市番禺区建业路14号',
  '广东省广州市荔湾区建国路13号',
  '广东省广州市越秀区开发大道路11号',
  '广东省广州市花都区焦裕禄6号',
  '广东省广州市黄埔区教育路4号',
  '广东省广州市南沙区人民路3号',
  '广东省广州市白云区解放路2号',
  '广东省广州市白云区解放路2号',
  '广东省广州市白云区解放路2号',
  '广东省广州市白云区解放路2号',
];

function fakeList(count) {
  const list = [];

  for (let i = 0; i < count; i += 1) {
    list.push({
      id: `fake-list-${i}`,
      owner: user[i % 10],
      title: titles[i % 8],
      avatar: avatars[i % 8],
      cover: parseInt(`${i / 4}`, 10) % 2 === 0 ? covers[i % 4] : covers[3 - (i % 4)],
      status: ['active', 'exception', 'normal'][i % 3],
      percent: Math.ceil(Math.random() * 50) + 50,
      logo: avatars[i % 8],
      href: 'https://ant.design',
      updatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i).getTime(),
      createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i).getTime(),
      subDescription: desc[i % 5],
      description: `地址：${address[i % 10]}`,
      activeUser: Math.ceil(Math.random() * 100000) + 100000,
      newUser: Math.ceil(Math.random() * 1000) + 1000,
      star: Math.ceil(Math.random() * 100) + 100,
      like: Math.ceil(Math.random() * 100) + 100,
      message: Math.ceil(Math.random() * 10) + 10,
      content:
        '段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。',
      members: [
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png',
          name: '曲丽丽',
          id: 'member1',
        },
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png',
          name: '王昭君',
          id: 'member2',
        },
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png',
          name: '董娜娜',
          id: 'member3',
        },
      ],
    });
  }

  return list;
}

function getFakeList(req, res) {
  const params = req.query;
  const count = Number(params.count) * 1 || 20;
  const result = fakeList(count);
  return res.json({
    data: {
      list: result,
    },
  });
}

export default {
  'GET  /api/card_fake_list': getFakeList,
};

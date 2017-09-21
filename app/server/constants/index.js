const moment = require('moment');

const groupUri = {
  douban: [
    'http://www.douban.com/group/search?cat=1013&group=146409',
    'http://www.douban.com/group/search?cat=1013&group=76231',
    // 'http://www.douban.com/group/search?cat=1013&group=259227',
    // 'http://www.douban.com/group/search?cat=1013&group=467799',
    // 'http://www.douban.com/group/search?cat=1013&group=383972',
    // 'http://www.douban.com/group/search?cat=1013&group=558444',
    // 'http://www.douban.com/group/search?cat=1013&group=190720',
  ],
  lianjia: [],
  58: '',
};
const groupName = {
  douban: [
    '上海租房',
    '上海租房---房子是租来的，生活不是',
    '上海租房（不良中介勿扰）',
    '上海租房@房东直租',
    '上海合租族_魔都租房',
    '上海租房大全',
    '上海租房',
  ],
  lianjia: '链家',
  58: '58同城',
};

const startTime = moment().subtract(15, 'days').format('YYYY-MM-DD');
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const groupFilter = {
  title: '.td-subject > a@title',
  url: '.td-subject > a@href',
  replyTime: '.td-time@title',
  reply: '.td-reply > span',
};

const topicMaxCount = 100;

module.exports = {
  groupUri,
  groupName,
  groupFilter,
  dateFormat,
  startTime,
  topicMaxCount,
};

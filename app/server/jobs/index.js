const osmosis = require('osmosis');
const cron = require('cron');
const mapLimit = require('promise-maplimit');
const moment = require('moment');
const Promise = require('bluebird');
const { isEmpty, find, flatten, reject, xorWith, assign } = require('lodash');
const CONST = require('../constants');
const Topic = require('../models/Topic');
const Source = require('../models/Source');
const Keyword = require('../models/Keyword');

const fetchGroupTopics = (url, keyword, maxCount) => (
  Promise.delay(1000).then(() => (
    new Promise((resolved, rejected) => {
      const itemLimit = 50;
      const topics = [];
      let pageCount = 0;
      const fetchData = osmosis.get(url, { q: keyword, sort: 'time', start: 1 })
        // .proxy((proxyErr, url) => {
        //   let dispatcher = proxyDispatcher(url.host);
        //   if (proxyErr)
        //     dispatcher.fail(proxyErr);
        //   else
        //     return dispatcher.get();
        // })
        // .paginate({ start: +itemLimit }, '.thispage@data-total-page')

        .paginate({ start: +itemLimit }, maxCount / itemLimit)
        .then((ctx) => {
          pageCount = ctx.request.params.start;
        })
        .find('tr.pl')
        .set(CONST.groupFilter)
        .then((ctx, topic, next, done) => {
          if (topic.title) {
            const crawlTime = moment().format(CONST.dateFormat);
            let newTopic = {
              crawlTime,
              keyword,
            };
            newTopic = assign(newTopic, topic);
            topics.push(newTopic);
            next(ctx, newTopic);
          }
          if (pageCount >= maxCount) {
            resolved(topics);
            done();
          }
        })

        .log(console.log)
        .error((error) => {
          console.log(`❗️❗️❗️❗️❗️❗️❗️❗️❗️错误信息：${error}❗️❗️❗️❗️❗️❗️❗️❗️❗️`);
          rejected(error);
        })
        // .debug(console.log);
    })
  ))
);

let expiredCount = 0;
const isExpired = (time) => {
  const startTime = moment(CONST.startTime);
  const topicTime = moment(time);

  if (topicTime.isBefore(startTime)) {
    expiredCount += 1;
    console.log(`设定的时间时间：${CONST.startTime}，帖子时间：${time}，无效帖子${expiredCount}`);
  }
  return topicTime.isBefore(startTime);
};

const syncData = async () => {
  const lap = moment();
  console.log(`✨================================> 📦  开始获取${lap.format(CONST.dateFormat)}   📦 <================================✨`);
  let topics = [];
  try {
    topics = await Topic.find({});
    const keywords = await Keyword.find({});
    const sources = await Source.find({});

    if (isEmpty(keywords)) {
      console.log('关键字为空');
      return;
    }
    if (isEmpty(sources)) {
      console.log('来源为空');
      return;
    }

    let paramsArray = keywords.map((keyword) => {
      const list = [];
      if (keyword.type !== 1) {
        sources.map((source) => {
          source.entry.map((item) => {
            list.push({ title: item.title, uri: item.url, keyword: keyword.name });
            return item;
          });
          return source;
        });
      }
      return list;
    });

    paramsArray = flatten(paramsArray);
    let newTopics = await mapLimit(paramsArray, 1, (p) => {
      console.log(`=================> 开始获取 "${p.title}" [${p.keyword}] 的帖子<=================`);
      return fetchGroupTopics(p.uri, p.keyword, CONST.topicMaxCount).then(resp => resp);
    });
    newTopics = flatten(newTopics);

    // 新数据与旧数据的排除
    topics = xorWith(
      topics,
      newTopics,
      (a, b) => (a.title === b.title || a.url === b.url));
    topics = reject(topics, topic => (!!topic._id));
    console.log(`=================> 爬取topics.length:${topics.length} <=================`);
    // 筛选无效时间的帖子
    topics = reject(topics, topic => (
      isExpired(topic.replyTime)
    ));
    console.log(`=================> 筛选无效时间后topics.length:${topics.length} <=================`);
    // 排除黑名单帖子
    topics.map((topic, index) => {
      const blackKeyword = find(keywords, keyword => keyword.type === 1 && topic.title.indexOf(keyword.name) > 0);
      if (blackKeyword) {
        topics.splice(index, 1); // eslint-disable-line
      }
    });

    console.log(`=================> 屏蔽黑名单后topics.length:${topics.length} <=================`);
    // 将帖子关联到关键字集合中
    topics = topics.map((topic) => {
      const keyword = find(keywords, ['name', topic.keyword]);
      if (keyword) {
        topic.keyword = keyword._id; // eslint-disable-line
      }
      return topic;
    });

    await Topic.insertMany(topics);
  } catch (error) {
    console.log(error);
  }
  console.log(`✨================================> 有效帖子 ${topics.length} topics 花费时间 ${moment().diff(lap, 'milliseconds')}ms. <================================✨`);
};


const job = new cron.CronJob({
  cronTime: '* */120 8-22 * * *', // 每天8-22点之间，隔两个小时刷新一次
  onTick: false,
  start: true,
  timeZone: 'Asia/Shanghai',
});


const start = () => {
  // syncData();
  job.start();
};

module.exports = {
  start,
};

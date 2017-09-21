<template>
  <el-row>
    <el-col :xs="24" :md="24">
      <el-row type="flex" class="head" justify="space-around">
        <el-col :span="10">
          <h1 class="logo"><img src="../assets/images/logo.png">租房爬虫</h1>
        </el-col>
        <el-col :span="6">
          <div class="source-panel">
            <el-select v-model="platformSelected" placeholder="请选择">
              <el-option
                v-for="item in platform"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled">
              </el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="info" justify="space-around">
        <el-col :xs="22" :md="20" >
          <h2>列表<small><span>爬取{{time}}（15天）前的数据</span></small></h2>
        </el-col>
      </el-row>
      <el-row class="content" type="flex" justify="space-around">
        <el-col :xs="22" :md="20" >
          <el-col :md="17" :xs="24" v-loading.body="loading">
            <Nothing v-if="topicsEmpty"></Nothing>
            <div class="rental-group" v-else>
              <div class="rental-list">
                <div class="rental-item" v-for="item in topics.docs" v-bind:key="item.id" v-bind:title="item.title"> 
                  <a :href="item.url" :title="item.title" target="_blank">
                    {{ item.title }}
                  </a>
                  <div class="rental-extra">
                    <span><icon name="hashtag"></icon>{{ item.keyword.name }}</span>
                    <span><icon name="clock-o"></icon>{{ item.replyTime }}</span>
                    <span><icon name="comment-o"></icon>{{ item.reply }}</span>
                  </div>
                </div>
              </div>
              <div class="paginate">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page.sync="currentPage"
                  :page-sizes="[20, 50, 100, 200]"
                  :page-size="topics.limit"
                  layout="total,sizes, prev, pager, next"
                  :total="topics.total">
                </el-pagination>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :md="{span: 6, offset: 1}">
            <keyword :keyword-list="keywords" v-on:keyword-changed="fetchTopicsByKeyword" ></keyword>
            <sources :list="sources"></sources>
            <el-alert
              v-if="!topicsEmpty"
              class="alert-info"
              title="最近一次爬虫时间"
              type="info"
              show-icon
              :closable="false">
              <div>
                {{!topicsEmpty ? topics.docs && topics.docs[0].crawlTime : '没有空抓' }}
              </div>
            </el-alert>
          </el-col>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import Vue from 'vue';
import moment from 'moment'
import Keyword from './Keyword'
import Nothing from './Nothing'
import Sources from './Sources'
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons/clock-o'
import 'vue-awesome/icons/hashtag'
import 'vue-awesome/icons/comment-o'

moment.locale('zh-cn');

export default {
  mounted() {
    this.fetchTopics();
    this.fetchKeywords();
    this.fetchSources();
  },
  data() {
    return {
      loading: !1,
      currentPage: 1,
      topicsEmpty: !1,
      platformSelected: 'douban',
      time: moment().subtract(15, 'days').format('LL'),
      topics: {
        total: 0,
        limit: 20,
      },
      platform: [{
        value: 'douban',
        label: '豆瓣',
      }, {
        value: 'nothing',
        label: '不好意思你被骗了没有东西可以点',
        disabled: true,
      }, {
        value: '58',
        label: '58同城',
        disabled: true,
      }, {
        value: 'lianjia',
        label: '链家',
        disabled: true,
      }],
      keywords: [],
      keywordId: '',
      sources: [],
    }
  },
  methods: {
    fetchKeywords() {
      this.loading = !0;
      Vue.http.get('/api/keywords',)
      .then(res => {
        this.loading = !1;
        if (res.status === 200) {
          this.keywords = res.body.keywords;
          this.keywords.unshift({ name : "全部", description : "全部" });
        }
      }, () => {
        this.loading = !1;
        this.$message.error('啊哦，加载数据失败');
      })
    },
    fetchSources() {
      this.loading = !0;
      Vue.http.get('/api/sources',)
      .then(res => {
        this.loading = !1;
        if (res.status === 200) {
          this.sources = res.body.sources;
        }
      }, () => {
        this.loading = !1;
        this.$message.error('啊哦，加载数据失败');
      })
    },
    fetchTopics() {
      this.loading = !0;
      const keyword = this.keywordId ? `&keyword=${this.keywordId}` : '';
      const uri = `/api/topics?size=${this.topics.limit}&page=${this.currentPage}${keyword}`;
      Vue.http.get(uri)
      .then(res => {
        this.loading = !1;
        if (res.status === 200) {
          this.topics = res.body.topics;
          this.topicsEmpty = res.body.topics.total === 0;
        }
      }, () => {
        this.loading = !1;
        this.$message.error('啊哦，加载数据失败');
      })
    },
    fetchTopicsByKeyword(id) {
      this.keywordId = id;
      this.currentPage = 1;
      this.fetchTopics();
    },
    handleSizeChange(val) {
      this.topics.limit = val;
      this.fetchTopics();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.fetchTopics();
    }
  },
  components: {
		Keyword,
    Nothing,
    Icon,
    Sources,
  }
}
</script>

<style lang="stylus" scoped>
  .el-row.head
    padding: 10px 0
    background #fff
    text-align left
    box-shadow: 0 0px 2px rgba(0, 0, 0, .4)
  h1
    display inline-block
    margin 0
    text-align left
    vertical-align middle
    font-size 18px
  img
    width 44px
    margin-right 10px
    vertical-align middle
  .source-panel
    float right
    display inline-block
    margin-top 5px
    vertical-align middle
    font-size 14px
  .info
    text-align left
    background #e4e8f1
    small
      display inline-block
      margin-left 20px
      font-size 12px
      font-weight 300
    span
      display inline-block
      margin-right 10px
  .el-row.content
    margin-top 40px
    text-align left
  .rental-header
    margin 0
    padding 8px
    font-size 18px
    font-weight 900
    background #eef1f6
    border-radius .2rem
  .rental-item
    border-bottom 1px dotted #c0c0c0
    border-radius .2rem
    a
      display block
      padding 10px 10px 0
      text-decoration none
      color #2c3e50
      font-size 14px
    a:hover
      color #333
      text-decoration none
    a:visited
      color #ccc
    .rental-extra
      display block
      padding 10px
      font-size 12px
      color #777
      span
        display inline-block
        margin-right 20px
      .fa-icon
        width auto
        height 12px 
        margin 2px 3px 0 0
        color #a3a3a3
        vertical-align top
      span:first-child 
        color #13CE66
        .fa-icon
          margin-top 4px
  .rental-item:hover
    background #f8faff
  .update 
    padding 15px
    margin-bottom 30px
    border-radius .2rem
  .alert-info
    font-size 13px
  .paginate
    margin 20px 0
    text-align center
</style>

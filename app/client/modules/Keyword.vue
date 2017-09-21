<template>
  <div class="mod corner mod-keyword">
    <header class="mod-head">
      关键字
    </header>
    <div class="mod-body">
      <dl>
        <dt>当前使用</dt>
        <dd>
          <el-tag
            :key="tag"
            v-for="(tag, index) in keywordList"
            v-if="tag.type !== 1"
            :type="currentTag === index ? 'success' : 'gray'"
            @click.native="handleTagClick(tag.id, index)"
          >
            {{tag.name}}
          </el-tag>
        </dd>
        <dt>已屏蔽</dt>
        <dd>
          <el-tag
            :key="tag"
            v-for="tag in keywordList"
            v-if="tag.type === 1"
            :close-transition="false"
            type="danger"
          >
            {{tag.name}}
          </el-tag>
        </dd>
      </dl>
      <div class="tips">每个关键字爬取前100条记录</div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { isEmpty } from 'lodash';
export default {
  props: {
    keywordList: {
			type: Array,
			default: () => []
		},
  },
  data() {
    return {
      currentTag: 0,
      id: '',
    }
  },
  methods: {
    handleTagClick(id, index) {
      if (this.currentTag !== index) {
        this.currentTag = index;
        this.id = id;        
      }
      this.$emit("keyword-changed", this.id);
    },
  }
}
</script>

<style lang="stylus" scoped>
  .mod-keyword
    .el-tag
      cursor pointer
      padding 0 10px
      margin-right 5px
    dl
      margin 0
      padding 0
      font-size 14px
    dd
      margin 10px 0 15px 0
    dd:last-child
      margin-bottom 0
    .tips
      display block
      margin-top 20px
      text-align right
      font-size 12px
      color #999
</style>


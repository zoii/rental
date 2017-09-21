<template>
  <div class="mod corner mod-sources">
    <header class="mod-head">
      来源
    </header>
    <div class="mod-body">
      <dl v-for="(source, index) in list" v-bind:key="source.id">
        <dt>{{source.name}}</dt>
        <dd v-for="(item, index) in source.entry" v-bind:key="item.id">
          {{item.title}}
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    list: {
			type: Array,
			default: () => []
		},
  },
  data() {
    return {
      
    }
  },
  methods: {
    
  }
}
</script>

<style lang="stylus" scoped>
  .mod-sources
    dl
      margin 0
      padding 0
      font-size 14px
    dt
      background #fff6b5
      padding 5px
      border-radius .2rem
    dd
      margin 10px 10px 10px 20px
      font-size 12px
</style>

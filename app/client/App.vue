<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style lang="stylus">
body
  margin 0

#app 
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50

.mod
    margin 0 0 1rem 0
    padding 1rem
    border 1px solid rgba(34,36,38,.15)
  .mod-head
    font-size 18px
    font-weight 900
  .mod-body
    padding-top .5rem
  .update 
    padding 15px
    margin-bottom 30px
    color #2697cc
    border 1px solid #cde8f5
    background-color #e6f7ff
.corner
  border-radius .2rem
  box-shadow 0 1px 2px 0 rgba(34,36,38,.15)
</style>
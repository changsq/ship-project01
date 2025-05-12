<template>
  <div class="header-bar">
    <!-- <sider-trigger :collapsed="collapsed" icon="md-menu" @on-change="handleCollpasedChange"></sider-trigger> -->
    <div class="logo-con">
      <img src='@/assets/images/logo.jpg' style="width: 200px;height :50px" key="max-logo" />
    </div>
    <div style="font-size: large;font-weight: bold;color: white;margin-top: 20px;">船舶绿色动力系统谱系化及适用性评估平台</div>
    <div class="custom-content-con">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import siderTrigger from './sider-trigger'
import customBreadCrumb from './custom-bread-crumb'
import './header-bar.less'
export default {
  name: 'HeaderBar',
  components: {
    siderTrigger,
    customBreadCrumb
  },
  props: {
    collapsed: Boolean
  },
  computed: {
    breadCrumbList () {
      return this.$store.state.app.breadCrumbList
    }
  },
  methods: {
    handleCollpasedChange (state) {
      this.$emit('on-coll-change', state)
    }
  }
}
</script>

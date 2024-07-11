<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="lhead">
      <div class="lhead-text">主页</div>
      <Dropdown class="gd" @on-click="handleClick">
        <Badge :dot="!!messageUnreadCount">
          <Avatar :src="userAvatar"/>
        </Badge>
        <Icon :size="18" type="md-arrow-dropdown"></Icon>
        <DropdownMenu slot="list">
          <DropdownItem name="logout">退出登录</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
      <div class="mtitle">
          船舶绿色动力系统谱系化与适用性评估系统
      </div>
  <div>
    <Button class="hbutton" type="primary" size="large">简介</Button>
    <Button class="hbutton" type="primary" size="large">动力系统选型</Button>
    <Button class="hbutton" type="primary" size="large">动力系统评测</Button>
    <Button class="hbutton" type="primary" size="large">谱系可视化</Button>
    <Button class="hbutton" type="primary" size="large">系统配置</Button>
  </div>
 
</div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
import { Button } from 'ant-design-vue'
import { reactive, computed } from 'vue'
export default {
  components: {
    LoginForm,
    Button,
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ userName, password }) {
      this.handleLogin({ userName, password }).then(res => {
        this.getUserInfo().then(res => {
          this.$router.push({
            name: this.$config.homeName
           })
        })
      })
     }
  }
}
</script>

<style>

</style>

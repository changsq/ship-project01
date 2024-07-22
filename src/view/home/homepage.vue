<template >
  <div class="login1">
      <div class="mtitle1">
          船舶绿色动力系统谱系化与适用性评估系统
      </div>
      <div class="div1">
        <Button class="hbutton1" type="primary" size="large" @click="showIntro">简介</Button>
        <Button class="hbutton1" type="primary" size="large" @click="showPSC">动力系统选型</Button>
        <Button class="hbutton1" type="primary" size="large" @click="showPST">动力系统评测</Button>
        <Button class="hbutton1" type="primary" size="large" @click="showPuxi">谱系可视化</Button>
        <Button class="hbutton1" type="primary" size="large" @click="showSetting">系统配置</Button>
      </div>
  </div>  
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
import { Button } from 'ant-design-vue'
export default {
  components: {
    LoginForm,
    Button,
  },
  computed: {
    userAvatar () {
      return this.$store.state.user.avatarImgPath
    },
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    handleClick (name) {
      switch (name) {
        case 'logout': this.logout()
          break
        case 'message': this.message()
          break
      }
    },
     showIntro(){
      const introduction = 'introduction'
      this.$router.push({ name: introduction })
     },
     showPST(){
      const power_sys_test = 'power_sys_test'
      this.$router.push({ name: power_sys_test })
     },
     showPSC(){
      const introduction = 'introduction'
      this.$router.push({ name: introduction })
     },
     showPuxi(){
      const puxi = 'puxi'
      this.$router.push({ name: puxi })
     },
     showSetting(){
      const setting = 'setting'
      this.$router.push({ name: setting })
     }
  }
}
</script>
<style scoped>
.login1 {
    height: 100vh; 
    background-image: url('../../assets/images/login-bg.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat; 
    position: relative;
}
.div1{
    margin-top: 25%;
    display: flex;
}
.mtitle1{
    text-align: center; 
    padding-top: 5%; 
    font-size: xx-large; 
    font-weight: 1000;
}
.hbutton1{
    margin-left: 11%;
    font-size: large;

}
</style>

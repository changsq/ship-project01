<style lang="less">
  @import './login.less';
</style>

<template>
<div class="login">
  <div class="lhead">
    <div class="lhead-text">统一身份认证</div>
      <div>
        <Button style="margin: 5% -10%;" type="primary">管理员登陆</Button>
      </div>
  </div>
    <div class="mtitle">
        船舶绿色动力系统谱系化与适用性评估系统
    </div>
  <div style="padding: 5.5% 15%;margin-top: 0;">
      <a-space direction="vertical">
      <a-card title="系统功能简介" style="width: 50%;height: 440px;border-radius: 10px;opacity: 0.95;">
        <p style="font-size: 1.2vw;">绿色动力船舶适用性评估系统致力于研究国际国内航运减排规则和实现路径。系统综合考虑燃料特性、船舶特征及行业发展需求，建立了一个多维度、多要素的评估体系，该体系基于燃料可供性、技术成熟度、船舶经济性、减排贡献度、政策和法规等方面，研究绿色燃料在不同航区、船型和时期等多样化宏观与微观应用场景的适用性。系统构建了算法-模型-配置-服务的机器学习开发流程，形成了适用性评估框架结构，并配置了相应的软硬件环境，开发出具有自进化能力的船舶绿色动力型式适用性评估系统。</p>
      </a-card>
    </a-space>
  </div>
    <div class="login-con" style="opacity: 0.95;">
      <Card icon="log-in" title="账号登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
        </div>
      </Card>
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
<style lang="less">
  @import './login.less';
</style>

<template>
<div class="login">
    <div class="mtitle">
        船舶绿色动力系统谱系化与适用性评估系统
    </div>
  <div style="padding: 5.5% 15%;margin-top: 0;">
      <a-space direction="vertical">
      <a-card title="系统功能简介" style="width: 50%;height: 440px;border-radius: 10px;opacity: 0.95;">
        <p style="font-size: 1.1vw;">船舶绿色动力系统谱系化与适用性评估系统致力于研究国际国内航运减排规则和实现路径，系统综合考虑燃料特性、船舶特征及行业发展需求，建立了一个多维度、多要素的评估体系，该体系基于燃料可供性、技术成熟度、船舶经济性、减排贡献度、政策和法规等方面，研究绿色燃料在不同航区、船型和时期等多样化宏观与微观应用场景的适用性。评估结果通过谱系化方法对船舶绿色动力系统进行科学分类和规划，生成涵盖动力装置类型、燃料类型、功率等级、推进型式等多个维度的船舶绿色动力系统谱系图，并可根据数据、规则与反馈进行及时的更新。开发出了具有自进化能力的船舶绿色动力系统谱系化与适用性评估系统。</p>
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
    Button
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ userName, password }) {
      // this.handleLogin({ userName, password }).then(res => {
      //   this.getUserInfo().then(res => {
          this.$router.push({
            name: this.$config.homeName
        //   })
        // })
      })
    }
  }
}
</script>

<template>
    <div>
      <a-form ref="form" class="div1">
        <a-form-item>
          <div class="div2">
            <div>选择指标：</div>
            <a-select v-model="modification" size="large" class="select1">
              <a-select-option value="0">燃料可供性</a-select-option>
              <a-select-option value="1">经济性</a-select-option>
              <a-select-option value="2">排放性</a-select-option>
              <a-select-option value="3">技术成熟度</a-select-option>
              <a-select-option value="4">安全性</a-select-option>
              <a-select-option value="5">强化程度</a-select-option>
            </a-select>
            <div style="margin-left: 8%;">评估方式：
              <img src="@/assets/images/math-eco.jpg" alt="公式"/>
            </div>
          </div>
          <div>
            <div class="div4">
              <div class="div2">
                <div>C<sub>n</sub>为单位时间动力花费金额/运行成本</div>
                <div class="div3">系数：
                  <a-input-number/>
                </div>
              </div>
              <a-divider />
              <div class="div2">
                <div>T为最大修期（小时）</div>
                <div class="div3">系数：
                  <a-input-number/>
                </div>
              </div>
              <a-divider />
              <div class="div2">
                <div>C<sub>0</sub>为发动机价格</div>
                <div class="div3">系数：
                  <a-input-number/>
                </div>
              </div>
              <a-divider />
              <div class="div2">
                <div>C<sub>1</sub>为外围成本</div>
                <div class="div3">系数：
                  <a-input-number/>
                </div>
              </div>
              <a-divider />
              <div style="margin-left: 4%;font-size: large;font-weight: bold;">注：该值越小越优</div>
            </div>
            <div style="margin-left: 60%;margin-top: 2%;">
              <a-button class="but1" type="primary" size="large"> 恢复默认</a-button>
              <a-button class="but1" type="primary" size="large">确定</a-button>
            </div>
          </div>
        </a-form-item>
      </a-form>
    </div>
</template>

<script>
import { watch } from 'vue'

export default {
  name: 'setting',
  components: {

  },

  data () {
    return {
      modification: '1',
      imageSrc: '@/assets/images/math1.jpg'
    }
  }
}
</script>

<style scoped>
.div1 {
  margin-left: 15%;
}

.div2 {
  display: flex;
  align-items: center;
  font-size: x-large;
  margin-left: 50px;
  margin-right: 20px;
  margin-top: 50px;
}
.div3{
  margin-left: auto;
}
.but1{
  margin-left: 40px;
}
.select1 {
  width: 220px !important;
  height: 40px !important;
  line-height: 40px !important;
  font-size: 16px !important;
}
.div4{
  border: 1px solid #c2c0c0;
  background: white;
  margin-top: 2%;
  width: 80%;
  padding-bottom: 3% ;
  padding-top: 0%;
}
</style>

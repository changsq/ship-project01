<template>
  <div style="display: flex; flex-direction: column; align-items: center;">
    <a-card style="width: 90%; margin-bottom: 20px; background-color: #fbfbfb;">
      <a-form ref="form">
        <div class="form-row">
          <a-form-item class="form-item">
            <span class="label-text">水域：</span>
            <a-select v-model="formData.waters" size="large" class="select">
              <a-select-option value="0">0</a-select-option>
              <a-select-option value="1">1</a-select-option>
              <a-select-option value="2">2</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item class="form-item">
            <span class="label-text">航速：</span>
            <a-input-number v-model="formData.speed" class="input" />
          </a-form-item>
          <a-form-item class="form-item">
            <span class="label-text">吨位：</span>
            <a-input-number v-model="formData.tonnage" class="input" />
          </a-form-item>
          <a-form-item class="form-item">
            <span class="label-text">预算：</span>
            <a-input-number v-model="formData.budget" class="input" />
          </a-form-item>
        </div>
        <div class="form-row">
          <a-form-item class="form-item">
            <span class="label-text">船型：</span>
            <a-select v-model="formData.shipType" size="large" class="select">
              <a-select-option value="0">0</a-select-option>
              <a-select-option value="1">1</a-select-option>
              <a-select-option value="2">2</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item  class="form-item">
            <span class="label-text">方形系数：</span>
            <a-input-number v-model="formData.blockCoefficient" class="input-small" />
          </a-form-item>
          <a-form-item class="form-item">
            <span class="label-text">船身效率：</span>
            <a-input-number v-model="formData.hullEfficiency" class="input-small" />
          </a-form-item>
          <a-form-item class="form-item">
            <span class="label-text">船深：</span>
            <a-input-number v-model="formData.depth" class="input-small" />
          </a-form-item>
        </div>
      </a-form>
    </a-card>

    <a-card title="指标选择与比例设置" style="width: 90%; margin-bottom: 20px; background-color: #fbfbfb;">
      <div class="form-row">
        <a-form-item v-for="(item, index) in items" :key="index" class="form-item2">
          <div class="switch-input-container">
            <a-switch v-model="item.isEditable" class="switch" />
            <span class="label-text">{{ item.label }}：</span>
            <a-input-number v-model="item.value" :disabled="!item.isEditable" class="input-number" />
          </div>
        </a-form-item>
      </div>
      <a-button type="primary" style="align-self: flex-end; margin-top: 10px; margin-left: 90%;" @click="selectAll">全选</a-button>
    </a-card>

    <div style="display: flex; align-items: center; margin-top: 20px; width: 80%;">
      <a-progress :percent="30" style="flex: 1; margin-right: 20px;"/>
      <div style="font-size: medium; font-weight: bold;">预计时间：</div>
    </div>

    <div style="display: flex; justify-content: flex-end; width: 90%; margin-top: 20px;">
      <a-button type="danger" style="margin-right: 10px;" @click="handleClear">清空</a-button>
      <a-button type="primary">开始</a-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      formData: {
        waters: '',
        speed: null,
        tonnage: null,
        budget: null,
        shipType: '',
        blockCoefficient: null,
        hullEfficiency: null,
        depth: null
      },
      items: [
        { label: '经济性', isEditable: false, value: null },
        { label: '排放性', isEditable: false, value: null },
        { label: '安全性', isEditable: false, value: null },
        { label: '燃料可供性', isEditable: false, value: null },
        { label: '技术成熟度', isEditable: false, value: null },
        { label: '强化程度', isEditable: false, value: null }
      ]
    }
  },
  methods: {
    handleClick () {
      this.checkedValue = !this.checkedValue
    },
    show () {
      this.visible = true
    },
    selectAll () {
      this.items.forEach(item => {
        item.isEditable = true
      })
    },
    handleClear () {
      // 重置所有表单项的值
      this.formData = {
        waters: '',
        speed: null,
        tonnage: null,
        budget: null,
        shipType: '',
        blockCoefficient: null,
        hullEfficiency: null,
        depth: null
      }
      this.items.forEach(item => {
        item.isEditable = false
        item.value = null
      })
    }
  }
}
</script>

<style scoped>
.form-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.form-item{
  flex: 1
}
.form-item2 {
  flex: 1 1 30%;
}

.form-item2:nth-child(4), .form-item2:nth-child(5), .form-item2:nth-child(6) {
  flex: 1 1 20%;
}

.select {
  width: 200px !important;
}

.input, .input-small, .input-number {
  width: 80px !important;
  vertical-align: middle;
}

.input-small {
  width: 60px !important;
}

.switch-input-container {
  display: flex;
  align-items: center;
}

.switch {
  margin-right: 10px;
}

.label-text {
  margin-right: 10px;
}

.error {
  color: red;
  margin-top: 5px;
}
</style>

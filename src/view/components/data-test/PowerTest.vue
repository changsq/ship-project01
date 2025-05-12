<template>
  <a-modal
    :visible="visible"
    :width="1100"
    @cancel="Oncancel"
  >
    <template #title>
      <span class="modal-title">添加/编辑参数</span>
    </template>
    <a-card  style="display: flex; flex-wrap: wrap; width: 90%; margin: auto;margin-bottom: 20px; background-color: #fbfbfb;">
      <a-form ref="form" class="div1">
        <a-form-item label="水域" class="div2">
          <a-select v-model="formData.waters" size="large" class="select1">
            <a-select-option value="0">0</a-select-option>
            <a-select-option value="1">1</a-select-option>
            <a-select-option value="2">2</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="航速" class="div2">
          <a-input-number v-model="formData.speed" id="inputNumber" />
        </a-form-item>
        <a-form-item label="吨位" class="div2">
          <a-input-number v-model="formData.tonnage" id="inputNumber" />
        </a-form-item>
        <a-form-item label="预算" class="div2">
          <a-input-number v-model="formData.budget" id="inputNumber" />
        </a-form-item>
        <a-form-item label="船型" class="div2">
          <a-select v-model="formData.shipType" size="large" class="select1">
            <a-select-option value="0">0</a-select-option>
            <a-select-option value="1">1</a-select-option>
            <a-select-option value="2">2</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="方形系数" class="div2">
          <a-input-number v-model="formData.blockCoefficient" id="inputNumber" />
        </a-form-item>
        <a-form-item label="船身效率" class="div2">
          <a-input-number v-model="formData.hullEfficiency" id="inputNumber" />
        </a-form-item>
        <a-form-item label="船深" class="div2">
          <a-input-number v-model="formData.depth" id="inputNumber" />
        </a-form-item>
      </a-form>
    </a-card>
    <a-card title="指标选择与比例设置" style="width: 90%; margin: auto; background-color: #fbfbfb;">
      <a-form class="div1">
        <a-form-item
          v-for="(item, index) in items"
          :key="index"
          class="form-item"
        >
          <div class="switch-input-container">
            <a-switch v-model="item.isEditable" class="switch" />
            <span class="label-text">{{ item.label }}：</span>
            <a-input-number v-model="item.value" :disabled="!item.isEditable" class="input-number" />
          </div>
        </a-form-item>
      </a-form>
      <a-button type="primary" style="margin-left: 90%;" @click="selectAll">全选</a-button>
    </a-card>
    <template slot="footer">
      <a-button  key="cancel" @click="Oncancel">取消</a-button>
      <a-button  key="submit" type="primary">确定</a-button>
    </template>
  </a-modal>
</template>

<script>
export default {
  data() {
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
      ]
    }
  },
  methods: {
    handleClick() {
      this.checkedValue = !this.checkedValue;
    },
    show() {
      this.visible = true;
    },
    selectAll() {
      this.items.forEach(item => {
        item.isEditable = true;
      });
    },
    Oncancel(){
      this.visible=false
    },
    handleClear() {
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
      };
      this.items.forEach(item => {
        item.isEditable = false;
        item.value = null;
      });
    }
  }
}
</script>

<style scoped>
.div1 {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.div2 {
  display: flex;
  align-items: center;
  margin-left: 40px;
  margin-right: 20px;
}

.select1 {
  width: 150px !important;
  height: 40px !important;
  line-height: 40px !important;
  font-size: 16px !important;
}

.switch-input-container {
  display: flex;
  align-items: center;
}

.switch {
  margin-right: 10px;
}

.form-item {
  margin-left: 20px;
}

.label-text {
  margin-right: 10px;
}

.error {
  color: red;
  margin-top: 5px;
}
</style>
<template>
  <content>
    <PowerTest ref="TestRef"/>
    <div>
      <a-modal v-model="open" title="评估结果" :footer="null">
        <p>..........</p>
        <p>..........</p>
        <p>..........</p>
        <div style="margin-left: 65%;">
          <a-button>取消</a-button>
          <a-button type="primary" style="margin-left: 20px;">确认</a-button>
        </div>
      </a-modal>
      <a-form :model="form" ref="form" @submit="handleSubmit" class="div1">
        <a-form-item
          label="动力装置"
          class="div2"
          :validateStatus="errors.powerUnit ? 'error' : ''"
          :help="errors.powerUnit"
        >
          <a-select v-model="form.powerUnit" size="large" class="select1">
            <a-select-option value="0">0</a-select-option>
            <a-select-option value="1">1</a-select-option>
            <a-select-option value="2">2</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="齿轮箱"
          class="div2"
          :validateStatus="errors.gearbox ? 'error' : ''"
          :help="errors.gearbox"
        >
          <a-select v-model="form.gearbox" size="large" class="select1">
            <a-select-option value="0">0</a-select-option>
            <a-select-option value="1">1</a-select-option>
            <a-select-option value="2">2</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="轴系"
          class="div2"
          :validateStatus="errors.shafting ? 'error' : ''"
          :help="errors.shafting"
        >
          <a-select v-model="form.shafting" size="large" class="select1">
            <a-select-option value="0">0</a-select-option>
            <a-select-option value="1">1</a-select-option>
            <a-select-option value="2">2</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="螺旋桨"
          class="div2"
          :validateStatus="errors.propeller ? 'error' : ''"
          :help="errors.propeller"
        >
          <a-select v-model="form.propeller" size="large" class="select1">
            <a-select-option value="0">0</a-select-option>
            <a-select-option value="1">1</a-select-option>
            <a-select-option value="2">2</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">添加</a-button>
        </a-form-item>
        <a-form-item style="margin-left: 20px;">
          <a-button type="primary" html-type="reset" @click="resetForm">清空</a-button>
        </a-form-item>
      </a-form>
      <a-table :columns="columns" :dataSource="data" rowKey="id" >
        <template slot="checked" slot-scope="text, record">
          <a-checkbox v-model="record.checked"></a-checkbox>
        </template>
        <template slot="action" slot-scope="text, record">
          <a-button type="primary" @click="handleEdit(record.id)">编辑/添加参数</a-button>
        </template>
      </a-table>
      <a-button style="margin-left: 94%;margin-top: 20px;" type="primary" @click="handleTest">开始评估</a-button>
    </div>
  </content>
</template>

<script>
import PowerTest from './PowerTest.vue'

export default {
  name: 'power_sys_test',
  components: {
    PowerTest
  },
  data () {
    return {
      form: {
        powerUnit: '',
        gearbox: '',
        shafting: '',
        propeller: ''
      },
      open:false,
      errors: {},
      data: [],
      columns: [
        {
          title: '',
          key: 'checked',
          align: 'center',
          width: '10px',
          scopedSlots: { customRender: 'checked', width: '5%', align: 'center' }
        },
        { title: '动力装置', dataIndex: 'powerUnit', key: 'powerUnit', width: '16%', align: 'center' },
        { title: '齿轮箱', dataIndex: 'gearbox', key: 'gearbox', width: '16%', align: 'center' },
        { title: '轴系', dataIndex: 'shafting', key: 'shafting', width: '16%', align: 'center' },
        { title: '螺旋桨', dataIndex: 'propeller', key: 'propeller', width: '16%', align: 'center' },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: '100px',
          scopedSlots: { customRender: 'action', width: '16%', align: 'center' }
        },
       
      ]
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      if (this.validateForm()) {
        this.data.push({
          id: Date.now(),
          powerUnit: this.form.powerUnit,
          gearbox: this.form.gearbox,
          shafting: this.form.shafting,
          propeller: this.form.propeller,
          checked: false 
        })
        // 清空表单
        this.resetErrors()
      }
    },
    handleTest(){
      this.open=true
    },
    handleEdit () {
      this.$refs.TestRef.show()
    },
    validateForm () {
      this.errors = {}
      let valid = true

      if (!this.form.powerUnit) {
        this.errors.powerUnit = '请选择动力装置'
        valid = false
      }
      if (!this.form.gearbox) {
        this.errors.gearbox = '请选择齿轮箱'
        valid = false
      }
      if (!this.form.shafting) {
        this.errors.shafting = '请选择轴系'
        valid = false
      }
      if (!this.form.propeller) {
        this.errors.propeller = '请选择螺旋桨'
        valid = false
      }

      return valid
    },
    resetErrors () {
      this.errors = {}
    },
    resetForm () {
      this.form = {
        powerUnit: '',
        gearbox: '',
        shafting: '',
        propeller: ''
      }
      this.errors = {}
      this.data = []
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
  margin-left: 50px;
  margin-right: 20px;
}

.select1 {
  width: 220px !important;
  height: 40px !important;
  line-height: 40px !important;
  font-size: 16px !important;
}

.error {
  color: red;
  margin-top: 5px;
}
</style>

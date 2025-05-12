<template>
  <content>
    <PowerTest ref="TestRef" />
    <custom-bread-crumb show-icon style="margin-left: 30px;" :list="breadCrumbList"></custom-bread-crumb>
    <div>
      <a v-for="item in breadCrumbList" :to="item.to" :key="`bread-crumb-${item.name}`" class="mtitle">{{
      showTitle(item) }}</a>
    </div>
    <div style="height: 120%;">
      <a-modal v-model="open" title="评估结果" @ok="handleOk" :footer="null">
        <p>..........</p>
        <p>..........</p>
        <p>..........</p>
        <div style="margin-left: 65%;">
          <a-button>取消</a-button>
          <a-button type="primary" style="margin-left: 20px;">确认</a-button>
        </div>
      </a-modal>
      <a-card style="margin-top: 10px;width:100%;height: 90px;">
        <a-form ref="form" @submit="handleSubmit" class="div1">
          <a-form-item label="测试表格" class="div2" :validateStatus="errors.powerUnit ? 'error' : ''"
            :help="errors.powerUnit">
            <a-select v-model="table" size="large" class="select1" @change="handleChange">
              <a-select-option value="0">动力类别</a-select-option>
              <!-- <a-select-option value="1">螺旋桨</a-select-option>
              <a-select-option value="2">船尾轴</a-select-option>
              <a-select-option value="3">齿轮箱</a-select-option>
              <a-select-option value="4">中间轴</a-select-option>
              <a-select-option value="5">传动轴</a-select-option>
              <a-select-option value="6">水域</a-select-option>
              <a-select-option value="7">内河航段</a-select-option>
              <a-select-option value="8">港口</a-select-option>
              <a-select-option value="9">排放等级</a-select-option> -->
            </a-select>
          </a-form-item>
        </a-form>
      </a-card>
      <a-table :columns="columns" :dataSource="data" rowKey="id" :scroll="{ x: 1500 }"
        style="background-color: white;margin-top: 10px;" :pagination="{ pageSize: 8 }">
      </a-table>
    </div>
  </content>
</template>

<script>
import PowerTest from './PowerTest.vue';
import customBreadCrumb from '@/components/main/components/header-bar/custom-bread-crumb';
import { showTitle } from '@/libs/util';

const tableData = [
  {
    "id": 1,
    "powerType": "LNG内燃机动力系统",
    "model": "MAN-B&W-ME-GI-9S90ME-C10.5",
    "price": 17700000,
    "ratedPower": 58740,
    "minConsumption": 165,
    "discountRate": 0.04,
    "fuelPrice": 300,
    "failureRate": 10000,
    "length": 22,
    "width": 10,
    "height": 10,
    "weight": 1750,
    "overhaulPeriod": 10000,
    "majorOverhaulPrice": 1500000,
    "minorOverhaulPrice": 200000,
    "maturity": 0.9,
    "carbonConversionFactor": 0.03,
    "serviceLife": 25,
    "applicableWaterArea": "远洋",
    "fuelType": "LNG和柴油",
    "fuelQuantity": "双燃料",
    "applicableShipType": "集装箱船、油轮、散货船",
    "applicableShipTonnage": "大型船舶",
    "numEngines": "单主机",
    "powerSystem": "低碳/零碳内燃机"
  },
  {
    "id": 2,
    "powerType": "LNG内燃机动力系统",
    "model": "MAN-B&W-ME-GI-6S50ME-C9.5",
    "price": 8000000,
    "ratedPower": 12000,
    "minConsumption": 160,
    "discountRate": 0.04,
    "fuelPrice": 300,
    "failureRate": 10000,
    "length": 12,
    "width": 6,
    "height": 6,
    "weight": 800,
    "overhaulPeriod": 10000,
    "majorOverhaulPrice": 800000,
    "minorOverhaulPrice": 100000,
    "maturity": 0.85,
    "carbonConversionFactor": 0.03,
    "serviceLife": 25,
    "applicableWaterArea": "远洋",
    "fuelType": "LNG和柴油",
    "fuelQuantity": "双燃料",
    "applicableShipType": "集装箱船、油轮、散货船",
    "applicableShipTonnage": "中型船舶",
    "numEngines": "单主机",
    "powerSystem": "低碳/零碳内燃机"
  },
  {
    "id": 3,
    "powerType": "LNG内燃机动力系统",
    "model": "WinGD-X-DF-X72DF",
    "price": 12000000,
    "ratedPower": 36000,
    "minConsumption": 155,
    "discountRate": 0.04,
    "fuelPrice": 300,
    "failureRate": 10000,
    "length": 18,
    "width": 8,
    "height": 8,
    "weight": 1200,
    "overhaulPeriod": 10000,
    "majorOverhaulPrice": 1200000,
    "minorOverhaulPrice": 150000,
    "maturity": 0.85,
    "carbonConversionFactor": 0.03,
    "serviceLife": 25,
    "applicableWaterArea": "远洋",
    "fuelType": "LNG和柴油",
    "fuelQuantity": "双燃料",
    "applicableShipType": "集装箱船、油轮、散货船",
    "applicableShipTonnage": "大型船舶",
    "numEngines": "单主机",
    "powerSystem": "低碳/零碳内燃机"
  },
  {
    "id": 4,
    "powerType": "LNG内燃机动力系统",
    "model": "Wärtsilä-31DF",
    "price": 1250000,
    "ratedPower": 1500,
    "minConsumption": 160,
    "discountRate": 0.04,
    "fuelPrice": 300,
    "failureRate": 12000,
    "length": 5,
    "width": 3,
    "height": 3,
    "weight": 10,
    "overhaulPeriod": 12000,
    "majorOverhaulPrice": 100000,
    "minorOverhaulPrice": 20000,
    "maturity": 0.95,
    "carbonConversionFactor": 0.03,
    "serviceLife": 25,
    "applicableWaterArea": "内河",
    "fuelType": "LNG和柴油",
    "fuelQuantity": "双燃料",
    "applicableShipType": "渡轮、拖船、客船、液散货船、集装箱船、滚装船、渔船、散货船",
    "applicableShipTonnage": "小型船舶",
    "numEngines": "单主机",
    "powerSystem": "低碳/零碳内燃机"
  },
  {
    "id": 5,
    "powerType": "LNG内燃机动力系统",
    "model": "Caterpillar-3516C-L-Gas",
    "price": 1500000,
    "ratedPower": 1500,
    "minConsumption": 165,
    "discountRate": 0.04,
    "fuelPrice": 300,
    "failureRate": 10000,
    "length": 6,
    "width": 3,
    "height": 3,
    "weight": 15,
    "overhaulPeriod": 10000,
    "majorOverhaulPrice": 120000,
    "minorOverhaulPrice": 25000,
    "maturity": 0.9,
    "carbonConversionFactor": 0.03,
    "serviceLife": 25,
    "applicableWaterArea": "内河",
    "fuelType": "LNG和柴油",
    "fuelQuantity": "双燃料",
    "applicableShipType": "渡轮、拖船、客船、液散货船、集装箱船、滚装船、渔船、散货船",
    "applicableShipTonnage": "小型船舶",
    "numEngines": "单主机",
    "powerSystem": "低碳/零碳内燃机"
  },
  {
    "id": 6,
    "powerType": "LNG内燃机动力系统",
    "model": "Caterpillar-3516C-L-Gas",
    "price": 1500000,
    "ratedPower": 1500,
    "minConsumption": 165,
    "discountRate": 0.04,
    "fuelPrice": 300,
    "failureRate": 10000,
    "length": 6,
    "width": 3,
    "height": 3,
    "weight": 15,
    "overhaulPeriod": 10000,
    "majorOverhaulPrice": 120000,
    "minorOverhaulPrice": 25000,
    "maturity": 0.9,
    "carbonConversionFactor": 0.03,
    "serviceLife": 25,
    "applicableWaterArea": "沿海",
    "fuelType": "LNG和柴油",
    "fuelQuantity": "双燃料",
    "applicableShipType": "渡轮、拖船、客船、液散货船、集装箱船、滚装船、渔船、散货船",
    "applicableShipTonnage": "小型船舶",
    "numEngines": "单主机",
    "powerSystem": "低碳/零碳内燃机"
  },
  {
    "id": 7,
    "powerType": "LNG内燃机动力系统",
    "model": "Rolls-Royce-Bergen-B35:40G",
    "price": 1750000,
    "ratedPower": 1500,
    "minConsumption": 160,
    "discountRate": 0.04,
    "fuelPrice": 300,
    "failureRate": 10000,
    "length": 6,
    "width": 3,
    "height": 3,
    "weight": 15,
    "overhaulPeriod": 10000,
    "majorOverhaulPrice": 150000,
    "minorOverhaulPrice": 30000,
    "maturity": 0.85,
    "carbonConversionFactor": 0.03,
    "serviceLife": 25,
    "applicableWaterArea": "内河",
    "fuelType": "LNG和柴油",
    "fuelQuantity": "双燃料",
    "applicableShipType": "渡轮、拖船、客船、液散货船、集装箱船、滚装船、渔船、散货船",
    "applicableShipTonnage": "小型船舶",
    "numEngines": "单主机",
    "powerSystem": "低碳/零碳内燃机"
  },
  {
    "id": 8,
    "powerType": "LNG内燃机动力系统",
    "model": "Wärtsilä-20DF",
    "price": 500000,
    "ratedPower": 700,
    "minConsumption": 160,
    "discountRate": 0.04,
    "fuelPrice": 300,
    "failureRate": 12000,
    "length": 4,
    "width": 2,
    "height": 2,
    "weight": 5,
    "overhaulPeriod": 12000,
    "majorOverhaulPrice": 50000,
    "minorOverhaulPrice": 10000,
    "maturity": 0.95,
    "carbonConversionFactor": 0.03,
    "serviceLife": 25,
    "applicableWaterArea": "内河",
    "fuelType": "LNG和柴油",
    "fuelQuantity": "双燃料",
    "applicableShipType": "渡轮、拖船、客船、液散货船、集装箱船、滚装船、渔船、散货船",
    "applicableShipTonnage": "小型船舶",
    "numEngines": "单主机",
    "powerSystem": "低碳/零碳内燃机"
  },
]
export default {
  name: 'power_sys_test',
  components: {
    PowerTest,
    customBreadCrumb
  },
  computed: {
    breadCrumbList() {
      return this.$store.state.app.breadCrumbList
    }
  },
  data() {
    return {
      table: '0',
      open: false,
      errors: {},
      data: tableData,
      data0: tableData,
      // data1: [
      //   {
      //     "id": 1,
      //     "model": "PX-001",
      //     "price": 80000,
      //     "propulsionType": "固定螺距螺旋桨",
      //     "material": "铝合金",
      //     "diameter": 2000,
      //     "bladeCount": 4,
      //     "bladeAngle": 25,
      //     "thrust": 100,
      //     "efficiency": 0.85,
      //     "weight": 500,
      //     "antiCorrosion": "是",
      //     "maintenancePeriod": 4000,
      //     "vibrationLevel": "中",
      //     "temperatureRange": "-10°C~50°C",
      //     "applicableWaterArea": "内河"
      //   },
      //   {
      //     "id": 2,
      //     "model": "PX-002",
      //     "price": 300000,
      //     "propulsionType": "可调螺距螺旋桨",
      //     "material": "不锈钢",
      //     "diameter": 3500,
      //     "bladeCount": 5,
      //     "bladeAngle": 30,
      //     "thrust": 300,
      //     "efficiency": 0.9,
      //     "weight": 1500,
      //     "antiCorrosion": "是",
      //     "maintenancePeriod": 6000,
      //     "vibrationLevel": "低",
      //     "temperatureRange": "-20°C~60°C",
      //     "applicableWaterArea": "沿海"
      //   },
      //   {
      //     "id": 3,
      //     "model": "PX-003",
      //     "price": 1000000,
      //     "propulsionType": "方位推进器",
      //     "material": "碳纤维",
      //     "diameter": 5000,
      //     "bladeCount": 4,
      //     "bladeAngle": 35,
      //     "thrust": 500,
      //     "efficiency": 0.92,
      //     "weight": 2000,
      //     "antiCorrosion": "否",
      //     "maintenancePeriod": 8000,
      //     "vibrationLevel": "高",
      //     "temperatureRange": "-30°C~70°C",
      //     "applicableWaterArea": "远洋"
      //   },
      //   {
      //     "id": 4,
      //     "model": "PX-004",
      //     "price": 250000,
      //     "propulsionType": "导管螺旋桨",
      //     "material": "铸铁",
      //     "diameter": 3000,
      //     "bladeCount": 3,
      //     "bladeAngle": 20,
      //     "thrust": 200,
      //     "efficiency": 0.88,
      //     "weight": 1200,
      //     "antiCorrosion": "是",
      //     "maintenancePeriod": 5000,
      //     "vibrationLevel": "中",
      //     "temperatureRange": "-15°C~55°C",
      //     "applicableWaterArea": "内河"
      //   }
      // ],
      // data2: [
      //   {
      //     "id": 1,
      //     "model": "PS-001",
      //     "price": 13200,
      //     "length": 2550,
      //     "diameter": 102.34,
      //     "material": "合金钢",
      //     "maxTorque": 2550,
      //     "fatigueLife": 12000,
      //     "weight": 360,
      //     "antiCorrosion": "是",
      //     "maintenancePeriod": 2000,
      //     "vibrationLevel": "中",
      //     "temperatureRange": "-10°C~50°C",
      //     "applicableWaterArea": "内河"
      //   },
      //   {
      //     "id": 2,
      //     "model": "PS-002",
      //     "price": 14500,
      //     "length": 1800,
      //     "diameter": 76.89,
      //     "material": "不锈钢",
      //     "maxTorque": 4000,
      //     "fatigueLife": 18000,
      //     "weight": 420,
      //     "antiCorrosion": "否",
      //     "maintenancePeriod": 3500,
      //     "vibrationLevel": "低",
      //     "temperatureRange": "-30°C~60°C",
      //     "applicableWaterArea": "沿海"
      //   },
      //   {
      //     "id": 3,
      //     "model": "PS-003",
      //     "price": 11100,
      //     "length": 1500,
      //     "diameter": 110.23,
      //     "material": "碳钢",
      //     "maxTorque": 3200,
      //     "fatigueLife": 14000,
      //     "weight": 300,
      //     "antiCorrosion": "是",
      //     "maintenancePeriod": 1500,
      //     "vibrationLevel": "高",
      //     "temperatureRange": "-20°C~40°C",
      //     "applicableWaterArea": "远洋"
      //   },
      //   {
      //     "id": 4,
      //     "model": "PS-004",
      //     "price": 18900,
      //     "length": 2900,
      //     "diameter": 89.56,
      //     "material": "不锈钢",
      //     "maxTorque": 4500,
      //     "fatigueLife": 5000,
      //     "weight": 200,
      //     "antiCorrosion": "否",
      //     "maintenancePeriod": 3000,
      //     "vibrationLevel": "中",
      //     "temperatureRange": "-10°C~50°C",
      //     "applicableWaterArea": "内河"
      //   },
      //   {
      //     "id": 5,
      //     "model": "PS-005",
      //     "price": 10500,
      //     "length": 1450,
      //     "diameter": 120.75,
      //     "material": "合金钢",
      //     "maxTorque": 1450,
      //     "fatigueLife": 16000,
      //     "weight": 340,
      //     "antiCorrosion": "是",
      //     "maintenancePeriod": 4000,
      //     "vibrationLevel": "中",
      //     "temperatureRange": "-20°C~40°C",
      //     "applicableWaterArea": "沿海"
      //   }
      // ],
      // data3: [
      //   {
      //     "id": 1,
      //     "model": "GBX-001",
      //     "price": 8045,
      //     "gearRatio": "2.5:1",
      //     "torqueCapacity": 5000,
      //     "material": "合金钢",
      //     "noiseLevel": "低",
      //     "durability": 20000,
      //     "weight": 150,
      //     "maintenancePeriod": 3000,
      //     "vibrationLevel": "中",
      //     "temperatureRange": "-10°C~50°C",
      //     "applicableWaterArea": "内河"
      //   },
      //   {
      //     "id": 2,
      //     "model": "GBX-002",
      //     "price": 7250,
      //     "gearRatio": "3.0:1",
      //     "torqueCapacity": 6000,
      //     "material": "碳钢",
      //     "noiseLevel": "中",
      //     "durability": 15000,
      //     "weight": 130,
      //     "maintenancePeriod": 2500,
      //     "vibrationLevel": "高",
      //     "temperatureRange": "-20°C~60°C",
      //     "applicableWaterArea": "沿海"
      //   },
      //   {
      //     "id": 3,
      //     "model": "GBX-003",
      //     "price": 9700,
      //     "gearRatio": "1.8:1",
      //     "torqueCapacity": 7000,
      //     "material": "不锈钢",
      //     "noiseLevel": "低",
      //     "durability": 25000,
      //     "weight": 180,
      //     "maintenancePeriod": 3500,
      //     "vibrationLevel": "低",
      //     "temperatureRange": "-15°C~55°C",
      //     "applicableWaterArea": "远洋"
      //   }
      // ],
      columns: [
        { title: 'id', dataIndex: 'id', key: '0', width: '100px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '动力类别', dataIndex: 'powerType', key: '1', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '型号', dataIndex: 'model', key: '2', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '价格', dataIndex: 'price', key: '3', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '额定功率', dataIndex: 'ratedPower', key: '4', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '最低消耗', dataIndex: 'minConsumption', key: '5', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '折率', dataIndex: 'discountRate', key: '6', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '燃料价格', dataIndex: 'fuelPrice', key: '7', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '故障率', dataIndex: 'failureRate', key: '8', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '长', dataIndex: 'length', key: '9', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '宽', dataIndex: 'width', key: '10', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '高', dataIndex: 'height', key: '11', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '重量', dataIndex: 'weight', key: '12', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '拆检周期', dataIndex: 'overhaulPeriod', key: '13', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '大修价格', dataIndex: 'majorOverhaulPrice', key: '14', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '小修价格', dataIndex: 'minorOverhaulPrice', key: '15', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '成熟期', dataIndex: 'maturity', key: '16', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '碳转化系数', dataIndex: 'carbonConversionFactor', key: '17', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '使用寿命', dataIndex: 'serviceLife', key: '18', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '适用水域', dataIndex: 'applicableWaterArea', key: '19', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '燃料类型', dataIndex: 'fuelType', key: '20', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '燃料数量', dataIndex: 'fuelQuantity', key: '21', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '适用船型', dataIndex: 'applicableShipType', key: '22', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '适用船只吨位', dataIndex: 'applicableShipTonnage', key: '23', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '主机数量', dataIndex: 'numEngines', key: '24', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '动力系统', dataIndex: 'powerSystem', key: '25', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
      ]
    }
  },
  methods: {
    showTitle(item) {
      return showTitle(item, this)
    },

    handleSubmit(e) {
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
    handleOk() {
    },
    handleTest() {
      this.open = true
    },
    handleEdit() {
      this.$refs.TestRef.show()
    },
    validateForm() {
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
    resetErrors() {
      this.errors = {}
    },
    resetForm() {
      this.form = {
        powerUnit: '',
        gearbox: '',
        shafting: '',
        propeller: ''
      }
      this.errors = {}
      this.data = []
    },
    handleChange() {
      switch (this.table) {
        case '0':
          this.data = this.data0;
          this.columns = [
            { title: 'id', dataIndex: 'id', key: '0', width: '100px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
            { title: '动力类别', dataIndex: 'powerType', key: '1', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
            { title: '型号', dataIndex: 'model', key: '2', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
            { title: '价格', dataIndex: 'price', key: '3', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
            { title: '额定功率', dataIndex: 'ratedPower', key: '4', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
            { title: '最低消耗', dataIndex: 'minConsumption', key: '5', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
            { title: '折率', dataIndex: 'discountRate', key: '6', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
            { title: '燃料价格', dataIndex: 'fuelPrice', key: '7', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
            { title: '故障率', dataIndex: 'failureRate', key: '8', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
            { title: '长', dataIndex: 'length', key: '9', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
            { title: '宽', dataIndex: 'width', key: '10', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
            { title: '高', dataIndex: 'height', key: '11', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
            { title: '重量', dataIndex: 'weight', key: '12', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
            { title: '拆检周期', dataIndex: 'overhaulPeriod', key: '13', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
            { title: '大修价格', dataIndex: 'majorOverhaulPrice', key: '14', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
            { title: '小修价格', dataIndex: 'minorOverhaulPrice', key: '15', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
            { title: '成熟期', dataIndex: 'maturity', key: '16', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
            { title: '碳转化系数', dataIndex: 'carbonConversionFactor', key: '17', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
            { title: '使用寿命', dataIndex: 'serviceLife', key: '18', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
            { title: '适用水域', dataIndex: 'applicableWaterArea', key: '19', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
            { title: '燃料类型', dataIndex: 'fuelType', key: '20', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
            { title: '燃料数量', dataIndex: 'fuelQuantity', key: '21', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
            { title: '适用船型', dataIndex: 'applicableShipType', key: '22', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
            { title: '适用船只吨位', dataIndex: 'applicableShipTonnage', key: '23', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
            { title: '主机数量', dataIndex: 'numEngines', key: '24', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
            { title: '动力系统', dataIndex: 'powerSystem', key: '25', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
          ]
          break;
        // case '1':
        //   this.data = this.data1
        //   this.columns = [
        //     { title: 'id', dataIndex: 'id', key: '0', width: '100px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '型号', dataIndex: 'model', key: '1', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '价格', dataIndex: 'price', key: '2', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '推进类型', dataIndex: 'propulsionType', key: '3', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '材质', dataIndex: 'material', key: '4', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '直径', dataIndex: 'diameter', key: '5', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '叶片数', dataIndex: 'bladeCount', key: '6', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '叶片角度', dataIndex: 'bladeAngle', key: '7', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '推力', dataIndex: 'thrust', key: '8', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '效率', dataIndex: 'efficiency', key: '9', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '重量', dataIndex: 'weight', key: '10', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '防腐处理', dataIndex: 'antiCorrosion', key: '11', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '维护周期', dataIndex: 'maintenancePeriod', key: '12', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '振动等级', dataIndex: 'vibrationLevel', key: '13', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '工作温度范围', dataIndex: 'temperatureRange', key: '14', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '适用水域', dataIndex: 'applicableWaterArea', key: '15', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //   ]
        //   break;
        // case '2':
        //   this.data = this.data2
        //   this.columns = [
        //     { title: 'ID', dataIndex: 'id', key: '0', width: '100px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '型号', dataIndex: 'tailShaftModel', key: '1', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '价格', dataIndex: 'price', key: '2', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '长度', dataIndex: 'length', key: '3', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '直径', dataIndex: 'diameter', key: '4', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '材质', dataIndex: 'material', key: '5', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '最大扭矩', dataIndex: 'maxTorque', key: '6', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '疲劳寿命', dataIndex: 'fatigueStrength', key: '7', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) }, // 注意：原始数据中的字段名为 'fatigueStrength'
        //     { title: '重量', dataIndex: 'weight', key: '8', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '防腐处理', dataIndex: 'surfaceTreatment', key: '9', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) }, // 注意：原始数据中的字段名为 'surfaceTreatment'
        //     { title: '维护周期', dataIndex: 'maintenanceInterval', key: '10', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) }, // 注意：原始数据中的字段名为 'maintenanceInterval'
        //     { title: '工作温度范围', dataIndex: 'temperatureRange', key: '12', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '适用水域', dataIndex: 'applicableWaterArea', key: '13', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //   ]
        //   break;
        // case '3':
        //   this.data = this.data3
        //   this.columns = [
        //     { title: 'id', dataIndex: 'id', key: '0', width: '100px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '型号', dataIndex: 'model', key: '1', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '价格', dataIndex: 'price', key: '2', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '传动比', dataIndex: 'gearRatio', key: '3', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '扭矩容量', dataIndex: 'torqueCapacity', key: '4', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '材质', dataIndex: 'material', key: '5', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '噪声等级', dataIndex: 'noiseLevel', key: '6', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '耐久性', dataIndex: 'durability', key: '7', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '重量', dataIndex: 'weight', key: '8', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '维护周期', dataIndex: 'maintenancePeriod', key: '9', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '振动等级', dataIndex: 'vibrationLevel', key: '10', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '工作温度范围', dataIndex: 'temperatureRange', key: '11', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '适用水域', dataIndex: 'applicableWaterArea', key: '12', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //   ]
        //   break;
        // case '4':
        //   this.data = this.data3
        //   this.columns = [
        //     { title: 'ID', dataIndex: 'id', key: '0', width: '100px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '型号', dataIndex: 'model', key: '1', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '价格', dataIndex: 'price', key: '2', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '传动比', dataIndex: 'transmissionRatio', key: '3', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '扭矩容量', dataIndex: 'maxTorque', key: '4', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '材质', dataIndex: 'material', key: '5', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '噪声等级', dataIndex: 'noiseLevel', key: '6', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '耐久性', dataIndex: 'durability', key: '7', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '重量', dataIndex: 'weight', key: '8', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '维护周期', dataIndex: 'maintenancePeriod', key: '9', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '振动等级', dataIndex: 'vibrationLevel', key: '10', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '工作温度范围', dataIndex: 'temperatureRange', key: '11', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '适用水域', dataIndex: 'applicableWaterArea', key: '12', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '直径', dataIndex: 'diameter', key: '13', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '长度', dataIndex: 'length', key: '14', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '最大转速', dataIndex: 'speed', key: '15', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '轴颈直径', dataIndex: 'journalDiameter', key: '16', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '法兰规格', dataIndex: 'flangeSpecification', key: '17', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '键槽及键', dataIndex: 'keySlotAndKey', key: '18', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '表面粗糙度', dataIndex: 'surfaceRoughness', key: '19', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '径向跳动', dataIndex: 'runout', key: '20', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '圆柱度', dataIndex: 'cylindricity', key: '21', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '圆度', dataIndex: 'roundness', key: '22', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '适用动力系统', dataIndex: 'applicablePowerSystem', key: '23', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '输入功率', dataIndex: 'inputPower', key: '24', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '输出功率', dataIndex: 'outputPower', key: '25', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '润滑方式', dataIndex: 'lubricationMethod', key: '26', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '连接方式', dataIndex: 'connectionMethod', key: '27', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '防护措施', dataIndex: 'protectiveMeasures', key: '28', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '认证和标准', dataIndex: 'certificationAndStandards', key: '29', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //   ]
        //   break;

        // case '5':
        //   this.data = this.data3
        //   this.columns = [
        //     { title: 'ID', dataIndex: 'id', key: '0', width: '100px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '型号', dataIndex: 'model', key: '1', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '价格', dataIndex: 'price', key: '2', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '长度', dataIndex: 'length', key: '3', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '直径', dataIndex: 'diameter', key: '4', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '材质', dataIndex: 'material', key: '5', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '最大扭矩', dataIndex: 'maxTorque', key: '6', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '疲劳寿命', dataIndex: 'fatigueLife', key: '7', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '重量', dataIndex: 'weight', key: '8', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '防腐措施', dataIndex: 'antiCorrosion', key: '9', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '维护周期', dataIndex: 'maintenancePeriod', key: '10', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '振动等级', dataIndex: 'vibrationLevel', key: '11', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '工作温度范围', dataIndex: 'temperatureRange', key: '12', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '适用水域', dataIndex: 'applicableWaterArea', key: '13', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '维护费用', dataIndex: 'maintenancePrice', key: '14', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '适用船型', dataIndex: 'applicableShipType', key: '15', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '主发动机功率', dataIndex: 'mainEnginePower', key: '16', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '最大转速', dataIndex: 'speed', key: '17', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '制造商', dataIndex: 'manufacturer', key: '18', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //   ]
        //   break;

        // case '6':
        //   this.data = this.data3
        //   this.columns = [
        //     { title: 'ID', dataIndex: 'id', key: '0', width: '100px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '水域名称', dataIndex: 'waterAreaName', key: '1', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '航道等级', dataIndex: 'levelOfNavigationArea', key: '2', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '最小转弯半径', dataIndex: 'minimumBendingRadiusOfNavigationArea', key: '3', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '平均水深', dataIndex: 'averageWaterDepth', key: '4', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '最大水深', dataIndex: 'maximumWaterDepth', key: '5', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '最小水深', dataIndex: 'minimumWaterDepth', key: '6', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '岛屿数量', dataIndex: 'numberOfIslands', key: '7', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '水域长度', dataIndex: 'waterLength', key: '8', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '平均宽度', dataIndex: 'averageWidth', key: '9', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '最大宽度', dataIndex: 'maximumWidth', key: '10', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //   ]
        //   break;

        // case '7':
        //   this.data = this.data3
        //   this.columns = [
        //     { title: 'ID', dataIndex: 'id', key: '0', width: '100px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '段名', dataIndex: 'segmentName', key: '1', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '沿线港口', dataIndex: 'segmentPorts', key: '2', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '段长（公里）', dataIndex: 'segmentLength', key: '3', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '复杂程度', dataIndex: 'segmentComplexity', key: '4', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '沿海排放等级', dataIndex: 'coastalEmissionLevel', key: '5', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '平均水深（米）', dataIndex: 'averageDepth', key: '6', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '最大水深（米）', dataIndex: 'maxDepth', key: '7', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '最小水深（米）', dataIndex: 'minDepth', key: '8', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '平均宽度（米）', dataIndex: 'averageWidth', key: '9', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '最大宽度（米）', dataIndex: 'maxWidth', key: '10', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '最小宽度（米）', dataIndex: 'minWidth', key: '11', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '适用船舶吨位', dataIndex: 'applicableShipTonnage', key: '12', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '所属水系', dataIndex: 'belongingWaterSystem', key: '13', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //   ]
        //   break;

        // case '8':
        //   this.data = this.data3
        //   this.columns = [
        //     { title: 'ID', dataIndex: 'id', key: '0', width: '100px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '港口名称', dataIndex: 'harbourName', key: '1', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '港口代码', dataIndex: 'harbourCode', key: '2', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '国家', dataIndex: 'country', key: '3', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '经度', dataIndex: 'longitude', key: '4', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '纬度', dataIndex: 'latitude', key: '5', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '磁偏角', dataIndex: 'magneticVariation', key: '6', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '进出点', dataIndex: 'entryAndExitPoint', key: '7', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '是否公开', dataIndex: 'publiclyAnnounced', key: '8', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }), render: (text) => text ? '是' : '否' },
        //   ]
        //   break;

        // case '9':
        //   this.data = this.data3
        //   this.columns = [
        //     { title: 'ID', dataIndex: 'id', key: '0', width: '100px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '级别ID', dataIndex: 'level_id', key: '1', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '级别名称', dataIndex: 'level', key: '2', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '请求内容', dataIndex: 'request', key: '3', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //     { title: '实施日期', dataIndex: 'implementationData', key: '4', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }), render: (text) => new Date(text).toLocaleDateString() },
        //     { title: '适用水域ID', dataIndex: 'applicableWaterArea_id', key: '5', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        //   ]
        //   break;

      }
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

.mtitle {
  margin-left: 30px;
}
</style>

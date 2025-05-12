<template>
  <div>
    <Chart :scheme="scheme" :whichButton="whichButton" ref="chart"></Chart>
    <Chart2 :scheme="scheme" ref="chart2"></Chart2>
    <a-modal v-model="open" title="可信度" :footer="[]">
      <div style="margin-left: 20px;">
        <p>评估可信度：{{ reliability }}</p>
      </div>
    </a-modal>
    <custom-bread-crumb show-icon style="margin-left: 30px;" :list="breadCrumbList"></custom-bread-crumb>
    <div>
      <a v-for="item in breadCrumbList" :to="item.to" :key="`bread-crumb-${item.name}`" class="mtitle">{{
      showTitle(item) }}</a>
    </div>
    <div style="display: flex; flex-direction: column; align-items: center;">
      <a-card style="width: 100%; margin-bottom: 20px;">
        <a-form ref="form" @submit.prevent="handleSubmit">
          <div class="form-row">
            <a-form-item :validateStatus="errors.waters ? 'error' : ''" :help="errors.waters" class="form-item">
              <span class="label-text">水域：</span>
              <a-select v-model="formData.waters" @change="handleWaterChange" size="large" class="select">
                <a-select-option v-for="water in waters" :key="water.value" :value="water.value">{{ water.label
                  }}</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item :validateStatus="errors.waterSystem ? 'error' : ''" :help="errors.waterSystem"
              class="form-item">
              <span class="label-text">水系：</span>
              <a-select v-model="formData.waterSystem" @change="handleWaterSystemChange" size="large" class="select">
                <a-select-option v-for="system in waterSystemSegments" :key="system.waterSystem" :value="system.id">{{
      system.waterSystem }}</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item :validateStatus="errors.segment ? 'error' : ''" :help="errors.segment" class="form-item">
              <span class="label-text">航段：</span>
              <a-select v-model="formData.segment" @change="handleSegmentChange" size="large" class="select">
                <a-select-option v-for="segment in getSegmentsByWaterSystem()" :key="segment" :value="segment">{{
      segment }}</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <div class="form-row">
            <a-form-item class="form-item" :validateStatus="errors.shipType ? 'error' : ''" :help="errors.shipType">
              <span class="label-text">船型：</span>
              <a-select v-model="formData.shipType" size="large" class="select">
                <a-select-option value="0">集装箱船</a-select-option>
                <a-select-option value="1">散货船</a-select-option>
                <a-select-option value="2">液货船</a-select-option>
                <a-select-option value="3">客船</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item class="form-item" :validateStatus="errors.speed ? 'error' : ''" :help="errors.speed">
              <span class="label-text">载货量：</span>
              <a-input-number v-model="formData.speed" class="input" />
            </a-form-item>
            <a-form-item class="form-item" :validateStatus="errors.tonnage ? 'error' : ''" :help="errors.tonnage">
              <span class="label-text">吨位：</span>
              <a-input-number v-model="formData.tonnage" class="input" />
            </a-form-item>
            <a-form-item class="form-item" :validateStatus="errors.minSpeedRequirement ? 'error' : ''"
              :help="errors.minSpeedRequirement">
              <span class="label-text">最低航速：</span>
              <a-select v-model="formData.minSpeedRequirement" size="large" class="select2">
                <a-select-option value="0">低速</a-select-option>
                <a-select-option value="1">中速</a-select-option>
                <a-select-option value="2">高速</a-select-option>
              </a-select>
            </a-form-item>
          </div>
        </a-form>
      </a-card>

      <a-card title="指标选择与比例设置" style="width: 100%; margin-bottom: 20px;">
        <div class="form-row">
          <a-form-item v-for="(item, index) in items" :key="index" class="form-item2">
            <div class="switch-input-container">
              <a-switch v-model="item.isEditable" class="switch" />
              <span class="label-text">{{ item.label }}：</span>
              <a-input-number v-model="item.value" :disabled="!item.isEditable" class="input-number" />
            </div>
          </a-form-item>
        </div>
        <a-button type="primary" style="align-self: flex-end; margin-top: 10px; margin-left: 90%;"
          @click="selectAll">全选</a-button>
      </a-card>
      <div style="display: flex;margin-left: 1000px;">
        <a-button type="primary" v-show="false" style="margin-right: 10px;"
          :disabled="buttonEnable1 || buttonEnable2 ? false : true" @click="showChart">生成方案</a-button>
        <a-button type="primary" style="margin-right: 10px;" @click="handleUseful">适用性评估</a-button>
        <a-button type="primary" style="margin-right: 10px;" @click="handleEvaluation">优化评估</a-button>
        <a-button type="primary" style="margin-right: 10px;" :disabled="buttonEnable1 && buttonEnable2 ? false : true"
          @click="handleReliability">可信度计算</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from './chart.vue'
import Chart2 from './chart2.vue'
import axios from 'axios';
import customBreadCrumb from '@/components/main/components/header-bar/custom-bread-crumb';
import { showTitle } from '@/libs/util';
export default {
  components: {
    Chart,
    Chart2,
    customBreadCrumb
  },
  computed: {
    breadCrumbList() {
      return this.$store.state.app.breadCrumbList
    }
  },
  data() {
    return {
      scheme: [],
      data: [],
      buttonEnable2: false,
      buttonEnable1: false,
      whichButton: 0,
      reliability: 0,
      open: false,
      visible: false,
      shipType: '',
      waterType: '',
      minSpeedRequirement: '',
      updateTime: '',
      errors: {
        waters: '',
        speed: null,//载货量
        tonnage: null,
        shipType: '',
        minSpeedRequirement: '',
        waterSystem: '',
        segment: '',
      },
      formData: {
        waters: '0',
        speed: 12000,
        tonnage: 18000,
        budget: null,
        minSpeedRequirement: '0',
        shipType: '1',
        blockCoefficient: null,
        hullEfficiency: null,
        depth: null,
        waterSystem: 2,
        segment: '长江下游',
      },
      waterSystemSegments: {},
      waters: [
        { value: '0', label: '内河' },
        { value: '1', label: '沿海' },
        { value: '2', label: '远洋' }
      ],
      waterSystems: '长江水系',
      segments: '长江下游',
      items: [
        { label: '经济性', isEditable: true, value: 0.5 },
        { label: '安全性', isEditable: true, value: 0.1 },
        { label: '排放性', isEditable: true, value: 0.2 },
        { label: '燃料可供性', isEditable: true, value: 0.1 },
        { label: '技术成熟度', isEditable: true, value: 0.1 },
      ]
    }
  },
  mounted() {
    this.onMounted();
  },
  methods: {
    async queryData(url) {
      return axios.get(url);
    },
    showTitle(item) {
      return showTitle(item, this)
    },
    getSegmentsByWaterSystem() {
      console.log('ceshi', this.formData.waters);
      // 默认返回第一个水系的 segments（如果 formData.water === '1'）
      if (this.formData.waters === '1') {
        return this.waterSystemSegments[0].segments;
      }
      else {
        // 根据 formData.waterSystem 的 id 查找对应的 segments
        return this.waterSystemSegments[this.formData.waterSystem ? this.formData.waterSystem : 0].segments;
      }
    },
    handleSet() {
      const url = `/bcd/evaluation/parameter`
      switch (this.formData.shipType) {
        case '0':
          this.shipType = '集装箱船'
          break;
        case '1':
          this.shipType = '散货船'
          break;
        case '2':
          this.shipType = '液货船'
          break;
        case '3':
          this.shipType = '客船'
          break;
        default:
          break;
      }
      switch (this.formData.waters) {
        case '0':
          this.waterType = '内河'
          break;
        case '1':
          this.waterType = '沿海'
          break;
        case '2':
          this.waterType = '远洋'
          break;
        default:
          break;
      }
      switch (this.formData.minSpeedRequirement) {
        case '0':
          this.minSpeedRequirement = '低速'
          break;
        case '1':
          this.minSpeedRequirement = '中速'
          break;
        case '2':
          this.minSpeedRequirement = '高速'
          break;
        default:
          break;
      }
      this.$axios({
        url: url,
        method: "post",
        data: {
          waterArea: this.waterType,
          shipType: this.shipType,
          shipTonnage: this.formData.tonnage,
          deadWeightTonnage: this.formData.speed,
          waterSystem: this.waterSystems,
          ecaRegion: "国内",
          minSpeedRequirement: this.minSpeedRequirement,
          segment: this.segments,
        }
      }).then(() => {
      })
    },
    onMounted() {
      const url = `/bcd/api/inland-river-segments/all`;
      this.queryData(url).then(res => {
        this.data = res.data;
        console.log('ssssss', this.data);

        const waterSystemSegmentsMap = {};
        const uniqueWaterSystems = new Set(); // 用于存储唯一的水系名称

        // 收集所有独特的水系名称，并填充waterSystemSegmentsMap
        this.data.forEach(item => {
          const { belongingWaterSystem, segmentName } = item;

          if (!waterSystemSegmentsMap[belongingWaterSystem]) {
            waterSystemSegmentsMap[belongingWaterSystem] = [];
          }

          waterSystemSegmentsMap[belongingWaterSystem].push(segmentName);
          uniqueWaterSystems.add(belongingWaterSystem); // 添加水系名称到Set中
        });

        // 创建一个水系名称到索引的映射
        const waterSystemIndexMap = {};
        [...uniqueWaterSystems].forEach((system, index) => {
          waterSystemIndexMap[system] = index;
        });

        // 将映射转换为所需的输出格式，并添加id属性
        if (this.formData.waters === '0') {
          this.waterSystemSegments = Object.keys(waterSystemSegmentsMap)
            .filter(waterSystem => waterSystem !== '环渤海水系') // 过滤掉'环渤海水系'
            .map(waterSystem => ({
              id: waterSystemIndexMap[waterSystem], // 添加id属性
              waterSystem,
              segments: waterSystemSegmentsMap[waterSystem]
            }));
        }
        if (this.formData.waters === '1') {
          this.waterSystemSegments = Object.keys(waterSystemSegmentsMap)
            .filter(waterSystem => waterSystem === '环渤海水系') // 过滤掉'环渤海水系'
            .map(waterSystem => ({
              id: waterSystemIndexMap[waterSystem], // 添加id属性
              waterSystem,
              segments: waterSystemSegmentsMap[waterSystem]
            }));
        }
        console.log('water', this.waterSystemSegments);
      });
    },
    handleWaterChange() {
      this.onMounted();
      if (this.formData.waters === '2') {
        this.items = [
          { label: '经济性', isEditable: true, value: 0.2 },
          { label: '安全性', isEditable: true, value: 0.1 },
          { label: '排放性', isEditable: true, value: 0.5 },
          { label: '燃料可供性', isEditable: true, value: 0.1 },
          { label: '技术成熟度', isEditable: true, value: 0.1 },
        ]
      } else if (this.formData.waters === '1') {
        this.items = [
          { label: '经济性', isEditable: true, value: 0.2 },
          { label: '安全性', isEditable: true, value: 0.2 },
          { label: '排放性', isEditable: true, value: 0.2 },
          { label: '燃料可供性', isEditable: true, value: 0.2 },
          { label: '技术成熟度', isEditable: true, value: 0.2 },
        ]
      } else if (this.formData.waters === '0') {
        this.items = [
          { label: '经济性', isEditable: true, value: 0.5 },
          { label: '安全性', isEditable: true, value: 0.1 },
          { label: '排放性', isEditable: true, value: 0.2 },
          { label: '燃料可供性', isEditable: true, value: 0.1 },
          { label: '技术成熟度', isEditable: true, value: 0.1 },
        ]
      }
      this.formData.waterSystem = ''; // 清空水系选择
      this.formData.segment = ''; // 清空航段选择
    },
    handleWaterSystemChange() {
      console.log('asdsadadasdsad', this.waterSystemSegments);
      this.formData.segment = ''; // 清空航段选择
      this.waterSystems = this.waterSystemSegments[0].waterSystem;
    },
    handleSegmentChange() {
      this.segments = this.formData.segment;
    },
    getCurrentTimeString() {
      // 获取当前时间并格式化为字符串
      const now = new Date();
      const year = now.getFullYear();
      const month = ('0' + (now.getMonth() + 1)).slice(-2); // 月份从0开始，所以加1
      const day = ('0' + now.getDate()).slice(-2);
      const hours = ('0' + now.getHours()).slice(-2);
      const minutes = ('0' + now.getMinutes()).slice(-2);
      const seconds = ('0' + now.getSeconds()).slice(-2);

      // 格式化为 YYYY-MM-DD HH:mm:ss
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    handleSubmit() {
      if (this.validateForm()) {
        console.log('全部添加');
      } else {
        console.log(this.errors);
      }
    },
    validateForm() {
      this.errors = {}
      let valid = true

      if (!this.formData.shipType) {
        this.errors.shipType = '请选择船型'
        valid = false
      }
      if (!this.formData.waters) {
        this.errors.waters = '请选择水域'
        valid = false
      }
      if (this.formData.waterSystem === null) {
        this.errors.waterSystem = '请选择水系'
        valid = false
      }
      if (!this.formData.segment) {
        this.errors.segment = '请选择航段'
        valid = false
      }
      if (!this.formData.tonnage) {
        this.errors.tonnage = '请填写吨位'
        valid = false
      }
      if (!this.formData.speed) {
        this.errors.speed = '请填写载货量'
        valid = false
      }

      return valid
    },
    show() {
      this.visible = true
    },
    async queryData(url) {
      return axios.get(url);
    },
    selectAll() {
      this.items.forEach(item => {
        item.isEditable = !item.isEditable
      })
    },
    processData(res) {
      this.scheme = res.data.map(item => {
        return {
          powerUnitModel: item.powerUnitModel,
          propellerModel: item.propellerModel,
          shaftModel: item.shaftModel,
          gearboxModel: item.gearboxModel
        };
      });
      console.log('scheme', this.scheme);
    },
    showChart() {
      this.scheme = []
      const url = `/bcd/evaluation/indicator_results`
      this.queryData(url).then(res => {
        this.processData(res)
      })
      this.$refs.chart2.show()
    },
    handleUseful() {
      this.whichButton = 1
      this.handleSubmit
      if (this.validateForm()) {
        this.handleSet()
        this.scheme = []
        const url = `/bcd/evaluation/nsga2`
        this.queryData(url).then(res => {
          // this.processData(res)
          this.scheme = res.data
          this.updateTime = this.getCurrentTimeString()
          localStorage.setItem('scheme1', JSON.stringify(this.scheme))
          localStorage.setItem('updateTime1', JSON.stringify(this.updateTime))
          if (this.buttonEnable1 && this.buttonEnable2) {
            this.buttonEnable1 = true
            this.buttonEnable2 = false
          } else {
            this.buttonEnable1 = true
          }
        })
        this.$refs.chart.show()
        this.$refs.chart.countPercent()

      }
    },
    handleEvaluation() {
      this.whichButton = 2
      this.handleSubmit
      if (this.validateForm()) {
        this.handleSet()
        setTimeout(() => {
          this.scheme = []
          const url = `/bcd/evaluation/traversing`
          this.queryData(url).then(res => {
            // this.processData(res)
            this.scheme = res.data
            this.updateTime = this.getCurrentTimeString()
            localStorage.setItem('updateTime2', JSON.stringify(this.updateTime))
            localStorage.setItem('scheme2', JSON.stringify(this.scheme))
            if (this.buttonEnable1 && this.buttonEnable2) {
              this.buttonEnable2 = true
              this.buttonEnable1 = false
            } else {
              this.buttonEnable2 = true
            }
          })
          this.$refs.chart.show()
          this.$refs.chart.countPercent()
        }, 100);
      }
    },
    handleReliability() {
      const reliability = localStorage.getItem('reliability')
      this.open = true
      if (reliability) {
        this.reliability = reliability
      } else {
        const url = `/bcd/evaluation/reliability`
        this.queryData(url).then(res => {
          console.log(res);
          this.reliability = res.data
          if (this.reliability != 0)
            localStorage.setItem('reliability', this.reliability)
        })
      }

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

.form-item {
  flex: 1
}

.form-item2 {
  flex: 1 1 30%;
}

.form-item2:nth-child(4),
.form-item2:nth-child(5),
.form-item2:nth-child(6) {
  flex: 1 1 20%;
}

.select {
  width: 200px !important;
}

.select2 {
  width: 100px !important;
}

.input,
.input-small,
.input-number {
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

.mtitle {
  margin-left: 30px;
}
</style>

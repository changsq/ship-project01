<template>
  <content>
    <custom-bread-crumb show-icon style="margin-left: 30px;" :list="breadCrumbList"></custom-bread-crumb>
    <div>
      <a v-for="item in breadCrumbList" :to="item.to" :key="`bread-crumb-${item.name}`" class="mtitle">{{
      showTitle(item) }}</a>
    </div>
    <a-modal v-model="predictionResult" title="预测结果" @ok="handlePredictionOk" cancelText="取消" okText="吨位优化推荐">
      <div>2024年水运量为：xxx万吨</div>
    </a-modal>
    <a-modal v-model="toneAdvice" title="吨位推荐" @ok="handleToneOk" cancelText="取消" okText="确定">
      <div>吨位组合推荐：xxxxx</div>
      <div>推荐吨位组合经济性：xxx</div>
      <div>推荐吨位组合排放性：xxx</div>
    </a-modal>
    <a-modal v-model="open" :title="openWhich === 0 ? '谱系图' : 'Pareto解'" :width="picWidth" :footer="[]">
      <div v-if="hideProgress && openWhich === 0">
        <div slot="header">
          <h3>上次更新时间：{{ updateTime }}</h3>
          <h3 v-if="generate">谱系图更新中，请稍后...</h3>
        </div>
        <div style="display: flex;">
          <div>
            <h2 style="margin-top: 20px;">总层级</h2>
            <p style="margin-top: 50px;">谱：动力系统</p>
            <p style="margin-top: 60px;">系：燃料</p>
            <p style="margin-top: 60px;">子系：额定功率</p>
            <p style="margin-top: 60px;">孙系：动力装置型号</p>
          </div>
          <div class="tree-container">
            <vue2-org-tree :data="treeData" />
          </div>
        </div>
      </div>
      <div v-if="!hideProgress">
        <div>生成中，请稍后...</div>
        <a-progress :percent="percentage" />
      </div>
      <div v-if="hideProgress && openWhich === 1">
        <div slot="header">
          <h3>上次更新时间：{{ updateTime }}</h3>
          <h3 v-if="generate">pereto解更新中，请稍后...</h3>
        </div>
        <div>
          <div id="pareto" style="width: 900px;height: 500px;"></div>
        </div>
      </div>
    </a-modal>
    <a-modal v-model="chooseOpen" title="选择进化参数种类" @ok="handleChooseOk" cancelText="取消" okText="确定">
      <a-radio-group v-model="selectedOption">
        <a-radio key="0" value="0">规则更新</a-radio>
        <a-radio key="1" value="1">数据量积累与技术突破</a-radio>
        <a-radio key="2" value="2">运营数据明显差异反馈</a-radio>
      </a-radio-group>
    </a-modal>
    <a-modal v-model="showPic" :width="1300" title="进化结果" @ok="handlePicOk" :closable="false" cancelText="取消"
      okText="确定">
      <div style="text-align: center;">
        <div style="display: flex;">
          <div style="margin-left: 7%;">进化前pareto解：</div>
          <div style="margin-left: 42%;">进化后pareto解：</div>
        </div>
        <div style="display: flex;">
          <img width=50% src="../../../assets/images/originalPareto.png" />
          <div width=50%>
            <img v-show="showPic1" src="../../../assets/images/addData.jpg" />
            <img v-show="showPic0" src="../../../assets/images/ruleChange.jpg" />
            <img v-show="showPic2" src="../../../assets/images/filterData.jpg" />
          </div>
        </div>
      </div>
    </a-modal>
    <a-modal v-model="chooseDevice" title="选择动力装置种类" @ok="handleChooseDeviceOk" cancelText="取消" okText="确定">
      <a-radio-group v-model="selectedPuxi">
        <a-radio key="0" value="0" @change="onChange(0)">内燃机动力系统</a-radio>
        <a-radio key="1" value="1" @change="onChange(1)">燃料电池动力系统</a-radio>
        <a-radio key="2" value="2" @change="onChange(2)">动力电池动力系统</a-radio>
        <a-radio key="3" value="3" @change="onChange(3)">混合动力系统谱系</a-radio>
      </a-radio-group>
    </a-modal>

    <a-modal v-model="showPredictionData" title="运量预测相关数据" :width="1100">
      <template #title>
        <span class="modal-title">运量预测相关数据</span>
      </template>
      <a-table :columns="columns11" :dataSource="dataSourceComputed"></a-table>

      <template slot="footer">
        <a-button key="submit" type="primary" @click="predictionStart">开始预测</a-button>
      </template>
    </a-modal>

    <Edit @editFinish="editFinish" :table="table" ref="edit" />
    <PowerTest ref="TestRef" />
    <div style="height: 120%;">
      <a-card style="margin-top: 10px;width:100%;height: 90px;">
        <a-form ref="form" class="div1">
          <a-form-item label="表格查询" class="div2">
            <a-select v-model="table" size="large" class="select1" @change="handleSelect">
              <a-select-option value="0">动力类别</a-select-option>
              <a-select-option value="1">螺旋桨</a-select-option>
              <a-select-option value="2">船尾轴</a-select-option>
              <a-select-option value="3">齿轮箱</a-select-option>
              <a-select-option value="4">中间轴</a-select-option>
              <a-select-option value="5">传动轴</a-select-option>
              <a-select-option value="6">水域</a-select-option>
              <a-select-option value="7">内河航段</a-select-option>
              <a-select-option value="8">港口</a-select-option>
              <a-select-option value="9">排放等级</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-input type="file" id="file-input" @change="handleFileUpload" accept=".xlsx, .xls"
              style="position: absolute; clip: rect(0 0 0 0);" />
          </a-form-item>
          <a-form-item>
            <a-input type="file" id="file-input2" @change="handleFileUpload2" accept=".xlsx, .xls"
              style="position: absolute; clip: rect(0 0 0 0);" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit" style="margin-left: 20px;"
              @click="handleChooseChange">导入数据</a-button>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit" style="margin-left: 20px;"
              @click="handleCheck">手动数据集成</a-button>
          </a-form-item>
          <a-form-item style="margin-left: 20px;">
            <a-button type="primary" html-type="reset" @click="handleChooseDevice">生成谱系图</a-button>
          </a-form-item>
          <a-form-item style="margin-left: 20px;">
            <a-button type="primary" html-type="reset" @click="checkPareto">查看Pareto解</a-button>
          </a-form-item>
          <a-form-item style="margin-left: 20px;">
            <a-button type="primary" html-type="reset" @click="volumePrediction">运量预测与吨位优化</a-button>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit" style="margin-left: 20px;" @click="addData">模型进化</a-button>
          </a-form-item>
        </a-form>
      </a-card>
      <a-table :columns="columns" :dataSource="data" rowKey="id" :scroll="{ x: 1500 }"
        style="background-color: white;margin-top: 10px;" :pagination="{ pageSize: 8 }">
        <template slot="operation" slot-scope="text, record">
          <a-button type="primary" @click="doEvent('edit', record)">编辑</a-button>
          <a-button type="danger" style="margin-left: 5px;" @click="doEvent('delete', record)">删除</a-button>
        </template>
      </a-table>
    </div>
  </content>
</template>

<script>
import PowerTest from './PowerTest.vue'
import axios from 'axios';
import customBreadCrumb from '@/components/main/components/header-bar/custom-bread-crumb'
import { showTitle } from '@/libs/util';
import Edit from './edit.vue';
import * as XLSX from 'xlsx'
import { Modal, message } from "ant-design-vue";
export default {
  name: 'power_sys_test',
  components: {
    PowerTest,
    Edit,
    customBreadCrumb
  },
  computed: {
    breadCrumbList() {
      return this.$store.state.app.breadCrumbList
    }
  },
  mounted() {
    this.handleSelect()
    const treeData = localStorage.getItem('treeData')
    const paretoData = localStorage.getItem('pareto')
    const updateTime = localStorage.getItem('updateTime')
    if (treeData) {
      this.treeData = JSON.parse(treeData)
      this.hideProgress = true
      this.generate = false
      this.picWidth = '100%'
    }
    if (paretoData) {
      this.paretoData = JSON.parse(paretoData)
      this.hideProgress = true
      this.generate = false
      this.picWidth = '100%'
    }
    if (updateTime) {
      this.updateTime = updateTime
    }
  },
  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  },
  data() {
    return {
      percentage: 0,
      chooseOpen: false,
      chooseDevice: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      selectedOption: null,
      selectedPuxi: null,
      toneAdvice: false,
      predictionResult: false,
      columns11: [
        { title: '年份', dataIndex: 'year', key: '0', width: '15%', align: 'center' },
        { title: '内河航道里程/公里', dataIndex: 'neihelicheng', key: '1', width: '15%', align: 'center' },
        { title: '水运货运周转量/亿吨公里', dataIndex: 'huoyunzhouzhuan', key: '2', width: '15%', align: 'center' },
        { title: '水运量/万吨', dataIndex: 'yunliang', key: '3', width: '15%', align: 'center' },
        { title: 'GDP/万亿美元', dataIndex: 'GDP', key: '4', width: '15%', align: 'center' },
        { title: '水运货物运输平均运距/公里', dataIndex: 'pingjunyunju', key: '5', width: '15%', align: 'center' }
      ],
      dataSourceComputed: [
        {
          "year": 2001,
          "neihelicheng": 121535,
          "huoyunzhouzhuan": 25988.9,
          "yunliang": 2138.3881,
          "GDP": 1.34,
          "pingjunyunju": 1959
        },
        {
          "year": 2002,
          "neihelicheng": 121557,
          "huoyunzhouzhuan": 27510.6,
          "yunliang": 2263.1852,
          "GDP": 1.47,
          "pingjunyunju": 1940
        },
        {
          "year": 2003,
          "neihelicheng": 124210,
          "huoyunzhouzhuan": 28715.8,
          "yunliang": 2311.8751,
          "GDP": 1.66,
          "pingjunyunju": 1817
        },
        {
          "year": 2004,
          "neihelicheng": 123340,
          "huoyunzhouzhuan": 41428.7,
          "yunliang": 3358.9022,
          "GDP": 1.96,
          "pingjunyunju": 2211
        },
        {
          "year": 2005,
          "neihelicheng": 123345,
          "huoyunzhouzhuan": 49672.3,
          "yunliang": 4027.1028,
          "GDP": 2.29,
          "pingjunyunju": 2261
        },
        {
          "year": 2006,
          "neihelicheng": 123400,
          "huoyunzhouzhuan": 55485.7,
          "yunliang": 4496.4141,
          "GDP": 2.75,
          "pingjunyunju": 2231
        },
        {
          "year": 2007,
          "neihelicheng": 123500,
          "huoyunzhouzhuan": 64284.8,
          "yunliang": 5205.2507,
          "GDP": 3.55,
          "pingjunyunju": 2286
        },
        {
          "year": 2008,
          "neihelicheng": 122800,
          "huoyunzhouzhuan": 50262.7,
          "yunliang": 4093.0541,
          "GDP": 4.59,
          "pingjunyunju": 1707
        },
        {
          "year": 2009,
          "neihelicheng": 123700,
          "huoyunzhouzhuan": 57556.7,
          "yunliang": 4652.9242,
          "GDP": 5.1,
          "pingjunyunju": 1804
        },
        {
          "year": 2010,
          "neihelicheng": 119300,
          "huoyunzhouzhuan": 68427.5,
          "yunliang": 5735.7524,
          "GDP": 6.09,
          "pingjunyunju": 1806
        },
        {
          "year": 2011,
          "neihelicheng": 124600,
          "huoyunzhouzhuan": 75423.8,
          "yunliang": 6053.2774,
          "GDP": 7.55,
          "pingjunyunju": 1771
        },
        {
          "year": 2012,
          "neihelicheng": 125000,
          "huoyunzhouzhuan": 81707.6,
          "yunliang": 6536.6063,
          "GDP": 8.53,
          "pingjunyunju": 1781
        },
        {
          "year": 2013,
          "neihelicheng": 125900,
          "huoyunzhouzhuan": 79435.7,
          "yunliang": 6309.4242,
          "GDP": 9.57,
          "pingjunyunju": 1419
        },
        {
          "year": 2014,
          "neihelicheng": 126300,
          "huoyunzhouzhuan": 92774.6,
          "yunliang": 7345.5705,
          "GDP": 10.48,
          "pingjunyunju": 1551
        },
        {
          "year": 2015,
          "neihelicheng": 127000,
          "huoyunzhouzhuan": 91772.5,
          "yunliang": 7226.1772,
          "GDP": 11.06,
          "pingjunyunju": 1496
        },
        {
          "year": 2016,
          "neihelicheng": 127100,
          "huoyunzhouzhuan": 97338.8,
          "yunliang": 7658.4423,
          "GDP": 11.23,
          "pingjunyunju": 1525
        },
        {
          "year": 2017,
          "neihelicheng": 127300,
          "huoyunzhouzhuan": 98611.2,
          "yunliang": 7746.3665,
          "GDP": 12.31,
          "pingjunyunju": 1477
        },
        {
          "year": 2018,
          "neihelicheng": 127600,
          "huoyunzhouzhuan": 99052.8,
          "yunliang": 7762.7598,
          "GDP": 13.89,
          "pingjunyunju": 1410
        },
        {
          "year": 2019,
          "neihelicheng": 124200,
          "huoyunzhouzhuan": 103963.0,
          "yunliang": 8370.6148,
          "GDP": 14.28,
          "pingjunyunju": 1391
        },
        {
          "year": 2020,
          "neihelicheng": 127000,
          "huoyunzhouzhuan": 105834.4,
          "yunliang": 8333.4207,
          "GDP": 14.69,
          "pingjunyunju": 1390
        },
        {
          "year": 2021,
          "neihelicheng": 127500,
          "huoyunzhouzhuan": 115577.5,
          "yunliang": 9064.9025,
          "GDP": 17.82,
          "pingjunyunju": 1403
        },
        {
          "year": 2022,
          "neihelicheng": 128000,
          "huoyunzhouzhuan": 121003.1,
          "yunliang": 9453.3701,
          "GDP": 17.88,
          "pingjunyunju": 1415
        },
        {
          "year": 2023,
          "neihelicheng": 128200,
          "huoyunzhouzhuan": 129951.52,
          "yunliang": 10136.6042,
          "GDP": 17.79,
          "pingjunyunju": 1260,
        },
      ],
      generate: true,
      option: {},
      hideProgress: false,
      picWidth: '50%',
      updateTime: '',
      treeData: {},
      chooseId: 0,
      paretoData: [],
      open: false,
      picData: [],
      table: '0',
      openWhich: 0,
      showPic: false,
      showPic0: false,
      showPic1: false,
      showPic2: false,
      open: false,
      open1: false,
      errors: {},
      data: [],
      excelData: [],
      data0: [
        {
          "id": 1,
          "powerType": "LNG内燃机动力系统",
          "model": "MAN-B&W-ME-GI-9S90ME-C10.5",
          "price": 16500000,
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
      ],
      data1: [
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
      ],
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
      showPredictionData: false,
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
      columns: [],
      column0: [
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

        {
          title: '操作',
          key: 'operation',
          width: '200px',
          align: 'center',
          scopedSlots: { customRender: 'operation' },
          customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } })
        }
      ],
      column1: [
        { title: 'id', dataIndex: 'id', key: '0', width: '100px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '型号', dataIndex: 'model', key: '1', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '价格', dataIndex: 'price', key: '2', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '推进类型', dataIndex: 'propulsionType', key: '3', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '材质', dataIndex: 'material', key: '4', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '直径', dataIndex: 'diameter', key: '5', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '叶片数', dataIndex: 'bladeCount', key: '6', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '叶片角度', dataIndex: 'bladeAngle', key: '7', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '推力', dataIndex: 'thrust', key: '8', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '效率', dataIndex: 'efficiency', key: '9', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '重量', dataIndex: 'weight', key: '10', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '防腐处理', dataIndex: 'antiCorrosion', key: '11', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '维护周期', dataIndex: 'maintenancePeriod', key: '12', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '振动等级', dataIndex: 'vibrationLevel', key: '13', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '工作温度范围', dataIndex: 'temperatureRange', key: '14', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '适用水域', dataIndex: 'applicableWaterArea', key: '15', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        {
          title: '操作',
          key: 'operation',
          width: '200px',
          align: 'center',
          scopedSlots: { customRender: 'operation' },
          customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } })
        }
      ],
      column2: [
        { title: 'ID', dataIndex: 'id', key: '0', width: '100px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '型号', dataIndex: 'tailShaftModel', key: '1', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '价格', dataIndex: 'price', key: '2', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '长度', dataIndex: 'length', key: '3', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '直径', dataIndex: 'diameter', key: '4', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '材质', dataIndex: 'material', key: '5', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '最大扭矩', dataIndex: 'maxTorque', key: '6', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '疲劳寿命', dataIndex: 'fatigueStrength', key: '7', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) }, // 注意：原始数据中的字段名为 'fatigueStrength'
        { title: '重量', dataIndex: 'weight', key: '8', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '防腐处理', dataIndex: 'surfaceTreatment', key: '9', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) }, // 注意：原始数据中的字段名为 'surfaceTreatment'
        { title: '维护周期', dataIndex: 'maintenanceInterval', key: '10', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) }, // 注意：原始数据中的字段名为 'maintenanceInterval'
        { title: '工作温度范围', dataIndex: 'temperatureRange', key: '12', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '适用水域', dataIndex: 'applicableWaterArea', key: '13', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        {
          title: '操作',
          key: 'operation',
          width: '200px',
          align: 'center',
          scopedSlots: { customRender: 'operation' },
          customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } })
        }
      ],
      column3: [
        { title: 'id', dataIndex: 'id', key: '0', width: '100px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '型号', dataIndex: 'model', key: '1', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '价格', dataIndex: 'price', key: '2', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '传动比', dataIndex: 'gearRatio', key: '3', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '扭矩容量', dataIndex: 'torqueCapacity', key: '4', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '材质', dataIndex: 'material', key: '5', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '噪声等级', dataIndex: 'noiseLevel', key: '6', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '耐久性', dataIndex: 'durability', key: '7', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '重量', dataIndex: 'weight', key: '8', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '维护周期', dataIndex: 'maintenancePeriod', key: '9', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '振动等级', dataIndex: 'vibrationLevel', key: '10', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '工作温度范围', dataIndex: 'temperatureRange', key: '11', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '适用水域', dataIndex: 'applicableWaterArea', key: '12', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        {
          title: '操作',
          key: 'operation',
          width: '200px',
          align: 'center',
          scopedSlots: { customRender: 'operation' },
          customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } })
        }
      ],
      column4: [
        { title: 'ID', dataIndex: 'id', key: '0', width: '100px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '型号', dataIndex: 'model', key: '1', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '价格', dataIndex: 'price', key: '2', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '传动比', dataIndex: 'transmissionRatio', key: '3', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '扭矩容量', dataIndex: 'maxTorque', key: '4', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '材质', dataIndex: 'material', key: '5', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '噪声等级', dataIndex: 'noiseLevel', key: '6', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '耐久性', dataIndex: 'durability', key: '7', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '重量', dataIndex: 'weight', key: '8', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '维护周期', dataIndex: 'maintenancePeriod', key: '9', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '振动等级', dataIndex: 'vibrationLevel', key: '10', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '工作温度范围', dataIndex: 'temperatureRange', key: '11', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '适用水域', dataIndex: 'applicableWaterArea', key: '12', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '直径', dataIndex: 'diameter', key: '13', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '长度', dataIndex: 'length', key: '14', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '最大转速', dataIndex: 'speed', key: '15', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '轴颈直径', dataIndex: 'journalDiameter', key: '16', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '法兰规格', dataIndex: 'flangeSpecification', key: '17', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '键槽及键', dataIndex: 'keySlotAndKey', key: '18', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '表面粗糙度', dataIndex: 'surfaceRoughness', key: '19', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '径向跳动', dataIndex: 'runout', key: '20', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '圆柱度', dataIndex: 'cylindricity', key: '21', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '圆度', dataIndex: 'roundness', key: '22', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '适用动力系统', dataIndex: 'applicablePowerSystem', key: '23', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '输入功率', dataIndex: 'inputPower', key: '24', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '输出功率', dataIndex: 'outputPower', key: '25', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '润滑方式', dataIndex: 'lubricationMethod', key: '26', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '连接方式', dataIndex: 'connectionMethod', key: '27', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '防护措施', dataIndex: 'protectiveMeasures', key: '28', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '认证和标准', dataIndex: 'certificationAndStandards', key: '29', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        {
          title: '操作',
          key: 'operation',
          width: '200px',
          align: 'center',
          scopedSlots: { customRender: 'operation' },
          customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } })
        }
      ],
      column5: [
        { title: 'ID', dataIndex: 'id', key: '0', width: '100px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '型号', dataIndex: 'model', key: '1', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '价格', dataIndex: 'price', key: '2', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '长度', dataIndex: 'length', key: '3', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '直径', dataIndex: 'diameter', key: '4', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '材质', dataIndex: 'material', key: '5', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '最大扭矩', dataIndex: 'maxTorque', key: '6', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '疲劳寿命', dataIndex: 'fatigueLife', key: '7', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '重量', dataIndex: 'weight', key: '8', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '防腐措施', dataIndex: 'antiCorrosion', key: '9', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '维护周期', dataIndex: 'maintenancePeriod', key: '10', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '振动等级', dataIndex: 'vibrationLevel', key: '11', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '工作温度范围', dataIndex: 'temperatureRange', key: '12', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '适用水域', dataIndex: 'applicableWaterArea', key: '13', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '维护费用', dataIndex: 'maintenancePrice', key: '14', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '适用船型', dataIndex: 'applicableShipType', key: '15', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '主发动机功率', dataIndex: 'mainEnginePower', key: '16', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '最大转速', dataIndex: 'speed', key: '17', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '制造商', dataIndex: 'manufacturer', key: '18', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        {
          title: '操作',
          key: 'operation',
          width: '200px',
          align: 'center',
          scopedSlots: { customRender: 'operation' },
          customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } })
        }
      ],
      column6: [
        { title: 'ID', dataIndex: 'id', key: '0', width: '100px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '水域名称', dataIndex: 'waterAreaName', key: '1', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '航道等级', dataIndex: 'levelOfNavigationArea', key: '2', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '最小转弯半径', dataIndex: 'minimumBendingRadiusOfNavigationArea', key: '3', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '平均水深', dataIndex: 'averageWaterDepth', key: '4', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '最大水深', dataIndex: 'maximumWaterDepth', key: '5', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '最小水深', dataIndex: 'minimumWaterDepth', key: '6', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '岛屿数量', dataIndex: 'numberOfIslands', key: '7', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '水域长度', dataIndex: 'waterLength', key: '8', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '平均宽度', dataIndex: 'averageWidth', key: '9', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '最大宽度', dataIndex: 'maximumWidth', key: '10', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        {
          title: '操作',
          key: 'operation',
          width: '200px',
          align: 'center',
          scopedSlots: { customRender: 'operation' },
          customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } })
        }
      ],
      column7: [
        { title: 'ID', dataIndex: 'id', key: '0', width: '100px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '段名', dataIndex: 'segmentName', key: '1', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '沿线港口', dataIndex: 'segmentPorts', key: '2', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '段长（公里）', dataIndex: 'segmentLength', key: '3', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '复杂程度', dataIndex: 'segmentComplexity', key: '4', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '沿海排放等级', dataIndex: 'coastalEmissionLevel', key: '5', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '平均水深（米）', dataIndex: 'averageDepth', key: '6', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '最大水深（米）', dataIndex: 'maxDepth', key: '7', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '最小水深（米）', dataIndex: 'minDepth', key: '8', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '平均宽度（米）', dataIndex: 'averageWidth', key: '9', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '最大宽度（米）', dataIndex: 'maxWidth', key: '10', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '最小宽度（米）', dataIndex: 'minWidth', key: '11', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '适用船舶吨位', dataIndex: 'applicableShipTonnage', key: '12', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '所属水系', dataIndex: 'belongingWaterSystem', key: '13', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        {
          title: '操作',
          key: 'operation',
          width: '200px',
          align: 'center',
          scopedSlots: { customRender: 'operation' },
          customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } })
        }
      ],
      column8: [
        { title: 'ID', dataIndex: 'id', key: '0', width: '100px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '港口名称', dataIndex: 'harbourName', key: '1', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '港口代码', dataIndex: 'harbourCode', key: '2', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '国家', dataIndex: 'country', key: '3', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '经度', dataIndex: 'longitude', key: '4', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '纬度', dataIndex: 'latitude', key: '5', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '磁偏角', dataIndex: 'magneticVariation', key: '6', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '进出点', dataIndex: 'entryAndExitPoint', key: '7', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '是否公开', dataIndex: 'publiclyAnnounced', key: '8', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }), render: (text) => text ? '是' : '否' },
        {
          title: '操作',
          key: 'operation',
          width: '200px',
          align: 'center',
          scopedSlots: { customRender: 'operation' },
          customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } })
        }
      ],
      column9: [
        { title: 'ID', dataIndex: 'id', key: '0', width: '100px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '级别ID', dataIndex: 'level_id', key: '1', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '级别名称', dataIndex: 'level', key: '2', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '请求内容', dataIndex: 'request', key: '3', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        { title: '实施日期', dataIndex: 'implementationData', key: '4', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }), render: (text) => new Date(text).toLocaleDateString() },
        { title: '适用水域ID', dataIndex: 'applicableWaterArea_id', key: '5', width: '200px', align: 'center', customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } }) },
        {
          title: '操作',
          key: 'operation',
          width: '200px',
          align: 'center',
          scopedSlots: { customRender: 'operation' },
          customHeaderCell: () => ({ style: { backgroundColor: '#E2EBFC' } })
        }
      ],
    }
  },
  methods: {
    showTitle(item) {
      return showTitle(item, this)
    },
    onChange() { },
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
    predictionStart() {
      this.predictionResult = true;
    },
    handleChooseOk() {
      this.chooseOpen = false;
      document.getElementById('file-input2').click();
    },
    handleChooseChange() {
      document.getElementById('file-input').click();
    },
    handleOk() {

    },
    handlePredictionOk() {
      this.toneAdvice = true;
      this.predictionResult = false;

    },
    handleToneOk() {
      this.toneAdvice = false;
    },
    volumePrediction() {
      this.showPredictionData = true;
    },
    handleTest() {
      this.open = true
    },
    handleEdit() {
      this.$refs.TestRef.show()
    },
    async queryData(url) {
      return axios.get(url);
    },
    editFinish() {
      this.handleSelect()
    },
    handleFileUpload(event) {
      const file = event.target.files[0]  //获取上传的文件
      if (file) {
        const reader = new FileReader() //创建FileReader对象，说明：它通常用于处理本地文件的读取操作，例如读取文本文件、图像文件、或像前面示例中的Excel文件一样的二进制文件

        reader.onload = (event) => {   // 设置事件监听器
          const data = event.target.result
          const workbook = XLSX.read(data, { type: 'array' })

          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          this.excelData = XLSX.utils.sheet_to_json(worksheet)
          this.sendData();
        }

        reader.readAsArrayBuffer(file);
      }
    },
    sendData() {
      const url0 = `/bcd/api/powerunit/batch`
      const url1 = `/bcd/api/propeller-news/batch`
      const url2 = `/bcd/api/stern-shafts/batch`
      const url3 = `/bcd/api/gearbox-news/batch`
      const url4 = `/bcd/api/intermediate-shafts/batch`
      const url5 = `/bcd/api/grank-shafts/batch`
      const url6 = `/bcd/api/water-areas/batch`
      const url7 = `/bcd/api/inland-river-segments/batch`
      const url8 = `/bcd/api/harbours/batch`
      const url9 = `/bcd/api/emission-level/batch`
      switch (this.table) {
        case '0':
          //获取数据赋值给data
          this.postData(url0)
          break;
        case '1':
          this.postData(url1)
          break;
        case '2':
          this.postData(url2)
          break;
        case '3':
          this.postData(url3)
          break;
        case '4':
          this.postData(url4)
          break;
        case '5':
          this.postData(url5)
          break;
        case '6':
          this.postData(url6)
          break;
        case '7':
          this.postData(url7)
          break;
        case '8':
          this.postData(url8)
          break;
        case '9':
          this.postData(url9)
          break;
        default:
          break;
      }
    },
    handlePicOk() {
      this.showPic = false;
      this.showPic0 = false;
      this.showPic1 = false;
      this.showPic2 = false;
    },
    handleSelect() {
      const url0 = `/bcd/api/powerunit`
      const url1 = `/bcd/api/propeller-news/all`
      const url2 = `/bcd/api/stern-shafts/all`
      const url3 = `/bcd/api/gearbox-news/all`
      const url4 = `/bcd/api/intermediate-shafts/all`
      const url5 = `/bcd/api/grank-shafts/all`
      const url6 = `/bcd/api/water-areas/all`
      const url7 = `/bcd/api/inland-river-segments/all`
      const url8 = `/bcd/api/harbours/all`
      const url9 = `/bcd/api/emission-level/all`
      switch (this.table) {
        case '0':
          //获取数据赋值给data
          this.queryData(url0).then(res => {
            this.data = res.data
            this.columns = this.column0
          })
          break;
        case '1':
          this.queryData(url1).then(res => {
            this.data = res.data
            this.columns = this.column1
          })
          break;
        case '2':
          this.queryData(url2).then(res => {
            this.data = res.data
            this.columns = this.column2
          })
          break;
        case '3':
          this.queryData(url3).then(res => {
            this.data = res.data
            this.columns = this.column3
          })
          break;
        case '4':
          this.queryData(url4).then(res => {
            this.data = res.data
            this.columns = this.column4
          })
          break;
        case '5':
          this.queryData(url5).then(res => {
            this.data = res.data
            this.columns = this.column5
          })
          break;
        case '6':
          this.queryData(url6).then(res => {
            this.data = res.data
            this.columns = this.column6
          })
          break;
        case '7':
          this.queryData(url7).then(res => {
            this.data = res.data
            this.columns = this.column7
          })
          break;
        case '8':
          this.queryData(url8).then(res => {
            this.data = res.data
            this.columns = this.column8
          })
          break;
        case '9':
          this.queryData(url9).then(res => {
            this.data = res.data
            this.columns = this.column9
          })
          break;
        default:
          break;
      }
    },
    handleFileUpload2() {
      console.log('showpic1111');
      this.showPic = true;
      switch (this.selectedOption) {
        case '0':
          //获取数据赋值给data
          this.showPic0 = true;
          break;
        case '1':
          this.showPic1 = true;
          break;
        case '2':
          this.showPic2 = true;
          break;
        default:
          break;
      }
    },
    postData(url) {
      this.$axios({
        url: url,
        method: "post",
        data: this.excelData
      }).then(() => {
        this.handleSelect()
      })
    },
    countPercent() {
      clearInterval(this.timer);
      this.percentage = 0; // 重置进度为0
      this.timer = setInterval(() => {
        this.updateProgress();
      }, 1000); // 每隔1秒更新一次进度
    },
    updateProgress() {
      if (this.percentage < 100) {
        this.percentage += 10;
      } else {
        clearInterval(this.timer); // 清除定时器
      }
    },
    checkPareto() {
      this.picWidth = '50%'
      this.open = true
      this.openWhich = 1
      this.generate = true
      if (this.paretoData) {
        setTimeout(() => {
          this.hhh();
        }, 1);
      }
      if (!this.paretoData || Object.keys(this.paretoData).length === 0) {
        this.hideProgress = false
        this.countPercent()
      }
      const url = `/bcd/evaluation/nsga2`
      this.queryData(url).then(res => {
        console.log(res.data);
        this.paretoData = res.data.map(item => ([
          item.economicValue,
          item.emissionValue
        ]));
        localStorage.setItem('pareto', JSON.stringify(this.paretoData))
        this.updateTime = this.getCurrentTimeString()
        localStorage.setItem('updateTime', this.updateTime)
        if (this.paretoData) {
          this.hideProgress = true
          this.picWidth = '100%'
          this.generate = false
          setTimeout(() => {
            this.hhh();
          }, 1);
        }
      })
    },
    hhh() {
      this.picWidth = '50%'
      var chartInstance = this.$echarts.init(document.getElementById('pareto'));
      const option = {
        title: {
          text: 'Pareto解'
        },
        tooltip: {},
        xAxis: {
          type: 'log',
          name: '经济性',
        },
        yAxis: {
          type: 'log',
          name: '排放性',
        },
        series: [
          {
            type: 'scatter',
            data: this.paretoData,
          },
        ],
      };
      chartInstance.setOption(option);
    },
    addData() {
      this.chooseOpen = true;
    },
    chooseUrl(table) {
      let url = ''; // 使用 let 声明变量
      switch (table) {
        case '0':
          url = `/bcd/api/powerunit/${this.chooseId}`;
          break;
        case '1':
          url = `/bcd/api/propeller-news/${this.chooseId}`;
          break;
        case '2':
          url = `/bcd/api/stern-shaft/${this.chooseId}`;
          break;
        case '3':
          url = `/bcd/api/gearbox-news/${this.chooseId}`;
          break;
        case '4':
          url = `/bcd/api/intermediate-shafts/${this.chooseId}`;
          break;
        case '5':
          url = `/bcd/api/grank-shafts/${this.chooseId}`;
          break;
        case '6':
          url = `/bcd/api/water-areas/${this.chooseId}`;
          break;
        case '7':
          url = `/bcd/api/inland-river-segments/${this.chooseId}`;
          break;
        case '8':
          url = `/bcd/api/harbours/${this.chooseId}`;
          break;
        case '9':
          url = `/bcd/api/emission-level/${this.chooseId}`;
          break;
        default:
          console.error('Invalid table value:', table);
          break;
      }
      return url; // 返回 URL
    },
    doEvent(event, item) {
      switch (event) {
        case 'create':
          this.$refs.create.show()
          break;
        case 'delete':
          this.delUser(item)
          break;
        case 'edit':
          this.$refs.edit.show(item)
          break;
        default:
          break;
      }
    },
    handleCheck() {
      switch (this.table) {
        case '0':
          this.checkData(this.data1, this.data0)
          break;
        // case '1':
        //   this.checkData(this.data, this.data1)
        //   break;
        // case '2':
        //   this.checkData(this.data, this.data2)
        //   break;
        // case '3':
        //   this.checkData(this.data, this.data3)
        //   break;
        default:
          break;
      }
    },
    delUser(item) {
      this.chooseId = item.id
      const url = this.chooseUrl(this.table);
      Modal.confirm({
        title: `请确认`,
        content: `是否删除【${item.id}】?`,
        onOk: () => {
          axios.delete(url)
            .then(() => {
              message.info(`删除成功`);
              this.handleSelect()
            });
        },
        onCancel() { }
      });
    },
    checkData(nowData, storageData) {

      // if (nowData === storageData) {
      //   this.$message.info('没有数据更改');
      // } else {
      this.data = [
        ...nowData.slice(0, 8), // 插入 storageData 的前8项
        ...this.data.slice(8)        // 保留 this.data 的第9项及之后的所有项
      ];
      this.$message.success('数据已经更改');
      console.log(this.data);
      // }
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
    createTreeData(dataList) {
      const root = {
        id: 0,
        label: "低/零碳绿色船舶动力系统",
        children: [],
      };

      for (let item of dataList) {
        let powerTypeItem = root.children.find(x => x.id === `powerType_${item.powerType}`);
        if (!powerTypeItem) {
          powerTypeItem = {
            id: `powerType_${item.powerType}`,
            label: item.powerType,
            children: [],
          };
          root.children.push(powerTypeItem);
        }

        let fuelTypeItem = powerTypeItem.children.find(x => x.id === `fuelType_${item.fuelType}`);
        if (!fuelTypeItem) {
          fuelTypeItem = {
            id: `fuelType_${item.fuelType}`,
            label: item.fuelType,
            children: [],
          };
          powerTypeItem.children.push(fuelTypeItem);
        }

        let ratedPowerItem = fuelTypeItem.children.find(x => x.id === `ratedPower_${item.ratedPower}`);
        if (!ratedPowerItem) {
          ratedPowerItem = {
            id: `ratedPower_${item.ratedPower}`,
            label: item.ratedPower.toString(),
            children: [],
          };
          fuelTypeItem.children.push(ratedPowerItem);
        }

        let modelItem = ratedPowerItem.children.find(x => x.id === `model_${item.model}`);
        if (!modelItem) {
          modelItem = {
            id: `model_${item.model}`,
            label: item.model,
            children: [],
          };
          ratedPowerItem.children.push(modelItem);
        }
      }

      return root;
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
    handleChooseDevice() {
      this.chooseDevice = true;
    },
    handleChooseDeviceOk() {
      this.chooseDevice = false;
      this.resetForm();
    },
    resetForm() {
      this.open = true
      this.generate = true
      if (!this.treeData || Object.keys(this.treeData).length === 0) {
        this.picWidth = '50%'
        this.hideProgress = false
        this.countPercent()
      } else {
        this.picWidth = '100%'
      }
      this.openWhich = 0
      const url = `/bcd/evaluation/nsga2`
      this.queryData(url).then(res => {
        console.log(res.data);
        this.picData = res.data.map(item => ({
          powerType: item.powerType,
          fuelType: item.fuelType,
          model: item.model,
          ratedPower: item.ratedPower,
        }));
        this.treeData = this.createTreeData(this.picData)
        this.updateTime = this.getCurrentTimeString()
        localStorage.setItem('updateTime', this.updateTime)
        localStorage.setItem('treeData', JSON.stringify(this.treeData))

        if (this.treeData) {
          this.hideProgress = true
          this.generate = false
          this.picWidth = '100%'
        }
      })
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

.tree-container {
  
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
}

.mtitle {
  margin-left: 30px;
}
</style>

<template>
  <div style="height: 100%;">
    <custom-bread-crumb show-icon style="margin-left: 30px;" :list="breadCrumbList"></custom-bread-crumb>
    <div>
      <a v-for="item in breadCrumbList" :to="item.to" :key="`bread-crumb-${item.name}`" class="mtitle">{{
      showTitle(item) }}</a>
    </div>
    <a-card style="margin-top: 10px;width:100%;height: 90px;">
      <a-form ref="form" class="div1">
        <a-form-item label="航线查询">
          <div class="div2">
            <a-select v-model="route" size="large" @change="selectRoute">
              <a-select-option value="0">内河航线案例</a-select-option>
              <a-select-option value="1">大连-天津</a-select-option>
              <a-select-option value="2">天津-青岛</a-select-option>
              <a-select-option value="3">秦皇岛-烟台</a-select-option>
              <a-select-option value="4">唐山-青岛</a-select-option>
              <a-select-option value="5">烟台-大连</a-select-option>
            </a-select>
            <a-button type="primary" style="margin-left:20px;" @click="showResult">评估结果</a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card style="margin-top: 10px;width:100%;height: 100%;">
      <div>
        <div id="leaflet-map"></div>
      </div>
    </a-card>
    <a-modal :visible="result" title="评估结果" width="90%" :footer="null" centered @cancel="Oncancel">
      <!-- 图表容器 -->
      <div id="result" style="width: 100%; height: 740px;">
        <a-icon v-show="true" type="loading"
          style="position:absolute;color: black;z-index: 1000;font-size:40px;margin: 150px 800px;" />
      </div>
    </a-modal>

  </div>
</template>

<script>
import customBreadCrumb from '@/components/main/components/header-bar/custom-bread-crumb'
import { showTitle } from '@/libs/util';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
const defaultMarkers = [
  {
    id: 1,
    portName: "九江港",
    latitude: 29.7247,
    longitude: 116.0026,
    usageFeePerTon: 20,
    noxEmissionStandard: "IMO Tier III标准",
    soxEmissionStandard: "低于0.10% m/m",
    carbonEmissionStandard: "EEDI",
    lngRefueling: "是",
    chargingFacility: "是",
    hydrogenFuelSupply: "否",
    biodieselSupply: "是",
    biomethanolSupply: "否",
    ammoniaFuelSupply: "否",
    fuelStorageCondition: "良好",
    fuelSupplyChainStability: "稳定",
    fuelStorageCapacity: 5000,
    lngStorageCapacity: 5000,
    chargingStorageCapacity: 3000,
    biodieselStorageCapacity: 4000,
    safetyFacilities: "完善",
    accidentRecords: "无",
    emergencyPlan: "有",
    existingApplicationCases: "LNG内燃机动力系统",
    techRdinvestmentPerYear: 500,
    techTrainingPerYear: 5,
    techSupportCapability: "有",
    maxBerthingCapacity: 10000,
    nextPortDistance: 220,
    draftDepth: "待补充",
    tonnage: "待补充",
    dimensions: "待补充",
    shipType: "待补充"
  },
  {
    id: 2,
    portName: "安庆港",
    latitude: 30.5426,
    longitude: 117.0635,
    usageFeePerTon: 18,
    noxEmissionStandard: "IMO Tier III标准",
    soxEmissionStandard: "低于0.10% m/m",
    carbonEmissionStandard: "EEDI",
    lngRefueling: "否",
    chargingFacility: "是",
    hydrogenFuelSupply: "否",
    biodieselSupply: "是",
    biomethanolSupply: "是",
    ammoniaFuelSupply: "否",
    fuelStorageCondition: "一般",
    fuelSupplyChainStability: "稳定",
    fuelStorageCapacity: 3000,
    chargingStorageCapacity: 2000,
    biodieselStorageCapacity: 2500,
    biomethanolStorageCapacity: 1500,
    safetyFacilities: "一般",
    accidentRecords: "无",
    emergencyPlan: "有",
    existingApplicationCases: "生物柴油内燃机动力系统",
    techRdinvestmentPerYear: 200,
    techTrainingPerYear: 2,
    techSupportCapability: "无",
    maxBerthingCapacity: 5000,
    nextPortDistance: 180,
    draftDepth: "待补充",
    tonnage: "待补充",
    dimensions: "待补充",
    shipType: "待补充"
  },
  {
    id: 3,
    portName: "芜湖港",
    latitude: 31.3449,
    longitude: 118.3725,
    usageFeePerTon: 22,
    noxEmissionStandard: "IMO Tier III标准",
    soxEmissionStandard: "低于0.10% m/m",
    carbonEmissionStandard: "EEDI",
    lngRefueling: "是",
    chargingFacility: "是",
    hydrogenFuelSupply: "否",
    biodieselSupply: "是",
    biomethanolSupply: "否",
    ammoniaFuelSupply: "否",
    fuelStorageCondition: "良好",
    fuelSupplyChainStability: "稳定",
    fuelStorageCapacity: 8000,
    lngStorageCapacity: 6000,
    chargingStorageCapacity: 2500,
    biodieselStorageCapacity: 3500,
    safetyFacilities: "完善",
    accidentRecords: "无",
    emergencyPlan: "有",
    existingApplicationCases: "磷酸铁锂动力电池系统",
    techRdinvestmentPerYear: 800,
    techTrainingPerYear: 8,
    techSupportCapability: "有",
    maxBerthingCapacity: 20000,
    nextPortDistance: 60,
    draftDepth: "待补充",
    tonnage: "待补充",
    dimensions: "待补充",
    shipType: "待补充"
  },
  {
    id: 4,
    portName: "马鞍山港",
    latitude: 31.6856,
    longitude: 118.4911,
    usageFeePerTon: 15,
    noxEmissionStandard: "IMO Tier III标准",
    soxEmissionStandard: "低于0.10% m/m",
    carbonEmissionStandard: "EEDI",
    lngRefueling: "否",
    chargingFacility: "否",
    hydrogenFuelSupply: "否",
    biodieselSupply: "是",
    biomethanolSupply: "否",
    ammoniaFuelSupply: "否",
    fuelStorageCondition: "一般",
    fuelSupplyChainStability: "一般",
    fuelStorageCapacity: 2000,
    biodieselStorageCapacity: 2000,
    safetyFacilities: "一般",
    accidentRecords: "无",
    emergencyPlan: "有",
    existingApplicationCases: "生物柴油内燃机动力系统",
    techRdinvestmentPerYear: 100,
    techTrainingPerYear: 1,
    techSupportCapability: "无",
    maxBerthingCapacity: 3000,
    nextPortDistance: 120,
    draftDepth: "待补充",
    tonnage: "待补充",
    dimensions: "待补充",
    shipType: "待补充"
  },
  {
    id: 5,
    portName: "南京港",
    latitude: 32.0667,
    longitude: 118.7667,
    usageFeePerTon: 25,
    noxEmissionStandard: "IMO Tier III标准",
    soxEmissionStandard: "低于0.10% m/m",
    carbonEmissionStandard: "EEDI",
    lngRefueling: "是",
    chargingFacility: "是",
    hydrogenFuelSupply: "是",
    biodieselSupply: "是",
    biomethanolSupply: "是",
    ammoniaFuelSupply: "是",
    fuelStorageCondition: "优秀",
    fuelSupplyChainStability: "稳定",
    fuelStorageCapacity: 15000,
    lngStorageCapacity: 8000,
    chargingStorageCapacity: 4000,
    hydrogenStorageCapacity: 10000,
    biodieselStorageCapacity: 6000,
    biomethanolStorageCapacity: 3000,
    ammoniaStorageCapacity: 5000,
    safetyFacilities: "完善",
    accidentRecords: "无",
    emergencyPlan: "有",
    existingApplicationCases: "氢燃料电池动力系统",
    techRdinvestmentPerYear: 1200,
    techTrainingPerYear: 12,
    techSupportCapability: "有",
    maxBerthingCapacity: 50000,
    nextPortDistance: 100,
    draftDepth: "待补充",
    tonnage: "待补充",
    dimensions: "待补充",
    shipType: "待补充"
  },
  {
    id: 6,
    portName: "镇江港",
    latitude: 32.2094,
    longitude: 119.4342,
    usageFeePerTon: 20,
    noxEmissionStandard: "IMO Tier III标准",
    soxEmissionStandard: "低于0.10% m/m",
    carbonEmissionStandard: "EEDI",
    lngRefueling: "是",
    chargingFacility: "是",
    hydrogenFuelSupply: "否",
    biodieselSupply: "是",
    biomethanolSupply: "否",
    ammoniaFuelSupply: "否",
    fuelStorageCondition: "良好",
    fuelSupplyChainStability: "稳定",
    fuelStorageCapacity: 6000,
    lngStorageCapacity: 5500,
    chargingStorageCapacity: 2000,
    biodieselStorageCapacity: 3000,
    safetyFacilities: "完善",
    accidentRecords: "无",
    emergencyPlan: "有",
    existingApplicationCases: "混合动力系统",
    techRdinvestmentPerYear: 600,
    techTrainingPerYear: 6,
    techSupportCapability: "有",
    maxBerthingCapacity: 10000,
    nextPortDistance: 140,
    draftDepth: "待补充",
    tonnage: "待补充",
    dimensions: "待补充",
    shipType: "待补充"
  },
  {
    id: 7,
    portName: "南通港",
    latitude: 32.0144,
    longitude: 120.8753,
    usageFeePerTon: 22,
    noxEmissionStandard: "IMO Tier III标准",
    soxEmissionStandard: "低于0.10% m/m",
    carbonEmissionStandard: "EEDI",
    lngRefueling: "是",
    chargingFacility: "是",
    hydrogenFuelSupply: "否",
    biodieselSupply: "是",
    biomethanolSupply: "是",
    ammoniaFuelSupply: "否",
    fuelStorageCondition: "良好",
    fuelSupplyChainStability: "稳定",
    fuelStorageCapacity: 10000,
    lngStorageCapacity: 7000,
    chargingStorageCapacity: 3500,
    biodieselStorageCapacity: 4500,
    biomethanolStorageCapacity: 2000,
    safetyFacilities: "完善",
    accidentRecords: "无",
    emergencyPlan: "有",
    existingApplicationCases: "LNG燃料电池动力系统",
    techRdinvestmentPerYear: 900,
    techTrainingPerYear: 9,
    techSupportCapability: "有",
    maxBerthingCapacity: 30000,
    nextPortDistance: 118,
    draftDepth: "待补充",
    tonnage: "待补充",
    dimensions: "待补充",
    shipType: "待补充"
  },
  {
    id: 8,
    portName: "上海港",
    latitude: 31.3789,
    longitude: 121.8989,
    usageFeePerTon: 30,
    noxEmissionStandard: "IMO Tier III标准",
    soxEmissionStandard: "低于0.10% m/m",
    carbonEmissionStandard: "EEDI",
    lngRefueling: "是",
    chargingFacility: "是",
    hydrogenFuelSupply: "是",
    biodieselSupply: "是",
    biomethanolSupply: "是",
    ammoniaFuelSupply: "是",
    fuelStorageCondition: "优秀",
    fuelSupplyChainStability: "稳定",
    fuelStorageCapacity: 20000,
    lngStorageCapacity: 10000,
    chargingStorageCapacity: 5000,
    hydrogenStorageCapacity: 12000,
    biodieselStorageCapacity: 7000,
    biomethanolStorageCapacity: 4000,
    ammoniaStorageCapacity: 6000,
    safetyFacilities: "完善",
    accidentRecords: "无",
    emergencyPlan: "有",
    existingApplicationCases: "氢内燃机动力系统",
    techRdinvestmentPerYear: 1500,
    techTrainingPerYear: 15,
    techSupportCapability: "有",
    maxBerthingCapacity: 100000,
    nextPortDistance: 0,
    draftDepth: "待补充",
    tonnage: "待补充",
    dimensions: "待补充",
    shipType: "待补充"
  }
];
// 修复默认标记图标问题
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

export default {
  name: 'ECS',
  components: {
    customBreadCrumb
  },
  computed: {
    breadCrumbList() {
      return this.$store.state.app.breadCrumbList
    },
    path() {
      return this.markers.map(marker => ({
        lng: marker.longitude,
        lat: marker.latitude
      }));
    },
  },
  mounted() {
    this.initMap();
    this.addMarkers();
  },
  data() {
    return {
      title: '',
      route: '0',
      loading: true,
      result: false,
      rawData: [], // 存储原始数据
      option: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        title: [
          {
            text: '经济价值',
            left: '25%',
            top: '0%',
            textAlign: 'center',
            textStyle: {
              fontSize: 14,
              fontWeight: 'bold'
            }
          },
          {
            text: '排放值',
            left: '75%',
            top: '0%',
            textAlign: 'center',
            textStyle: {
              fontSize: 14,
              fontWeight: 'bold'
            }
          },
          {
            text: '燃料可用性',
            left: '25%',
            top: '36%',
            textAlign: 'center',
            textStyle: {
              fontSize: 14,
              fontWeight: 'bold'
            }
          },
          {
            text: '安全值',
            left: '75%',
            top: '36%',
            textAlign: 'center',
            textStyle: {
              fontSize: 14,
              fontWeight: 'bold'
            }
          },
          {
            text: '技术成熟度',
            left: 'center',
            top: '68%',
            textAlign: 'center',
            textStyle: {
              fontSize: 14,
              fontWeight: 'bold'
            }
          }
        ],
        grid: [
          { top: '5%', left: '5%', right: '55%', bottom: '60%', height: '25%' },    // 经济价值
          { top: '5%', left: '55%', right: '3%', bottom: '60%', height: '25%' },    // 排放值
          { top: '40%', left: '5%', right: '55%', bottom: '30%', height: '25%' },   // 燃料可用性
          { top: '40%', left: '55%', right: '3%', bottom: '30%', height: '25%' },   // 安全值
          { top: '72%', left: '25%', right: '25%', bottom: '0%', height: '25%' }     // 技术成熟度
        ],
        xAxis: [
          { type: 'category', gridIndex: 0, data: [], axisTick: { alignWithLabel: true }, show: false },
          { type: 'category', gridIndex: 1, data: [], axisTick: { alignWithLabel: true }, show: false },
          { type: 'category', gridIndex: 2, data: [], axisTick: { alignWithLabel: true }, show: false },
          { type: 'category', gridIndex: 3, data: [], axisTick: { alignWithLabel: true }, show: false },
          { type: 'category', gridIndex: 4, data: [], axisTick: { alignWithLabel: true }, show: false }
        ],
        yAxis: [
          { type: 'value', gridIndex: 0, axisLabel: { formatter: this.valueFormatter } },
          { type: 'value', gridIndex: 1, axisLabel: { formatter: this.valueFormatter } },
          { type: 'value', gridIndex: 2, axisLabel: { formatter: this.valueFormatter } },
          { type: 'value', gridIndex: 3, axisLabel: { formatter: this.valueFormatter } },
          { type: 'value', gridIndex: 4, axisLabel: { formatter: this.valueFormatter } }
        ],
        series: [
          { name: '经济价值', type: 'bar', xAxisIndex: 0, yAxisIndex: 0, data: [] },
          { name: '排放值', type: 'bar', xAxisIndex: 1, yAxisIndex: 1, data: [] },
          { name: '燃料可用性', type: 'bar', xAxisIndex: 2, yAxisIndex: 2, data: [] },
          { name: '安全值', type: 'bar', xAxisIndex: 3, yAxisIndex: 3, data: [] },
          { name: '技术成熟度', type: 'bar', xAxisIndex: 4, yAxisIndex: 4, data: [] }
        ]
      },
      myChart: null,
      map: null,
      reset_btn: null,
      mapLayers: {},
      markerLayers: [],
      infoWindow: null,
      map_config: {
        center: [31.2304, 121.4737], // 上海为中心
        zoom: 6,
        minZoom: 2,
        maxZoom: 16,
      },
      markers: defaultMarkers,
      markers1: [
        {
          id: 1,
          portName: "大连港",
          latitude: 38.9287,
          longitude: 121.6429,
          usageFeePerTon: 20,
          noxEmissionStandard: "IMO Tier III标准",
          soxEmissionStandard: "低于0.10% m/m",
          carbonEmissionStandard: "EEDI",
          lngRefueling: "是",
          chargingFacility: "是",
          hydrogenFuelSupply: "否",
          biodieselSupply: "是",
          biomethanolSupply: "否",
          ammoniaFuelSupply: "否",
          fuelStorageCondition: "良好",
          fuelSupplyChainStability: "稳定",
          fuelStorageCapacity: 5000,
          lngStorageCapacity: 5000,
          chargingStorageCapacity: 3000,
          biodieselStorageCapacity: 4000,
          safetyFacilities: "完善",
          accidentRecords: "无",
          emergencyPlan: "有",
          existingApplicationCases: "LNG内燃机动力系统",
          techRdinvestmentPerYear: 500,
          techTrainingPerYear: 5,
          techSupportCapability: "有",
          maxBerthingCapacity: 10000,
          nextPortDistance: 220,
          draftDepth: "待补充",
          tonnage: "待补充",
          dimensions: "待补充",
          shipType: "待补充"
        },
        {
          id: 2,
          portName: "天津港",
          latitude: 39.0042,
          longitude: 117.7106,
          usageFeePerTon: 20,
          noxEmissionStandard: "IMO Tier III标准",
          soxEmissionStandard: "低于0.10% m/m",
          carbonEmissionStandard: "EEDI",
          lngRefueling: "是",
          chargingFacility: "是",
          hydrogenFuelSupply: "否",
          biodieselSupply: "是",
          biomethanolSupply: "否",
          ammoniaFuelSupply: "否",
          fuelStorageCondition: "良好",
          fuelSupplyChainStability: "稳定",
          fuelStorageCapacity: 5000,
          lngStorageCapacity: 5000,
          chargingStorageCapacity: 3000,
          biodieselStorageCapacity: 4000,
          safetyFacilities: "完善",
          accidentRecords: "无",
          emergencyPlan: "有",
          existingApplicationCases: "LNG内燃机动力系统",
          techRdinvestmentPerYear: 500,
          techTrainingPerYear: 5,
          techSupportCapability: "有",
          maxBerthingCapacity: 10000,
          nextPortDistance: 220,
          draftDepth: "待补充",
          tonnage: "待补充",
          dimensions: "待补充",
          shipType: "待补充"
        },
      ],
      markers2: [
        {
          id: 1,
          portName: "天津港",
          latitude: 39.0042,
          longitude: 117.7106,
          usageFeePerTon: 20,
          noxEmissionStandard: "IMO Tier III标准",
          soxEmissionStandard: "低于0.10% m/m",
          carbonEmissionStandard: "EEDI",
          lngRefueling: "是",
          chargingFacility: "是",
          hydrogenFuelSupply: "否",
          biodieselSupply: "是",
          biomethanolSupply: "否",
          ammoniaFuelSupply: "否",
          fuelStorageCondition: "良好",
          fuelSupplyChainStability: "稳定",
          fuelStorageCapacity: 5000,
          lngStorageCapacity: 5000,
          chargingStorageCapacity: 3000,
          biodieselStorageCapacity: 4000,
          safetyFacilities: "完善",
          accidentRecords: "无",
          emergencyPlan: "有",
          existingApplicationCases: "LNG内燃机动力系统",
          techRdinvestmentPerYear: 500,
          techTrainingPerYear: 5,
          techSupportCapability: "有",
          maxBerthingCapacity: 10000,
          nextPortDistance: 220,
          draftDepth: "待补充",
          tonnage: "待补充",
          dimensions: "待补充",
          shipType: "待补充"
        },
        {
          id: 2,
          portName: "青岛港",
          latitude: 36.0895,
          longitude: 120.3018,
          usageFeePerTon: 20,
          noxEmissionStandard: "IMO Tier III标准",
          soxEmissionStandard: "低于0.10% m/m",
          carbonEmissionStandard: "EEDI",
          lngRefueling: "是",
          chargingFacility: "是",
          hydrogenFuelSupply: "否",
          biodieselSupply: "是",
          biomethanolSupply: "否",
          ammoniaFuelSupply: "否",
          fuelStorageCondition: "良好",
          fuelSupplyChainStability: "稳定",
          fuelStorageCapacity: 5000,
          lngStorageCapacity: 5000,
          chargingStorageCapacity: 3000,
          biodieselStorageCapacity: 4000,
          safetyFacilities: "完善",
          accidentRecords: "无",
          emergencyPlan: "有",
          existingApplicationCases: "LNG内燃机动力系统",
          techRdinvestmentPerYear: 500,
          techTrainingPerYear: 5,
          techSupportCapability: "有",
          maxBerthingCapacity: 10000,
          nextPortDistance: 220,
          draftDepth: "待补充",
          tonnage: "待补充",
          dimensions: "待补充",
          shipType: "待补充"
        },
      ],
      markers3: [
        {
          id: 1,
          portName: "秦皇岛港",
          latitude: 39.9086,
          longitude: 119.5996,
          usageFeePerTon: 20,
          noxEmissionStandard: "IMO Tier III标准",
          soxEmissionStandard: "低于0.10% m/m",
          carbonEmissionStandard: "EEDI",
          lngRefueling: "是",
          chargingFacility: "是",
          hydrogenFuelSupply: "否",
          biodieselSupply: "是",
          biomethanolSupply: "否",
          ammoniaFuelSupply: "否",
          fuelStorageCondition: "良好",
          fuelSupplyChainStability: "稳定",
          fuelStorageCapacity: 5000,
          lngStorageCapacity: 5000,
          chargingStorageCapacity: 3000,
          biodieselStorageCapacity: 4000,
          safetyFacilities: "完善",
          accidentRecords: "无",
          emergencyPlan: "有",
          existingApplicationCases: "LNG内燃机动力系统",
          techRdinvestmentPerYear: 500,
          techTrainingPerYear: 5,
          techSupportCapability: "有",
          maxBerthingCapacity: 10000,
          nextPortDistance: 220,
          draftDepth: "待补充",
          tonnage: "待补充",
          dimensions: "待补充",
          shipType: "待补充"
        },
        {
          id: 2,
          portName: "烟台港",
          latitude: 37.5638,
          longitude: 121.3917,
          usageFeePerTon: 20,
          noxEmissionStandard: "IMO Tier III标准",
          soxEmissionStandard: "低于0.10% m/m",
          carbonEmissionStandard: "EEDI",
          lngRefueling: "是",
          chargingFacility: "是",
          hydrogenFuelSupply: "否",
          biodieselSupply: "是",
          biomethanolSupply: "否",
          ammoniaFuelSupply: "否",
          fuelStorageCondition: "良好",
          fuelSupplyChainStability: "稳定",
          fuelStorageCapacity: 5000,
          lngStorageCapacity: 5000,
          chargingStorageCapacity: 3000,
          biodieselStorageCapacity: 4000,
          safetyFacilities: "完善",
          accidentRecords: "无",
          emergencyPlan: "有",
          existingApplicationCases: "LNG内燃机动力系统",
          techRdinvestmentPerYear: 500,
          techTrainingPerYear: 5,
          techSupportCapability: "有",
          maxBerthingCapacity: 10000,
          nextPortDistance: 220,
          draftDepth: "待补充",
          tonnage: "待补充",
          dimensions: "待补充",
          shipType: "待补充"
        },
      ],
      markers4: [
        {
          id: 1,
          portName: "唐山港",
          latitude: 39.2083,
          longitude: 119.0045,
          usageFeePerTon: 20,
          noxEmissionStandard: "IMO Tier III标准",
          soxEmissionStandard: "低于0.10% m/m",
          carbonEmissionStandard: "EEDI",
          lngRefueling: "是",
          chargingFacility: "是",
          hydrogenFuelSupply: "否",
          biodieselSupply: "是",
          biomethanolSupply: "否",
          ammoniaFuelSupply: "否",
          fuelStorageCondition: "良好",
          fuelSupplyChainStability: "稳定",
          fuelStorageCapacity: 5000,
          lngStorageCapacity: 5000,
          chargingStorageCapacity: 3000,
          biodieselStorageCapacity: 4000,
          safetyFacilities: "完善",
          accidentRecords: "无",
          emergencyPlan: "有",
          existingApplicationCases: "LNG内燃机动力系统",
          techRdinvestmentPerYear: 500,
          techTrainingPerYear: 5,
          techSupportCapability: "有",
          maxBerthingCapacity: 10000,
          nextPortDistance: 220,
          draftDepth: "待补充",
          tonnage: "待补充",
          dimensions: "待补充",
          shipType: "待补充"
        },
        {
          id: 2,
          portName: "青岛港",
          latitude: 36.0895,
          longitude: 120.3018,
          usageFeePerTon: 20,
          noxEmissionStandard: "IMO Tier III标准",
          soxEmissionStandard: "低于0.10% m/m",
          carbonEmissionStandard: "EEDI",
          lngRefueling: "是",
          chargingFacility: "是",
          hydrogenFuelSupply: "否",
          biodieselSupply: "是",
          biomethanolSupply: "否",
          ammoniaFuelSupply: "否",
          fuelStorageCondition: "良好",
          fuelSupplyChainStability: "稳定",
          fuelStorageCapacity: 5000,
          lngStorageCapacity: 5000,
          chargingStorageCapacity: 3000,
          biodieselStorageCapacity: 4000,
          safetyFacilities: "完善",
          accidentRecords: "无",
          emergencyPlan: "有",
          existingApplicationCases: "LNG内燃机动力系统",
          techRdinvestmentPerYear: 500,
          techTrainingPerYear: 5,
          techSupportCapability: "有",
          maxBerthingCapacity: 10000,
          nextPortDistance: 220,
          draftDepth: "待补充",
          tonnage: "待补充",
          dimensions: "待补充",
          shipType: "待补充"
        },
      ],
      markers5: [
        {
          id: 1,
          portName: "烟台港",
          latitude: 37.5638,
          longitude: 121.3917,
          usageFeePerTon: 20,
          noxEmissionStandard: "IMO Tier III标准",
          soxEmissionStandard: "低于0.10% m/m",
          carbonEmissionStandard: "EEDI",
          lngRefueling: "是",
          chargingFacility: "是",
          hydrogenFuelSupply: "否",
          biodieselSupply: "是",
          biomethanolSupply: "否",
          ammoniaFuelSupply: "否",
          fuelStorageCondition: "良好",
          fuelSupplyChainStability: "稳定",
          fuelStorageCapacity: 5000,
          lngStorageCapacity: 5000,
          chargingStorageCapacity: 3000,
          biodieselStorageCapacity: 4000,
          safetyFacilities: "完善",
          accidentRecords: "无",
          emergencyPlan: "有",
          existingApplicationCases: "LNG内燃机动力系统",
          techRdinvestmentPerYear: 500,
          techTrainingPerYear: 5,
          techSupportCapability: "有",
          maxBerthingCapacity: 10000,
          nextPortDistance: 220,
          draftDepth: "待补充",
          tonnage: "待补充",
          dimensions: "待补充",
          shipType: "待补充"
        },
        {
          id: 2,
          portName: "大连港",
          latitude: 38.9287,
          longitude: 121.6429,
          usageFeePerTon: 20,
          noxEmissionStandard: "IMO Tier III标准",
          soxEmissionStandard: "低于0.10% m/m",
          carbonEmissionStandard: "EEDI",
          lngRefueling: "是",
          chargingFacility: "是",
          hydrogenFuelSupply: "否",
          biodieselSupply: "是",
          biomethanolSupply: "否",
          ammoniaFuelSupply: "否",
          fuelStorageCondition: "良好",
          fuelSupplyChainStability: "稳定",
          fuelStorageCapacity: 5000,
          lngStorageCapacity: 5000,
          chargingStorageCapacity: 3000,
          biodieselStorageCapacity: 4000,
          safetyFacilities: "完善",
          accidentRecords: "无",
          emergencyPlan: "有",
          existingApplicationCases: "LNG内燃机动力系统",
          techRdinvestmentPerYear: 500,
          techTrainingPerYear: 5,
          techSupportCapability: "有",
          maxBerthingCapacity: 10000,
          nextPortDistance: 220,
          draftDepth: "待补充",
          tonnage: "待补充",
          dimensions: "待补充",
          shipType: "待补充"
        },
      ],
      show: false,
      center_lng: 116.404,
      center_lat: 39.915,
      window_lng: 0,
      window_lat: 0,
      window_ShipID: '',
      fuel_provide: '',
      fuel_storage: 0,
      maxBerthingCapacity: 0,
      lngStorageCapacity: null,
      chargingStorageCapacity: null,
      hydrogenStorageCapacity: null,
      biodieselStorageCapacity: null,
      biomethanolStorageCapacity: null,
      ammoniaStorageCapacity: null,
      draftDepth: "待补充",
      tonnage: "待补充",
      dimensions: "待补充",
      shipType: "待补充"
    };
  },
  methods: {
    showTitle(item) {
      return showTitle(item, this)
    },
    Oncancel() {
      this.result = false;
    },
    valueFormatter(value) {
      return Math.abs(value) >= 10000 ? value.toExponential() : value;
    },
    selectRoute() {
      switch (this.route) {
        case '0':
          this.markers = defaultMarkers;
          break;
        case '1':
          this.markers = this.markers1;
          break;
        case '2':
          this.markers = this.markers2;
          break;
        case '3':
          this.markers = this.markers3;
          break;
        case '4':
          this.markers = this.markers4;
          break;
        case '5':
          this.markers = this.markers5;
          break;
        default:
          break;
      }
      this.addMarkers();
    },
    async showResult() {

      try {
        this.result = true;
        const url = `/bcd/evaluation/traversing`;
        console.log('选择的航线', this.route);

        let segment = '';
        switch (this.route) {
          case '1':
            segment = '大连-天津'
            break;
          case '2':
            segment = '天津-青岛'
            break;
          case '3':
            segment = '秦皇岛-烟台'
            break;
          case '4':
            segment = '唐山-青岛'
            break;
          case '5':
            segment = '烟台-大连'
            break;
          default:
            break;
        }
        await this.$axios({
          url: `/bcd/evaluation/parameter`,
          method: "post",
          data: {
            waterArea: this.route === '0' ? '内河' : '沿海', // 动态切换水域
            shipType: '散货船',
            shipTonnage: 2500,
            deadWeightTonnage: 3000,
            waterSystem: this.route === '0' ? '长江水系' : '环渤海水系', // 动态切换水系
            ecaRegion: "国内",
            minSpeedRequirement: '低速',
            segment: this.route === '0' ? '长江下游' : segment // 动态切换航段
          }
        });
        // const res = JSON.parse(localStorage.getItem('mapResult')) || await this.queryData(url);
        const res = await this.queryData(url);
        // localStorage.setItem('mapResult', JSON.stringify(res))
        // 保存原始数据
        this.rawData = res.data;
        this.loading = false;

        // 初始化所有x轴数据
        for (let i = 0; i < 5; i++) {
          this.option.xAxis[i].data = res.data.map(item => item.model);
        }

        // 更新所有系列数据
        this.updateChartData();

        this.$nextTick(() => {
          this.initChart();
        });
      } catch (error) {
        console.error('获取数据失败:', error);
      }
    },

    initChart() {
      const chartDom = document.getElementById('result');
      this.myChart = this.$echarts.init(chartDom);
      this.myChart.setOption(this.option);

      // 窗口大小变化时重绘
      window.addEventListener('resize', this.handleResize);
    },
    // 更新图表数据 - 为每个参数设置数据
    updateChartData() {
      const paramMap = [
        { key: 'economicValue', name: '经济价值' },
        { key: 'emissionValue', name: '排放值' },
        { key: 'fuelAvailabilityValue', name: '燃料可用性' },
        { key: 'safetyValue', name: '安全值' },
        { key: 'technologyMaturityValue', name: '技术成熟度' }
      ];

      this.option.series = paramMap.map((param, index) => {
        return {
          name: param.name,
          type: 'bar',
          xAxisIndex: index,
          yAxisIndex: index,
          data: this.rawData.map(item => item[param.key])
        };
      });

      if (this.myChart) {
        this.myChart.setOption(this.option);
      }
    },

    handleResize() {
      if (this.myChart) {
        this.myChart.resize();
      }
    },

    beforeUnmount() {
      // 移除事件监听
      window.removeEventListener('resize', this.handleResize);
      if (this.myChart) {
        this.myChart.dispose();
      }
    },
    onMouseOver(portName,
      longitude,
      latitude,
      fuelStorageCapacity,
      maxBerthingCapacity,
      lngRefueling,
      chargingFacility,
      hydrogenFuelSupply,
      biodieselSupply,
      biomethanolSupply,
      ammoniaFuelSupply,
      lngStorageCapacity,
      chargingStorageCapacity,
      hydrogenStorageCapacity,
      biodieselStorageCapacity,
      biomethanolStorageCapacity,
      ammoniaStorageCapacity,
      draftDepth,
      tonnage,
      dimensions,
      shipType
    ) {
      this.window_ShipID = portName;
      this.window_lng = longitude;
      this.window_lat = latitude;
      this.fuel_provide = '提供' + [
        lngRefueling === '是' ? 'LNG' : null,
        chargingFacility === '是' ? '充电加注' : null,
        hydrogenFuelSupply === '是' ? '氢燃料' : null,
        biodieselSupply === '是' ? '生物柴油' : null,
        biomethanolSupply === '是' ? '生物甲醇' : null,
        ammoniaFuelSupply === '是' ? '氨燃料' : null
      ]
        .filter(Boolean) // 过滤掉 null/undefined
        .join('、') + '加注服务';
      this.lngStorageCapacity = lngStorageCapacity;
      this.chargingStorageCapacity = chargingStorageCapacity;
      this.hydrogenStorageCapacity = hydrogenStorageCapacity;
      this.biodieselStorageCapacity = biodieselStorageCapacity;
      this.biomethanolStorageCapacity = biomethanolStorageCapacity;
      this.ammoniaStorageCapacity = ammoniaStorageCapacity;
      this.fuel_storage = fuelStorageCapacity;
      this.maxBerthingCapacity = maxBerthingCapacity;
      this.draftDepth = draftDepth;
      this.tonnage = tonnage;
      this.dimensions = dimensions;
      this.shipType = shipType;
      this.show = true;

      // 显示信息窗口
      if (this.infoWindow) {
        this.map.removeLayer(this.infoWindow);
      }

      this.infoWindow = L.popup({
        maxWidth: 500  // 单位像素，这是Leaflet的推荐方式
      })
        .setLatLng([latitude, longitude])
        .setContent(`
        <div style="
          min-width: 500px;
          font-family: Arial, sans-serif;
          font-size: 14px;
        ">
          <h3 style="margin: 0 0 12px 0; text-align: center;">${portName}</h3>
          
          <div style="
            display: grid;
            grid-template-columns: auto 1fr auto 1fr;
            gap: 6px 12px;
            align-items: baseline;
          ">
            <!-- 第一组属性 -->
            <div style="font-weight: bold; text-align: right;">水域：</div>
            <div>长江流域内河</div>
            
            <div style="font-weight: bold; text-align: right;">坐标：</div>
            <div>${latitude.toFixed(4)}, ${longitude.toFixed(4)}</div>
            
            <!-- 第二组属性 -->
            <div style="font-weight: bold; text-align: right;">燃料加注：</div>
            <div>${this.fuel_provide}</div>
            
            <div style="font-weight: bold; text-align: right;">最大靠泊：</div>
            <div>${this.maxBerthingCapacity || '无'}吨</div>
            
            <!-- 第三组属性 -->
            <div style="font-weight: bold; text-align: right;">LNG库存：</div>
            <div>${this.lngStorageCapacity || '无'}吨</div>
            
            <div style="font-weight: bold; text-align: right;">充电库存：</div>
            <div>${this.chargingStorageCapacity || '无'}kWh</div>
            
            <!-- 第四组属性 -->
            <div style="font-weight: bold; text-align: right;">氢燃料：</div>
            <div>${this.hydrogenStorageCapacity || '无'}kg</div>
            
            <div style="font-weight: bold; text-align: right;">生物柴油：</div>
            <div>${this.biodieselStorageCapacity || '无'}吨</div>
            
            <!-- 第五组属性 -->
            <div style="font-weight: bold; text-align: right;">生物甲醇：</div>
            <div>${this.biomethanolStorageCapacity || '无'}吨</div>
            
            <div style="font-weight: bold; text-align: right;">氨燃料：</div>
            <div>${this.ammoniaStorageCapacity || '无'}吨</div>
            
            <!-- 第六组属性 -->
            <div style="font-weight: bold; text-align: right;">吃水深度：</div>
            <div>${this.draftDepth}</div>
            
            <div style="font-weight: bold; text-align: right;">吨位要求：</div>
            <div>${this.tonnage}</div>
            
            <!-- 第七组属性 -->
            <div style="font-weight: bold; text-align: right;">尺寸要求：</div>
            <div>${this.dimensions}</div>
            
            <div style="font-weight: bold; text-align: right;">船型要求：</div>
            <div>${this.shipType}</div>
          </div>
          
          <!-- 底部排放要求 -->
          <div style="
            margin-top: 12px;
            padding-top: 8px;
            border-top: 1px solid #eee;
            grid-column: 1 / span 4;
          ">
            <div style="text-align: center;">
              <strong>排放标准：</strong> 
              NOₓ(IMO Tier III) | 
              SOₓ(<0.10% m/m) | 
              CO₂(EEDI)
            </div>
          </div>
        </div>
        `)
        .openOn(this.map);
    },
    initMap() {
      var seaUrl = "http://tiles.openseamap.org/seamark/{z}/{x}/{y}.png";
      var osmUrl = "http://{s}.tile.openstreetmap.jp/{z}/{x}/{y}.png";
      var sea = L.tileLayer(seaUrl, { subdomains: ["a", "b", "c"] });
      var OpenStreetMap = L.tileLayer(osmUrl, { subdomains: ["a", "b", "c"] });

      var baseLayers = {
        OpenStreetMap: OpenStreetMap,
      };

      this.map = L.map("leaflet-map", {
        zoomControl: false,
        center: this.map_config.center,
        zoom: this.map_config.zoom,
        minZoom: this.map_config.minZoom,
        maxZoom: this.map_config.maxZoom,
        layers: [OpenStreetMap],
      });

      L.control.zoom({ position: "topright", }).addTo(this.map);

      this.map.on("zoomend", () => {
        if (this.reset_btn && this.map.getZoom() !== this.map_config.zoom) {
          this.reset_btn.enable();
        }
      });

      L.control.layers(baseLayers, null, { position: "bottomright" }).addTo(this.map);

      sea.addTo(this.map);
    },
    addMarkers() {
      // 清除现有标记
      this.markerLayers.forEach(marker => this.map.removeLayer(marker));
      this.markerLayers = [];

      // 为每个港口数据创建标记
      this.markers.forEach(marker => {
        // 创建标记
        const m = L.marker([marker.latitude, marker.longitude], {
          title: marker.portName,
        }).addTo(this.map);

        // 绑定鼠标悬停事件
        m.on('mouseover', () => {
          this.onMouseOver(
            marker.portName,
            marker.longitude,
            marker.latitude,
            marker.fuelStorageCapacity,
            marker.maxBerthingCapacity,
            marker.lngRefueling,
            marker.chargingFacility,
            marker.hydrogenFuelSupply,
            marker.biodieselSupply,
            marker.biomethanolSupply,
            marker.ammoniaFuelSupply,
            marker.lngStorageCapacity,
            marker.chargingStorageCapacity,
            marker.hydrogenStorageCapacity,
            marker.biodieselStorageCapacity,
            marker.biomethanolStorageCapacity,
            marker.ammoniaStorageCapacity,
            marker.draftDepth,
            marker.tonnage,
            marker.dimensions,
            marker.shipType
          );
        });

        // 绑定鼠标移出事件
        m.on('mouseout', this.onMouseOut);

        // 绑定点击事件（可选）
        m.on('click', () => {
          this.map.setView([marker.latitude, marker.longitude], 12);
        });

        // 将标记添加到标记图层数组
        this.markerLayers.push(m);
      });

      // 添加折线连接所有港口（可选）
      if (this.path && this.path.length > 1) {
        const polyline = L.polyline(
          this.path.map(p => [p.lat, p.lng]),
          {
            color: '#1890ff',
            weight: 3,
            opacity: 0.8
          }
        ).addTo(this.map);
        this.markerLayers.push(polyline);
      }
    },
    async queryData(url) {
      return axios.get(url);
    },
  }
}
</script>
<style>
.bm-view {
  width: 100%;
  height: 100%;
}

.map {
  height: 700px;
  margin-left: 1%;
}

.mtitle {
  margin-left: 30px;
}

.div1 {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.div2 {
  display: flex;
  align-items: center;
  margin-top: -40px;
  margin-left: 80px;
  margin-right: 20px;
}

#leaflet-map {
  position: absolute;
  width: 98%;
  height: 700px;
}
</style>
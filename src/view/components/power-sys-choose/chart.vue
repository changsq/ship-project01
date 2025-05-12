<template>
  <a-modal :visible="visible" :width="1100" @cancel="Oncancel">
    <template #title>
      <span class="modal-title">{{ text }}</span>
    </template>
    <div v-if="updateData || scheme.length > 0">上次更新时间：{{ updateTime }}</div>
    <div v-if="updateData && !(scheme.length > 0)">数据更新中，请稍后...</div>
    <a-card style="width: 90%; margin: auto; background-color: #fbfbfb;">
      <a-form v-if="dataSourceComputed && dataSourceComputed.length > 0">
        <a-table :columns="columns" :dataSource="dataSourceComputed"></a-table>
      </a-form>
      <div v-else>
        <div>评估中，请稍后...</div>
        <a-progress :percent="percentage" />
      </div>
    </a-card>
    <template slot="footer">
      <a-button v-show="false" key="back">取消</a-button>
      <a-button v-show="false" key="submit" type="primary">确定</a-button>
    </template>
  </a-modal>
</template>

<script>

export default {
  props: {
    scheme: Array,
    whichButton: Number,
  },
  computed: {
    dataSourceComputed() {
      return this.scheme.length > 0 ? this.scheme : this.datastorage;
    }
  },
  data() {
    return {
      visible: false,
      data: [],
      datastorage: {},
      updateTime: '',
      text: '',
      updateData:true,
      percentage: 0,
      timer: null,
      columns: [
        { title: '动力装置型号', dataIndex: 'powerUnitModel', key: '0', width: '25%', align: 'center' },
        { title: '动力系统', dataIndex: 'powerSystem', key: '1', width: '25%', align: 'center' },
        { title: '动力系统种类', dataIndex: 'powerType', key: '2', width: '25%', align: 'center' },
        { title: '燃料种类', dataIndex: 'fuelType', key: '3', width: '25%', align: 'center' }
    ]
    }
  },
  mounted() {
  },
  methods: {

    show() {
      this.$nextTick(() => {
        const scheme1 = JSON.parse(localStorage.getItem('scheme1'))
        const scheme2 = JSON.parse(localStorage.getItem('scheme2'))
        const updateTime1 = localStorage.getItem('updateTime1')
        const updateTime2 = localStorage.getItem('updateTime2')

        if (updateTime1 && this.whichButton === 1) {
          this.updateTime = updateTime1
        }
        else if (updateTime2 && this.whichButton === 2) {
          this.updateTime = updateTime2
        } else {
          this.updateTime = ''
        }

        if (scheme1 && this.whichButton === 1) {
          this.datastorage = scheme1
          this.updateData = true
        }
        else if (scheme2 && this.whichButton === 2) {
          this.datastorage = scheme2
          this.updateData = true
        } else {
          this.datastorage = {}
          this.updateData = false
        }
        console.log('ssss1', this.datastorage,this.updateData,this.scheme);
        this.visible = true
        this.updateTextBasedOnButton();
      });
    },

    Oncancel() {
      this.visible = false
      clearInterval(this.timer);
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
        this.percentage += 5;
      } else {
        clearInterval(this.timer); // 清除定时器
      }
    },
    updateTextBasedOnButton() {
      switch (this.whichButton) {
        case 0:
          this.text = '生成方案'
          break;
        case 1:
          this.text = '适用性评估结果'
          break;
        case 2:
          this.text = '优化评估结果'
          break;
        default:
          break;
      }
    },
  }
}
</script>

<style scoped></style>

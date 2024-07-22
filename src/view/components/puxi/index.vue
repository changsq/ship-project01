<template>
  <content>
    <Route ref="route"></Route>
    <Chart ref="chart"></Chart>
    <div class="div1">
      <a-select class="select1" size="large" placeholder="选择文件"></a-select>
      <a-button style="margin-left: 20px; text-align: center;" type="primary">浏览本地文件</a-button>
    </div>
    <div class="div1">
      <a-button style="text-align: center;" type="primary">谱系化</a-button>
      <a-button style="margin-left: 60px; text-align: center;" type="primary" @click="showRoute">发展路线</a-button>
      <a-button style="margin-left: 60px; text-align: center;" type="primary" @click="showChart">查看表格</a-button>
    </div>
    <div class="div2">
      <div style="font-size: medium; font-weight: bold;">进度：</div>
      <a-progress :percent="30" style="width: 60%; margin: 20px 50px;"/>
    </div>
    <div class="div1">
      <a-card title="结果" style="width: 70%">
        <img
          slot="cover"
          alt="example"
          src="@/assets/images/puxi.jpg"
          class="card-image"
        />
      </a-card>
    </div>
  </content>
</template>

<script>
import Chart from './chart.vue';
import Route from './route.vue';

export default {
  name: 'puxi',
  components:{
    Chart,
    Route
  },

  methods: {
    showRoute(){
      this.$refs.route.show();
    },
    showChart(){
      this.$refs.chart.show();
    },
  }
};
</script>

<style scoped>
.div1 {
  margin-top: 30px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

.div2 {
  display: flex;
  width: 70%;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  border: 1px solid #c2c0c0;
  background: white;
  margin-left: auto;
  margin-right: auto;
}

.select1 {
  width: 50%!important;
  height: 40px !important;
  line-height: 40px !important;
  font-size: 16px !important;
}

.error {
  color: red;
  margin-top: 5px;
}
.card-image{
  max-width: 100%; 
  height: auto;
  object-fit: cover; 
}
</style>
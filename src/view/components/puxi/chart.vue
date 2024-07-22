<template>
  <a-modal
    :visible="visible"
    :width="1100"
    @cancel="Oncancel"
  >
    <template #title>
      <span class="modal-title">查看表格</span>
    </template>  
    <a-card style="width: 90%; margin: auto; background-color: #fbfbfb;">
      <a-form>
        <a-table :columns="columns" :dataSource="data" ></a-table>
      </a-form>
    </a-card>

    <template slot="footer">
      <a-button v-show="false" key="back">取消</a-button>
      <a-button v-show="false" key="submit" type="primary">确定</a-button>
    </template>
  </a-modal>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      data: [],
      columns: [
        { title: '发动机', dataIndex: 'powerUnit', key: 'powerUnit',width: '25%',align: 'center'},
        { title: '螺旋桨', dataIndex: 'gearbox', key: 'gearbox',width: '25%',align: 'center' },
        { title: '齿轮箱', dataIndex: 'shafting', key: 'shafting',width: '25%' ,align: 'center'},
        { title: '轴系', dataIndex: 'propeller', key: 'propeller',width: '25%' ,align: 'center'},
      ]
    }
  },
  methods: {
   
    show() {
      this.visible = true;
    },
    
    Oncancel(){
      this.visible=false
    },

  }
}
</script>

<style scoped>

</style>
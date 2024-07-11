<template>
  <div>
    <a-form :model="form" @submit="handleSubmit" class="div1">
      <a-form-item label="动力装置" class="div2">
        <a-select size="large" class="select1"></a-select>
      </a-form-item>
      <a-form-item label="齿轮箱" class="div2">
        <a-select size="large" class="select1"></a-select>
      </a-form-item>
      <a-form-item label="轴系" class="div2">
        <a-select size="large" class="select1"></a-select>
      </a-form-item>
      <a-form-item label="螺旋桨" class="div2">
        <a-select size="large" class="select1"></a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">添加</a-button>
      </a-form-item>
      <a-form-item style="margin-left: 20px;">
        <a-button type="primary" html-type="reset">清空</a-button>
      </a-form-item>
    </a-form>
    <a-table :columns="columns" :dataSource="data" rowKey="id" />
  </div>
</template>

<script>
export default {
  name: 'power_sys_test',
  data () {
    return {
      form: {
        powerUnit: '',
        gearbox: '',
        shafting: '',
        propeller: ''
      },
      data: [],
      columns: [
        { title: '动力装置', dataIndex: 'powerUnit', key: 'powerUnit' },
        { title: '齿轮箱', dataIndex: 'gearbox', key: 'aggearboxe' },
        { title: '轴系', dataIndex: 'shafting', key: 'shafting' },
        { title: '螺旋桨', dataIndex: 'propeller', key: 'propeller' }
      ]
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.data.push({
        id: Date.now(),
        powerUnit: this.form.powerUnit,
        gearbox: this.form.gearbox,
        shafting: this.form.shafting,
        propeller: this.form.propeller
      });
      // 清空表单
      this.form.powerUnit = '';
      this.form.gearbox = '';
      this.form.shafting = '';
      this.form.propeller = '';
    }
  }
}
</script>

<style>
  .div1{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  .div2{
    display: flex;
    align-items: center;
    margin-left: 50px;
    margin-right: 20px;
  }
  .select1{
    width: 220px !important;
    height: 40px !important;
    line-height: 40px !important; /* 使文本垂直居中 */
    font-size: 16px !important;
  }
</style>

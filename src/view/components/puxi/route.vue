<template>
  <a-modal
    :visible="visible"
    :width="1100"
    @cancel="Oncancel"
  >
    <template #title>
      <span class="modal-title">发展路线</span>
    </template>
    <a-card style="width: 90%; margin: auto; background-color: #fbfbfb;">
      <img class="route-image" src="@/assets/images/route.jpg">
    </a-card>
    <template slot="footer">
      <a-button  key="check">查看大图</a-button>
      <a-button  key="save" type="primary">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
    }
  },
  methods: {
    show() {
      this.visible = true;
    },
    Oncancel(){
      this.visible = false
    }
  }
}
</script>

<style scoped>

.route-image{
  max-width: 100%; 
  height: auto;
  object-fit: cover; 
}

</style>
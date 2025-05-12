<template>
  <div class="user-avatar-dropdown">
    <Dropdown @on-click="handleClick">
      <Badge>
        <Avatar :src="userAvatar"/>
        <!-- <a style="color: white;">{{ userAvatar }}</a> -->
      </Badge>
      <Icon :size="18" color="white" type="ios-arrow-down"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
export default {
  name: 'User',
  props: {
    userAvatar: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      // this.handleLogOut().then(() => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('id');
        this.$router.push({
          name: 'login'
        // })
      })
    },
    message () {
      this.$router.push({
        name: 'message_page'
      })
    },
    handleClick (name) {
      switch (name) {
        case 'logout': this.logout()
          break
        case 'message': this.message()
          break
      }
    }
  }
}
</script>

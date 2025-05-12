<template>
  <div class="user-avatar-dropdown">
    <Dropdown @on-click="handleClick">
      <Badge>
        <Avatar :src="userAvatar"/>
      </Badge>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import Login from '../../../../view/login/login.vue'
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
    handleClick () {
      this.logout()
      }
    }
  }
</script>

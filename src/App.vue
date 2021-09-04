<template>
  <a-layout id="layout" style="height: 100%">
    <a-layout-sider>
      <div class="logo">党务管理系统</div>
      <a-menu theme="dark" mode="inline" :default-selected-keys="['Overview']" @click="Route">
        <a-menu-item key="information">
          <a-icon type="user" />
          <span>党支部信息管理</span>
        </a-menu-item>
        <a-menu-item key="Member">
          <a-icon type="user" />
          <span>党支部成员管理</span>
        </a-menu-item>
        <a-menu-item key="Resvercation">
          <a-icon type="user" />
          <span>党支部活动管理</span>
        </a-menu-item>
        <a-menu-item key="Developement">
          <a-icon type="user" />
          <span>党支部发展管理</span>
        </a-menu-item>
        <a-menu-item key="StudyInfo">
          <a-icon type="search" />
          <span>网上学习管理</span>
        </a-menu-item>
        <a-menu-item key="Bill">
          <a-icon type="search" />
          <span>党费管理</span>
        </a-menu-item>
        <a-menu-item key="Document">
          <a-icon type="search" />
          <span>文档管理</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <a-layout-content
        :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }"
        >
        <router-view></router-view>
      </a-layout-content>
    </a-layout>

  </a-layout>
</template>

<script>
export default {
  mounted() {
    this.$router.push({
      path: `/information`,
    })
  },
  methods: {
    Route(item) {
      this.$router.push({
        path: `/${item.key}`
      })
    },
  },
  data() {
    return {
      current: ['information']
    }
  }
}
</script>

<style>
.logo {
  font-size: 24px;
  color: #fff;
  text-align: center;
}

#layout .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>

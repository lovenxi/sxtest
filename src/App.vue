<template>
  <a-layout id="layout" style="height: 100%">
    <a-layout-sider>
      <div class="logo">行程预订系统</div>
      <a-menu theme="dark" mode="inline" :default-selected-keys="['Overview']" @click="Route">
        <a-menu-item key="Overview">
          <a-icon type="unordered-list" />
          <span>总览</span>
        </a-menu-item>
        <a-menu-item key="Customers">
          <a-icon type="user" />
          <span>用户列表</span>
        </a-menu-item>
        <a-menu-item key="Resvercation">
          <a-icon type="search" />
          <span>预订查询</span>
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
      path: `/Overview`,
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
      current: ['Overview']
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

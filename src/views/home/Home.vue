<template>
  <div id="home">
    <h1>首页</h1>
    <el-button type="info" @click="logout">退出登录</el-button>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods: {
    logout() {
      window.sessionStorage.removeItem("token");
      this.$router.push("/login");
    },
  },
};
</script>

<style lang='less' scoped>
</style>
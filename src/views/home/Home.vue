<template>
  <el-container class="home_container">
    <el-header>
      <div>
        <img src="~assets/img/heima.png" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出登录</el-button>
    </el-header>

    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="collapseBtn" @click="isCollapse = !isCollapse">|||</div>
        <el-menu
          :default-active="$route.path"
          background-color="#323743"
          text-color="#fff"
          active-text-color="#3f9ffe"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
        >
          <el-submenu
            :index="submenu.id + ''"
            v-for="(submenu, index) in menus"
            :key="submenu.id"
          >
            <template slot="title">
              <i :class="iconfonts[index]"></i>
              <span>{{ submenu.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + menuItem.path"
              v-for="menuItem in submenu.children"
              :key="menuItem.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ menuItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getMenus } from "network/home.js";

export default {
  name: "Home",
  data() {
    return {
      menus: [],
      iconfonts: {
        0: "iconfont icon-user",
        1: "iconfont icon-tijikongjian",
        2: "iconfont icon-shangpin",
        3: "iconfont icon-danju",
        4: "iconfont icon-baobiao",
      },
      isCollapse: false,
    };
  },
  created() {
    this._getMenus();
  },
  methods: {
    logout() {
      window.sessionStorage.removeItem("token");
      this.$router.push("/login");
    },
    _getMenus() {
      getMenus().then((res) => {
        this.menus = res.data;
      });
    },
  },
};
</script>

<style lang='less' scoped>
.home_container {
  height: 100vh;
}
.el-header {
  background-color: #373d3f;
  padding-left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 20px;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #323743;
  transition: all 0.5s;
  .collapseBtn {
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 2px;
    color: #fff;
    cursor: pointer;
    background-color: #485162;
  }
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #e9edf0;
}
.iconfont {
  margin-right: 10px;
}
</style>
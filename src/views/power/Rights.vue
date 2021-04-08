<template>
  <div id="rights">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="scoped">
            <el-tag v-if="scoped.row.level === '0'">一级</el-tag>
            <el-tag v-else-if="scoped.row.level === '1'" type="success"
              >二级</el-tag
            >
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRightsList } from "network/rights";

export default {
  name: "Rights",
  data() {
    return {
      rightsList: null,
    };
  },
  created() {
    this._getRightsList();
  },
  methods: {
    async _getRightsList() {
      const res = await getRightsList();
      if (res.meta.status !== 200)
        return this.$message.error("权限列表获取失败");
      this.rightsList = res.data;
    },
  },
};
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 20px;
  font-size: 12px;
}
</style>
<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" class="addrolesBtn" @click="addRole"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', 'vcenter', index == 0 ? 'bdtop' : '']"
              v-for="(item, index) in scope.row.children"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item.id)">{{
                  item.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="['vcenter', index2 == 0 ? '' : 'bdtop']"
                  v-for="(item2, index2) in item.children"
                >
                  <!-- 渲染二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      type="success"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      type="warning"
                      v-for="item3 in item2.children"
                      >{{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightsDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加用户区域 -->
      <el-dialog
        title="添加角色"
        :visible.sync="dialogVisible"
        width="50%"
        @close="dialogClose"
      >
        <el-form
          :model="addRoleForm"
          :rules="addRoleRules"
          ref="addRoleFormRef"
          label-width="auto"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="determine">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        ref="treeRef"
        :data="rightsList"
        :props="TreeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotrights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRolesList,
  addRole,
  removeRight,
  getTreeRightsList,
  allotRights,
} from "network/rights";

export default {
  name: "Roles",
  data() {
    return {
      rolesList: [],
      addRoleForm: {
        roleName: "",
        roleDesc: "",
      },
      addRoleRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [{ required: true, message: "请输入描述", trigger: "blur" }],
      },
      rightsList: null,
      dialogVisible: false,
      setRightDialogVisible: false,
      TreeProps: {
        label: "authName",
        children: "children",
      },
      defKeys: [], //默认勾选keys的数组
      roleId: null, //分配权限的roleId
    };
  },
  created() {
    this._getRolesList();
  },
  methods: {
    //获取角色列表
    async _getRolesList() {
      const res = await getRolesList();
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败");
      this.rolesList = res.data;
    },

    //根据ID删除权限
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") return this.$message.info("取消了删除");
      const removeRes = await removeRight(role.id, rightId);
      if (removeRes.meta.status !== 200)
        return this.$message.info("删除权限失败");
      this.$message.success("删除权限成功");
      role.children = removeRes.data;
    },

    // 分配权限
    async showSetRightsDialog(role) {
      this.roleId = role.id;
      const res = await getTreeRightsList();
      if (res.meta.status !== 200)
        return this.$message.info("获取权限列表失败");
      // 把获取到的权限数据保存到data中
      this.rightsList = res.data;
      //递归获取三级节点的id
      this.getLeafLeys(role, this.defKeys);
      this.setRightDialogVisible = true;
    },
    //通过递归形式，获取角色下所有三级权限的id,并保存到 defKeys 数组中
    getLeafLeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }

      node.children.forEach((item) => {
        this.getLeafLeys(item, arr);
      });
    },
    //关闭分配权限dialog时,清空id数组
    setRightDialogClosed() {
      this.defKeys = [];
    },
    //dallog点击确定分配权限
    async allotrights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");
      const res = await allotRights(this.roleId, idStr);
      if (res.meta.status !== 200) return this.$message.error("分配权限失败");
      this.$message.success("分配权限成功");
      this._getRolesList();
      this.setRightDialogVisible = false;
    },
    //关闭表单重置列表
    dialogClose() {
      //   alert();
    },
    //添加角色按钮点击
    addRole() {
      this.dialogVisible = true;
    },
    //添加角色
    async determine() {
      const res = await addRole(this.addRoleForm);
      if (res.meta.status !== 201) this.$message.error("添加角色失败");
      this._getRolesList();
      this.$message.success("添加角色成功");
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 20px;
  font-size: 12px;
}
.addrolesBtn {
  margin-bottom: 20px;
}
.el-tag {
  margin: 7px;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.bdtop {
  border-top: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
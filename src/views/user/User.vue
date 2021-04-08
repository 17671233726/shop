<template>
  <div class="user">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="_getUsers"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="_getUsers"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = !dialogVisible"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="userList" border stripe>
        <el-table-column label="#" type="index" />
        <el-table-column label="姓名" prop="username" />
        <el-table-column label="邮箱" prop="email" />
        <el-table-column label="电话" prop="mobile" />
        <el-table-column label="角色" prop="role_name" />
        <el-table-column label="状态" prop="mg_state">
          <template v-slot="scoped">
            <el-switch
              v-model="scoped.row.mg_state"
              @change="userStateChange(scoped.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template v-slot="scoped">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editUser(userList[scoped.$index])"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUser(scoped.row.id)"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="handleSetRole(scoped.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="dialogClose"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model.number="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="determine">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改用户"
      :visible.sync="editDialog"
      width="50%"
      @close="editDialogClose"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoledialogVisible"
      width="50%"
      @close="setRoledialogClose"
    >
      <div>
        <p>当前的用户: {{ userInfo.username }}</p>
        <p>当前的角色: {{ userInfo.role_name }}</p>
        <p>
          分配新角色
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoledialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="savaRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUsers,
  changeUserState,
  addUser,
  editUserInfo,
  removeUser,
  getRolesList,
  setUserRole,
} from "network/user.js";

export default {
  name: "User",
  data() {
    var validateEmail = (rule, value, callback) => {
      let arg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if (arg.test(value)) return callback();
      callback(new Error("邮箱格式不正确"));
    };
    var validateMobile = (rule, value, callback) => {
      let arg = /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/;
      if (arg.test(value)) return callback();
      callback(new Error("手机号格式不正确"));
    };
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: 0,
      dialogVisible: false,
      editDialog: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      editForm: {
        username: "",
        email: "",
        mobile: "",
      },
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 16, message: "长度在 6 到 16个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: validateEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机" },
          { validator: validateMobile, trigger: "blur" },
        ],
      },
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: validateEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机" },
          { validator: validateMobile, trigger: "blur" },
        ],
      },
      setRoledialogVisible: false,
      userInfo: {},
      rolesList: [],
      selectRoleId: "",
    };
  },
  created() {
    this._getUsers();
  },
  methods: {
    _getUsers() {
      getUsers(this.queryInfo).then((res) => {
        this.userList = res.data.users;
        this.total = res.data.total;
      });
    },
    handleSizeChange(size) {
      this.queryInfo.pagesize = size;
      this._getUsers();
    },
    handleCurrentChange(currentPage) {
      this.queryInfo.pagenum = currentPage;
      this._getUsers();
    },
    userStateChange(userInfo) {
      changeUserState(userInfo.id, userInfo.mg_state).then((res) => {
        if (res.meta.status !== 200) return this.$message.error("更改状态失败");
        this.$message.success("更改状态成功");
      });
    },
    determine() {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          addUser(this.addForm).then((res) => {
            if (!res.meta.status === 201)
              return this.$message.error("添加用户失败");
            this.$message.success("添加用户成功");
            this._getUsers();
          });
          this.dialogVisible = false;
          return false;
        }
        this.$message.error("填写信息格式有误，请重新填写");
      });
    },
    dialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    editUser(info) {
      this.editDialog = true;
      this.editForm = info;
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
    },
    //修改用户信息
    editUserInfo() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return;
        editUserInfo(this.editForm).then((res) => {
          if (res.meta.status !== 200)
            return this.$message.error("修改用户信息失败");
          this.editDialog = false;
          this._getUsers();
          this.$message.success("修改用户信息成功");
        });
      });
    },
    //删除用户
    removeUser(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((res) => {
          removeUser(id).then((res) => {
            if (res.meta.status !== 200)
              return this.$message.error("删除用户失败");
            this._getUsers();
            this.$message.success("删除成功");
          });
        })
        .catch((err) => {
          this.$message.info("已取消删除");
        });
    },
    //分配角色
    async handleSetRole(userInfo) {
      const res = await getRolesList();
      if (res.meta.status !== 200) return this.$message.error("获取信息失败");
      this.rolesList = res.data;
      this.userInfo = userInfo;
      this.setRoledialogVisible = true;
    },
    //确认分配角色
    async savaRoleInfo() {
      if (!this.selectRoleId) return this.$message.info("请选择要分配的角色");
      const res = await setUserRole(this.userInfo.id, this.selectRoleId);
      if (res.meta.status !== 200) return this.$message.error("设置角色失败");
      this.$message.success("设置角色成功");
      this._getUsers();
      this.setRoledialogVisible = false;
    },
    //监听分配角色对话框关闭
    setRoledialogClose() {
      this.selectRoleId = null;
      this.userInfo = null;
    },
  },
};
</script>

<style lang='less' scoped>
.el-breadcrumb {
  margin-bottom: 20px;
  font-size: 12px;
}
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
.el-pagination {
  margin-top: 15px;
}
</style>
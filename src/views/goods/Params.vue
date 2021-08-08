<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        title="注意，只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cateparamsRow">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
          >
          </el-cascader>
        </el-col>
      </el-row>

      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!--添加动态参数面板  -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加动态参数按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand"></el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialong(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button size="mini" type="danger" icon="el-icon-delete"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加静态属性按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand"></el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialong(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button size="mini" type="danger" icon="el-icon-delete"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + addDialongTitle"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialongClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRule"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="addDialongTitle" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改' + addDialongTitle"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialongClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRule"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="addDialongTitle" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCateList,
  getCateParamsList,
  addCateParams,
  getIdFromParam,
} from "network/goods";

export default {
  name: "Params",
  data() {
    return {
      cateList: [],
      // 级联选择框的配置对象
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      // 级联选择框双向绑定的数组
      selectedCateKeys: [],
      //当前激活的tab项
      activeName: "many",
      manyTableData: [],
      onlyTableData: [],
      // 控制添加参数对话框的显示与隐藏
      addDialogVisible: false,
      addForm: {
        attr_name: "",
      },
      addFormRule: {
        attr_name: [
          {
            required: true,
            message: "请输入参数名称",
            trigger: "blur",
          },
        ],
      },
      editDialogVisible: false,
      editForm: {
        attr_name: "",
      },
      editFormRule: {
        attr_name: [
          {
            required: true,
            message: "请输入参数名称",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this._getCateList();
  },
  methods: {
    //   获取分类列表
    async _getCateList() {
      const res = await getCateList();
      if (res.meta.status !== 200)
        return this.$message.error("获取分类列表失败");
      this.cateList = res.data;
    },
    // 级联选择框改变
    handleChange() {
      this.getCateParams();
    },
    //tab点击事件
    handleTabClick() {
      // console.log(this.activeName);
      this.getCateParams();
    },
    // 获取参数列表
    async getCateParams() {
      // 判断选中了三级分类，再发送请求
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        return;
      }

      const res = await getCateParamsList(this.cateId, this.activeName);
      if (res.meta.status !== 200)
        return this.$message.info("参数列表请求失败");
      // 存储的数据分类
      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    // 监听对话框关闭事件
    addDialongClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击对话框确定按钮添加属性
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return this.$message.info("参数名校验失败");
        const res = await addCateParams(
          this.cateId,
          this.addForm.attr_name,
          this.activeName
        );
        if (res.meta.status !== 201) return this.$message.error("添加参数失败");
        this.$message.success("添加参数成功");
        this.getCateParams();
        this.addDialogVisible = false;
      });
    },
    //点击修改按钮
    async showEditDialong(attr_id) {
      console.log("hello");
      this.editDialogVisible = true;
      const res = await getIdFromParam(this.cateId, attr_id, this.activeName);
      if (res.meta.status !== 200) return this.$message.error("获取参数失败");
      this.editForm.attr_name = res.data.attr_name;
    },
    //修改参数
    editParams() {
      
    },
    //修改参数对话框关闭
    editDialongClosed() {
      this.$refs.editFormRef.resetFields();
    },
  },
  computed: {
    // 按钮是否禁用
    isBtnDisabled() {
      return this.selectedCateKeys.length !== 3;
    },
    // 获取当前选择的三级分类ID
    cateId() {
      return this.selectedCateKeys.length === 3
        ? this.selectedCateKeys[2]
        : null;
    },
    //添加参数对话框title
    addDialongTitle() {
      return this.activeName === "many" ? "动态参数" : "静态属性";
    },
  },
};
</script>

<style lang='less' scoped>
.cateparamsRow {
  margin: 15px 0;
}
</style>

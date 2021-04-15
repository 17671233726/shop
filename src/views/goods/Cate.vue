<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col
          ><el-button type="primary" @click="showAddCateDialong"
            >添加分类</el-button
          ></el-col
        >
      </el-row>

      <!-- 表格 -->
      <!-- 第三方组件 -->
      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="colimns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效列 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted"
            style="color: #67c23a"
          ></i>
          <i class="el-icon-error" v-else style="color: #f56c6c"></i>
        </template>
        <!-- 等级列 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            type="success"
            >二级</el-tag
          >
          <el-tag size="mini" v-else type="warning">三级</el-tag>
        </template>
        <!-- 操作列 -->
        <template slot="operation" slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="showCateEditDialong(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="deleteCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页 -->
      <!-- 
        @size-change  切换每页显示多少条的事件 接收选择的条数
        @current-change   当前页改变事件  接收选择的页数
        :current-page    绑定当前在多少页
        :page-sizes      绑定每页显示多少条可选数
        :page-size       绑定显示当前每页显示多少条
       -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCatedialogVisible"
      width="50%"
      @close="addCateDialongClosed"
    >
      <!-- 添加分类表单 -->
      <el-form
        ref="addCateForm"
        :model="addCateform"
        :rules="addCaterules"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateform.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options用来指定数据源 -->
          <!-- props用来指定配置对象 -->
          <!--  v-model 选择父级分类的id数组 -->
          <el-cascader
            expand-trigger="hover"
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改分类对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="CloseEditCateDialong"
    >
      <el-form
        ref="editCateForm"
        :model="editCateForm"
        :rules="editCaterules"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCateList,
  getParentCateList,
  addCate,
  editCate,
  deleteCate,
} from "network/goods";

export default {
  name: "Cate",
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      cateList: [],
      total: null,
      colimns: [
        { label: "分类名称", prop: "cat_name" },
        {
          label: "是否有效",
          type: "template", //将当前列定义为模板列
          //表示当前这一列使用模板名称
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "operation",
        },
      ],
      addCateform: {
        cat_name: "",
        cat_pid: 0,
        cate_level: 0,
      },
      editCateForm: {
        cat_name: "",
      },
      addCaterules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      editCaterules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      addCatedialogVisible: false,
      editCateDialogVisible: false,
      parentCateList: [],
      // Cascader组件的props配置对象
      cascaderProps: {
        value: "cat_id", //选择的数据
        label: "cat_name", //看到的文字
        children: "children", //嵌套方式
        checkStrictly: true,
      },
      //选择父级分类的id数组
      selectedKeys: [],
      editCate_id: null,
    };
  },
  created() {
    this._getCateList();
  },
  methods: {
    //获取分类数据列表
    async _getCateList() {
      const res = await getCateList(this.queryInfo);
      if (res.meta.status !== 200)
        return this.$message.error("获取分类数据失败");
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    //监听pagesize改变
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this._getCateList();
    },
    //监听pagenum改变
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      this._getCateList();
    },
    //点击添加分类
    showAddCateDialong() {
      //点击添加分类按钮先获取父级分类列表
      this._getParentCateList();
      //再显示对话框
      this.addCatedialogVisible = true;
    },
    //获取父级分类
    async _getParentCateList() {
      const res = await getParentCateList(2);
      if (res.meta.status !== 200)
        return this.$message.error("获取父级分类列表失败");
      this.parentCateList = res.data;
    },
    //选择项发生变化触发这个函数
    parentCateChange() {
      //如果selectedKeys数组中的长度>0说明选中的父级分类
      if (this.selectedKeys.length > 0) {
        //取出selectedKeys中的最后一项id作为选中的父级id
        this.addCateform.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        this.addCateform.cate_level = this.selectedKeys.length;
        return;
      } else {
        //重置父级分类的id和级别
        this.addCateform.cat_pid = 0;
        this.addCateform.cate_level = 0;
      }
    },
    //点击对话框确认添加分类
    async addCate() {
      this.$refs.addCateForm.validate(async (valid) => {
        if (!valid) return this.$message.info("提交表单不符合规范");
        const res = await addCate(this.addCateform);
        if (res.meta.status !== 201) return this.$message.error("添加分类失败");
        this.$message.success("添加分类成功");
        this._getCateList();
        this.addCatedialogVisible = false;
      });
    },
    //监听添加分类对话框关闭，重置表单数据
    addCateDialongClosed() {
      this.$refs.addCateForm.resetFields();
      this.selectedKeys = [];
      this.addCateform.cat_pid = 0;
      this.addCateform.cate_level = 0;
    },
    //点击显示修改分类对话框
    showCateEditDialong(cat_info) {
      this.editCateForm.cat_name = cat_info.cat_name;
      this.editCate_id = cat_info.cat_id;
      this.editCateDialogVisible = true;
    },
    //修改分类
    editCate() {
      this.$refs.editCateForm.validate(async (valid) => {
        if (!valid) return this.$message.info("分类名验证错误");
        const res = await editCate(
          this.editCate_id,
          this.editCateForm.cat_name
        );
        if (res.meta.status !== 200) return this.$message.error("修改分类失败");
        this.$message.success("修改分类成功");
        this._getCateList();
        this.editCateDialogVisible = false;
      });
    },
    //修改分类对话框关闭
    CloseEditCateDialong() {
      this.editCate_id = null;
    },
    //// 删除分类
    deleteCate(cat_id) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await deleteCate(cat_id);
          if (res.meta.status !== 200)
            return this.$message.error("删除分类失败");
          this.$message.success("删除分类成功");
          this._getCateList();
        })
        .catch((err) => {});
    },
  },
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 20px;
  font-size: 12px;
}
.treeTable {
  margin-top: 15px;
}
.el-pagination {
  margin-top: 10px;
}
.el-cascader {
  width: 100%;
}
</style>
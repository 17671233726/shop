<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 搜索行 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="clearInput">
            <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAdd">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表表格 -->
      <el-table class="goodsList_table" :data="goodsList" stripe border style="width: 100%">
        <el-table-column type="index" label="#" width="50"> </el-table-column>
        <el-table-column class="goods_name" prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="110">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="150">
            <template v-slot="scoped">
                <div>{{scoped.row.add_time | dateFormat('YYYY-MM-DD HH:mm:SS')}}</div>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template v-slot="scoped">
                <el-button type="primary" icon="el-icon-edit" size="mini"></el-button><el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoodsById(scoped.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
        <!-- 分页区域 -->
         <el-pagination
         class="pagination"
         background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5,10,20]"
      layout="total, sizes, prev, pager, next, jumper"
      :page-size="queryInfo.pagesize"
      :total="total">
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getGoodsList,deleteGoodsById } from "network/goods.js";

export default {
  name: "List",
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      goodsList: [],
      total: 0,
    };
  },
  created() {
    this._getGoodsList();
  },
  methods: {
    async _getGoodsList() {
      //获取商品列表
      const res = await getGoodsList(this.queryInfo);
      if (res.meta.status !== 200)
        return this.$message.error("获取商品列表失败");
      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(newSize){
        this.queryInfo.pagesize=newSize
        this._getGoodsList()
    },
    handleCurrentChange(newPage){
        this.queryInfo.pagenum=newPage
        this._getGoodsList()
    },
    searchGoods(){
         this._getGoodsList()
    },
    clearInput(){
        this._getGoodsList()
    },
    removeGoodsById(id){
        this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(async res=>{
            const result=await deleteGoodsById(id);
            if(result.meta.status==200){
                this.$message.success("删除成功")
                this._getGoodsList();
                return;
            };
            this.$message.success("删除失败")
        })
        .catch((err)=>{
            this.$message.info("取消删除")
        })
        
    },
    goAdd(){
        this.$router.push('./goods/add')
    }
  },
};
</script>

<style scoped>
.goodsList_table{
    font-size: 12px;
}
.pagination{
    margin-top: 20px;
}
</style>
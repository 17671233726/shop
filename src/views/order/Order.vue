<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表表格 -->
      <el-table :data="orderList" stripe border style="width: 100%">
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column
          class="goods_name"
          prop="order_number"
          label="订单编号"
        ></el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格"
          width="80"
        ></el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="90">
          <template v-slot="scoped">
            <el-tag v-if="scoped.row.pay_status == '1'" type="success"
              >已付款</el-tag
            >
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="80">
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template v-slot="scoped">
            {{ scoped.row.create_time | dateFormat("YYYY-MM-DD HH:mm:SS") }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showDialog"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location-outline"
              size="mini"
              @click="showProcess"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 修改地址对话框 -->
      <el-dialog
        title="提示"
        :visible.sync="modifyAddressdialogVisible"
        width="50%"
        @close="closeDialog"
      >
        <el-form
          :model="addressForm"
          :rules="addressFormRules"
          ref="addressForm"
          label-width="100px"
        >
          <el-form-item label="省市区/县" prop="adress1">
            <el-cascader :options="citydata" v-model="addressForm.adress1"></el-cascader>
          </el-form-item>
           <el-form-item label="详细地址" prop="adress2">
            <el-input v-model="addressForm.adress2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="modifyAddressdialogVisible = false"
            >取 消</el-button
          >
          <el-button type="primary" @click="modifyAddressdialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 物流进度对话框 -->
      <el-dialog
  title="物流进度"
  :visible.sync="ProcessVisible"
  width="50%">
   <el-timeline>
    <el-timeline-item
      v-for="(activity, index) in processdata"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
</el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getOrderList,getProcess } from "network/order.js";

import citydata from 'assets/data/citydata'
import processdata from 'assets/data/processdata'

export default {
  name: "Order",
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      orderList: [],
      total: 0,
      modifyAddressdialogVisible: false,
      ProcessVisible:false,
      addressForm: {
        adress1: [],
        adress12: "",
      },
      addressFormRules:{
          adress1:[
               { required: true, message: '请输入省市区/县', trigger: 'blur' },
          ],
           adress2:[
               { required: true, message: '请输入详细地址', trigger: 'blur' },
          ]
      },
      citydata,
      processdata
    };
  },
  created() {
    this._getOrderList();
  },
  methods: {
    async _getOrderList() {
      const res = await getOrderList(this.queryInfo);
      if (res.meta.status !== 200) return this.$message.error("获取订单失败");
      this.orderList = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize;
      this._getOrderList();
    },
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum;
      this._getOrderList();
    },
    showDialog() {
      this.modifyAddressdialogVisible = true;
    },
    closeDialog(){
        this.$refs.addressForm.resetFields();
    },
    async showProcess(){
        this.ProcessVisible=true;
       console.log(this.processdata);
    }
  },
};
</script>

<style scoped>
.el-table {
  margin-top: 20px;
}
.el-cascader{
    width: 100%;
}
</style>
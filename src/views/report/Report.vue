<template>
  <div>
       <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
     <el-card>
         <div id="main" style="width: 750px;height:400px;"></div>
     </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts';

import option from 'assets/data/report'

import {getReport} from 'network/report'

export default {
    name:'Report',
    data(){
        return {
            option
        }
    },
    async mounted(){
        var myChart = echarts.init(document.getElementById('main'));
        const res=await getReport();
        if(res.meta.status!==200) return this.$message.error("获取报表数据失败");
        let options=Object.assign(option,res.data)
        myChart.setOption(options);
    }
}
</script>

<style>

</style>
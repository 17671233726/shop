<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon> </el-alert>
      <el-steps
        :space="200"
        :active="activeIndex"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏区域 -->
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          :before-leave="tabBeforeLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleCateChange"
              >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in tabParamsList"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(item2, index) in item.attr_vals"
                  :key="index"
                  :label="item2"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in goodsAttributeList"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadUrl"
              :headers="uploadHeaders"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
              <quill-editor v-model="addForm.goods_introduce"></quill-editor>
              <el-button class="submitBtn" type="primary" @click="submitForm">提交</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import _ from 'lodash'

import { getCateList, getCateParamsList,addGoods } from "network/goods";

export default {
  name: "Add",
  components:{
      quillEditor
  },
  created() {
    this._getCAteList();
  },
  data() {
    return {
      tabIndex: 0,
      activeIndex: 0,
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: "",
        pics: [],
        goods_introduce:'',
        attrs:[]
      },
      addRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      cateList: [],
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      tabParamsList: [],
      goodsAttributeList: [],
      uploadUrl: "http://www.ysqorz.top:8888/api/private/v1/upload",
      uploadHeaders: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      preViewUrl: "",
      previreVisible: false,
    };
  },
  methods: {
    async _getCAteList() {
      const res = await getCateList();
      if (res.meta.status !== 200) return this.$message.error("获取分类失败");
      this.cateList = res.data;
    },
    handleCateChange() {
      if (this.addForm.goods_cat.length !== 3)
        return (this.addForm.goods_cat = []);
    },
    tabBeforeLeave(activeName, oldActiveName) {
      if (oldActiveName == 0 && this.addForm.goods_cat.length !== 3) {
        this.$message.info("请选择商品分类");
        return false;
      }
      this.tabIndex = activeName;
    },
    async tabClick() {
      if (this.tabIndex == 1) {
        const res = await getCateParamsList(this.addForm.goods_cat[2], "many");
        if (res.meta.status !== 200)
          return this.$message.info("获取分类数据失败");
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.lengthl == 0 ? [] : item.attr_vals.split(" ");
        });
        this.tabParamsList = res.data;
      } else if (this.tabIndex == 2) {
        const res = await getCateParamsList(this.addForm.goods_cat[2], "only");
        if (res.meta.status !== 200)
          return this.$message.info("获取分类数据失败");
        this.goodsAttributeList = res.data;
      }
    },
    handlePreview(file) {
        console.log(file)
    //   this.preViewUrl = file.response.data.url;
    //   console.log(this.preViewUrl);
    //   this.previreVisible=true
    },
    handleRemove(file) {
      const tmp_path = file.response.data.tmp_path;
      const index = this.addForm.pics.findIndex((item) => item.pic == tmp_path);
      this.addForm.pics.splice(index, 1);
    },
    handleSuccess(res) {
      this.addForm.pics.push({ pic: res.data.tmp_path });
    },
    submitForm(){
        this.$refs.addRef.validate(async valid=>{
            if(!valid) return this.$message.error("请填写完整信息");
            const form=_.cloneDeep(this.addForm);
            form.goods_cat=form.goods_cat.join(',');
            let attrs=[]
             this.tabParamsList.forEach(item=>{
                 attrs.push({attr_id:item.attr_id,attr_value:item.attr_vals.join(',')})
             })
            this.goodsAttributeList.map(item=>{
                attrs.push({attr_id:item.attr_id,attr_value:item.attr_vals});
            })
            form.attrs=attrs;
            const res=await addGoods(form);
            if(res.meta.status!==201) return this.$message.error("添加商品失败");
            this.$message.success("添加商品成功")
            this.$router.push('/goods');
        })
    }
  },
};
</script>

<style scoped>
.el-checkbox {
  margin: 10px 20px 0 0 !important;
}

.submitBtn{
    margin-top: 10px;
}
</style>
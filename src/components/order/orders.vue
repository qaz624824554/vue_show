<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索按钮 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getOrdersInfo"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="ordersInfo" border stripe style="marginTop: 20px">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.order_pay === '0'">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">{{scope.row.update_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="locationVisible = true"
            ></el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="progressClick"></el-button>
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
      ></el-pagination>
    </el-card>

    <!-- 修改收货地址对话框 -->
    <el-dialog title="修改收货地址" :visible.sync="locationVisible" width="50%">
      <el-form :model="locationForm" :rules="locationRules" ref="locationRef" label-width="100px">
        <el-form-item label="省市区县" prop="address2">
          <el-cascader
            v-model="locationCascader"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"
            @change="handleChange"
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input placeholder="请输入详细地址"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="locationVisible = false">取 消</el-button>
        <el-button type="primary" @click="locationVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流信息对话框 -->
    <el-dialog title="物流信息" :visible.sync="progressVisible" width="50%">
      <!-- 时间线 -->
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(activity, index) in logisticsInformation"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      ordersInfo: [],
      total: 0,
      locationVisible: false,
      locationForm: {},
      locationRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      locationCascader: [],
      cityData,
      progressVisible: false,
      // 物流信息
      logisticsInformation: []
    }
  },
  methods: {
    async getOrdersInfo() {
      const { data: res } = await this.$http.get('/orders', {
        params: this.queryInfo
      })
      this.ordersInfo = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrdersInfo()
    },
    handleCurrentChange(newSize) {
      this.queryInfo.pagenum = newSize
      this.getOrdersInfo()
    },
    handleChange() {},
    editLocation() {
      this.locationVisible = true
    },
    async progressClick() {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流信息失败')
      }
      this.logisticsInformation = res.data
      this.progressVisible = true
      console.log(this.logisticsInformation)
    }
  },
  created() {
    this.getOrdersInfo()
  }
}
</script>

<style lang="less" scoped></style>

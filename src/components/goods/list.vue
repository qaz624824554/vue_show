<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20" class="rowBottom">
        <!-- 搜索框 -->
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsInfo">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsInfo"></el-button>
          </el-input>
        </el-col>
        <!-- 添加按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table表格 -->
      <el-table :data="goodsInfo" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="110px"></el-table-column>
        <el-table-column label="商品数量" prop="goods_number" width="80px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="80px"></el-table-column>
        <el-table-column label="创建时间" width="200px">
          <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="170px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini">编辑</el-button>
            <el-button type="danger" size="mini" @click="deleteGood(scope.row.goods_id)">删除</el-button>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 获取商品请求参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品信息数据
      goodsInfo: [],
      // 商品总数
      total: 0
    }
  },
  methods: {
    async getGoodsInfo() {
      const { data: res } = await this.$http.get('/goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品信息失败')
      }
      this.goodsInfo = res.data.goods
      this.total = res.data.total
    },
    // 分页
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsInfo()
    },
    handleCurrentChange(newSize) {
      this.queryInfo.pagenum = newSize
      this.getGoodsInfo()
    },
    // 删除商品信息
    deleteGood(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`/goods/${id}`)
          if (res.meta.status !== 200) {
            return this.$message.error('删除商品失败')
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getGoodsInfo()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 添加商品
    addGoods() {
      this.$router.push('/goods/add')
    }
  },
  created() {
    this.getGoodsInfo()
  }
}
</script>

<style lang="less" scoped>
.rowBottom {
  margin-bottom: 20px;
}
</style>

<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加商品按钮 -->
      <el-row class="btnMargin">
        <el-col>
          <el-button type="primary" @click="addForm">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表 -->
      <tree-table
        :data="cateInfo"
        tree-type
        :columns="treeColumns"
        show-index
        index-text="#"
        :selection-type="false"
        :expand-type="false"
        border
        class="tree-bottom"
      >
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-check" v-if="!scope.row.cat_deleted" style="color:green"></i>
          <i class="el-icon-close" v-else style="color:red"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCate(scope.row.cat_id)"
          >删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 8, 16]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加商品分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateVisible" width="50%">
      <el-form
        :model="addCateForm"
        :rules="addCateRules"
        ref="addCateRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <!-- 级联选择器 -->
          <!-- expandTrigger='hover'(鼠标悬停触发级联) v-model(设置级联菜单绑定数据) :options(指定级联菜单数据源)  :props(用来配置数据显示的规则)
          clearable(提供“X”号完成删除文本功能) change-on-select(是否可以选中任意一级的菜单)-->
          <el-cascader
            v-model="addCascader"
            :options="addCateInfo"
            :props="cascaderProps"
            @change="addHandleChange"
            clearable
            class="add-cascader"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 请求的参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品信息
      cateInfo: [],
      // 总数
      total: 0,
      // tree-table treeColumns配置
      treeColumns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      // 显示添加商品对话框
      addCateVisible: false,
      // 显示添加分类对话框获取的数据
      addCateInfo: [],
      // 添加表单数据
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // 添加表单校验
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 级联选择器对应的值
      addCascader: [],
      // 级联选择器options
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        // 可选择任意一级
        checkStrictly: true
      }
    }
  },
  methods: {
    // 获取商品分类信息
    async getCateInfo() {
      const { data: res } = await this.$http.get('/categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.cateInfo = res.data.result
      this.total = res.data.total
    },
    // pageSize 改变时会触发
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getCateInfo()
    },
    // currentPage 改变时会触发
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getCateInfo()
    },
    // 添加分类click
    addForm() {
      this.getParentCateList()
      this.addCateVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }

      this.addCateInfo = res.data
    },
    // 级联选择器change事件
    addHandleChange() {
      // 判断级联选择器是否选择，不选择默认是一级
      if (this.addCascader.length !== 0) {
        this.addCateForm.cat_pid = this.addCascader[this.addCascader.length - 1]
        this.addCateForm.cat_level = this.addCascader.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 添加商品分类提交
    submitAddInfo() {
      this.$refs.addCateRef.validate(async val => {
        if (val) {
          const { data: res } = await this.$http.post(
            '/categories',
            this.addCateForm
          )
          if (res.meta.status !== 201) {
            return this.$message.error('添加商品分类失败')
          }
          this.$message.success('添加商品分类成功')
          this.getCateInfo()
          this.addCateVisible = false
        }
      })
    },
    // 删除商品分类
    async deleteCate(id) {
      const { data: res } = await this.$http.delete(`/categories/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getCateInfo()
    }
  },
  created() {
    this.getCateInfo()
  }
}
</script>

<style lang="less" scoped>
.btnMargin {
  margin-bottom: 15px;
}

.tree-bottom {
  margin-bottom: 15px;
}

.add-cascader {
  width: 100%;
}
</style>

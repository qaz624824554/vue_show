<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分类管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false"></el-alert>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="cat_opt">
          <span>选择商品分类：</span>
          <!-- 级联选择器 -->
          <el-cascader
            v-model="selectInfoList"
            :options="cateInfo"
            :props="selectProps"
            @change="selectHandleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- Tabs标签页 -->
      <el-tabs v-model="TabsActiveName" @tab-click="tabHandleClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数按钮 -->
          <el-button
            type="primary"
            :disabled="isButtonDisabled"
            @click="addDialogVisible = true"
          >添加参数</el-button>
          <!-- 数据显示table -->
          <el-table :data="manyTableData" style="width: 100%">
            <!-- 扩展列 -->
            <el-table-column type="expand">
              <!-- 作用域插槽 -->
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i,scope.row)"
                  class="tagMargin"
                >{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="editAttr(scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteAttr(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态参数 -->
        <el-tab-pane label="静态参数" name="only">
          <!-- 添加参数按钮 -->
          <el-button
            type="primary"
            :disabled="isButtonDisabled"
            @click="addDialogVisible = true"
          >添加参数</el-button>
          <!-- 数据显示table -->
          <el-table :data="onlyTableData" style="width: 100%">
            <el-table-column type="expand">
              <!-- 作用域插槽 -->
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i,scope.row)"
                  class="tagMargin"
                >{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="editAttr(scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteAttr(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog title="提示" :visible.sync="addDialogVisible" width="30%" @close="addDialogClosed">
      <el-form
        :model="addAttrForm"
        :rules="addAttrRules"
        ref="addAttrRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="参数名称" prop="attr_name">
          <el-input v-model="addAttrForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAttr">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑参数对话框 -->
    <el-dialog title="提示" :visible.sync="editDialogVisible" width="30%">
      <el-form
        :model="editAttrForm"
        :rules="editAttrRules"
        ref="editAttrRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="参数名称" prop="attr_name">
          <el-input v-model="editAttrForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 分类商品数据
      cateInfo: [],
      // 总数
      total: 0,
      // 级联props配置
      selectProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 级联选择框双向绑定到的数组
      selectInfoList: [],
      // tabs标签选择的值
      TabsActiveName: 'many',
      // 静态参数列表数据
      onlyTableData: [],
      // 动态参数列表数据
      manyTableData: [],
      // 添加参数对话框
      addDialogVisible: false,
      // 添加参数表单数据
      addAttrForm: {},
      // 添加参数表单校验
      addAttrRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 编辑参数对话框
      editDialogVisible: false,
      // 编辑表单数据
      editAttrForm: {
        attr_name: ''
      },
      // 编辑参数表单校验
      editAttrRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCateInfo()
  },
  methods: {
    // 获取分类数据
    async getCateInfo() {
      const { data: res } = await this.$http.get('/categories')
      if (res.meta.status !== 200) {
        this.$message.error('获取数据失败')
      }
      this.cateInfo = res.data
      this.total = res.data.total
    },
    // 级联选择器change事件
    selectHandleChange() {
      // 获取参数列表数据
      this.getAttributesInfo()
    },
    // Tabs点击触发事件
    tabHandleClick() {
      this.getAttributesInfo()
    },
    // 获取参数数据
    async getAttributesInfo() {
      // 设置必须选择3级分类
      if (this.selectInfoList.length !== 3) {
        this.selectInfoList = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.TabsActiveName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数数据失败')
      }

      // res.data是数组，通过遍历将数组中每个对象的attr_vals转化为数组，并为每个对象添加一个inputVisible属性和inputValue属性
      // 将attr_vals转成数组
      res.data.forEach(item => {
        // 将attr_vals字符串转换成数组，以空格分隔
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框中输入的值
        item.inputValue = ''
      })

      if (this.TabsActiveName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 监听添加参数对话框关闭事件
    addDialogClosed() {
      this.$refs.addAttrRef.resetFields()
    },
    // 提交添加参数form
    addAttr() {
      // 表单校验
      this.$refs.addAttrRef.validate(async val => {
        if (!val) return
        const { data: res } = await this.$http.post(
          `/categories/${this.cateId}/attributes`,
          {
            attr_name: this.addAttrForm.attr_name,
            attr_sel: this.TabsActiveName
          }
        )
        if (res.meta.status !== 201) {
          this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        this.getAttributesInfo()
        this.addDialogVisible = false
      })
    },
    // 编辑参数click
    async editAttr(val) {
      const { data: res } = await this.$http.get(
        `/categories/${val.cat_id}/attributes/${val.attr_id}`
      )
      console.log(res.data)

      if (res.meta.status !== 200) {
        return this.$message.error('获取参数信息失败')
      }

      this.editAttrForm = res.data

      this.editDialogVisible = true
    },
    // 编辑参数提交
    submitEdit() {
      // 数据校验
      this.$refs.editAttrRef.validate(async val => {
        if (!val) return
        const { data: res } = await this.$http.put(
          `/categories/${this.editAttrForm.cat_id}/attributes/${this.editAttrForm.attr_id}`,
          {
            attr_name: this.editAttrForm.attr_name,
            attr_sel: this.TabsActiveName
          }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('编辑参数失败')
        }
        this.$message.success('编辑参数成功')
        this.getAttributesInfo()
        this.editDialogVisible = false
      })
    },
    // 删除参数click
    deleteAttr(val) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `/categories/${val.cat_id}/attributes/${val.attr_id}`
          )
          if (res.meta.status !== 200) {
            return this.$message.error('删除参数失败')
          }
          this.$message.success('删除参数成功')
          this.getAttributesInfo()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // expand文本框事件
    // 文本框失去焦点，或摁下了 Enter 都会触发
    async handleInputConfirm(row) {
      // 判断文本框是否有内容
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 如果没有return，则证明输入的内容，需要做后续处理
      // row.attr_vals是一个数组[]
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    // 将对 attr_vals 的操作，保存到数据库
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          // attr_vals此时是数组
          attr_vals: row.attr_vals.join(' ')
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败！')
      }

      this.$message.success('修改参数项成功！')
    },
    // 点击按钮，展示文本输入框
    showInput(row) {
      row.inputVisible = true
      // 让文本框自动获得焦点
      // $nextTick 方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除当前的tag标签
    handleClose(i, row) {
      // i为当前的索引
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  },
  // 计算属性
  computed: {
    isButtonDisabled() {
      if (this.selectInfoList.length === 3) {
        return false
      } else {
        return true
      }
    },
    // 当前选择的三级ID
    cateId() {
      if (this.selectInfoList.length === 3) {
        return this.selectInfoList[this.selectInfoList.length - 1]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}

.tabMargin {
  margin-right: 10px;
}

.input-new-tag {
  width: 200px;
}

.tagMargin {
  margin-right: 15px;
}
</style>

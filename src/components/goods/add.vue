<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 进度条 -->
    <el-steps :space="200" :active="activeTab - 0" finish-status="success" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>

    <!-- tab标签 -->
    <!-- 用form表单包裹 -->
    <el-form
      :model="addGoodForm"
      :rules="addGoodFormRules"
      ref="addGoodFormRef"
      label-width="50px"
      label-position="top"
    >
      <el-tabs
        :tab-position="'left'"
        v-model="activeTab"
        style="height: 100%;"
        :before-leave="tabsLeave"
        @tab-click="tabClick"
      >
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addGoodForm.goods_name" placeholder="请输入商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品价格(元)" prop="goods_price">
            <el-input v-model="addGoodForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="数量" prop="goods_number">
            <el-input v-model="addGoodForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="重量" prop="goods_weight">
            <el-input v-model="addGoodForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader
              v-model="addGoodForm.goods_cat"
              :options="cateInfo"
              :props="cascaderProps"
              @change="cascaderHandleChange"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-form-item :label="item.attr_name" v-for="item in manyTabInfo" :key="item.attr_id">
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox :label="val" v-for="(val,i2) in item.attr_vals" :key="i2" border></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item :label="item.attr_name" v-for="item in onlyTabInfo" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            class="upload-demo"
            action="http://127.0.0.1:8081/api/private/v1/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            :headers="uploadHeaders"
            :on-success="handleSuccess"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <quill-editor v-model="addGoodForm.goods_introduce" style="height: 200px" />
          <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-form>

    <!-- 点击上传的图片对话框 -->
    <el-dialog title="上传图片" :visible.sync="uploadVisible" width="50%">
      <img :src="fileUrl" alt="上传图片" class="imgWidth" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      // 控制进度条和tab之间的联动
      activeTab: '0',
      // 表单信息
      addGoodForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        attrs: [],
        pics: [],
        goods_introduce: ''
      },
      // 表单校验
      addGoodFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ]
      },
      // 分类信息
      cateInfo: [],
      // 级联选择器props
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 动态属性数据
      manyTabInfo: [],
      // 静态属性数据
      onlyTabInfo: [],
      // 上传图片的请求头对象
      uploadHeaders: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 上传图片对话框
      uploadVisible: false,
      // 上传图片url地址
      fileUrl: 'http://127.0.0.1:8081/'
    }
  },
  methods: {
    // 获取商品分类信息
    async getCateInfo() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.cateInfo = res.data
    },
    // 级联选择器选择触发的事件函数
    cascaderHandleChange() {
      if (this.addGoodForm.goods_cat.length !== 3) {
        this.addGoodForm.goods_cat = []
      }
    },
    // tabs切换标签钩子
    tabsLeave(activeName, oldActiveName) {
      // 判断级联选择器是否有选中,没选择则不能进行tab切换
      if (oldActiveName === '0' && this.addGoodForm.goods_cat.length !== 3) {
        this.$message.error('请选择分类')
        return false
      }
    },
    // tabs点击事件
    async tabClick() {
      // tab标签切换才获取数据
      if (this.activeTab === '1') {
        const { data: res } = await this.$http.get(
          `/categories/${this.cateId}/attributes`,
          {
            params: {
              sel: 'many'
            }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数失败')
        }
        // 将数据中的attr_vals转换成数组
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length !== 0 ? item.attr_vals.split(' ') : []
        })
        this.manyTabInfo = res.data
      } else if (this.activeTab === '2') {
        const { data: res } = await this.$http.get(
          `/categories/${this.cateId}/attributes`,
          {
            params: {
              sel: 'only'
            }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数失败')
        }
        this.onlyTabInfo = res.data
      }
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePreview(file) {
      const url = file.response.data.tmp_path
      this.fileUrl = this.fileUrl.concat(url)
      this.uploadVisible = true
    },
    // 文件列表移除文件时的钩子
    handleRemove(file) {
      const path = file.response.data.tmp_path
      const i = this.addGoodForm.pics.findIndex(v => v.pic === path)
      this.addGoodForm.pics.splice(i, 1)
    },
    // 文件上传成功时的钩子
    handleSuccess(response) {
      const path = response.data.tmp_path
      const objPath = {}
      objPath.pic = path
      this.addGoodForm.pics.push(objPath)
    },
    // 添加商品click
    add() {
      // 表单校验
      this.$refs.addGoodFormRef.validate(async val => {
        if (!val) {
          return this.$message.error('表单校验失败')
        }

        // 深拷贝，因为Checkbox默认选择数组
        const form = _.cloneDeep(this.addGoodForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyTabInfo.forEach(item => {
          const obj = {}
          obj.attr_id = item.attr_id
          obj.attr_value = item.attr_vals.join(' ')
          this.addGoodForm.attrs.push(obj)
        })
        // 处理静态属性
        this.onlyTabInfo.forEach(item => {
          const obj = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addGoodForm.attrs.push(obj)
        })
        form.attrs = this.addGoodForm.attrs
        const { data: res } = await this.$http.post('/goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }

        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    }
  },
  created() {
    this.getCateInfo()
  },
  // 计算属性
  computed: {
    cateId() {
      if (this.addGoodForm.goods_cat.length === 3) {
        return this.addGoodForm.goods_cat[this.addGoodForm.goods_cat.length - 1]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-input {
  width: 300px;
}

.imgWidth {
  width: 100%;
}

.btnAdd {
  margin-top: 80px;
}
</style>

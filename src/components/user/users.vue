<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索框按钮 -->
      <el-row :gutter="20" style="marginBottom: 20px">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryList.query" clearable @clear="searchUserList">
            <!-- 点击搜索按钮进行搜索 -->
            <el-button slot="append" icon="el-icon-search" @click="searchUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- 点击添加用户按钮弹出对话框 -->
          <el-button type="primary" @click="addUserBol = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户表格 -->
      <el-table :data="userList" style="width: 100%" stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="180"></el-table-column>
        <el-table-column label="状态" width="180">
          <template slot-scope="scope">
            <!-- scope.row当前行对应的对象 -->
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editUserInfo(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserInfo(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="assignRoles(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryList.pagenum"
        :page-sizes="[2, 4, 6, 8]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addUserBol" width="50%">
      <!-- 对话框主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部区域 -->
      <span slot="footer">
        <el-button @click="addFormClosed">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户信息对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editUserBol" width="45%">
      <!-- 对话框主体区域 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部区域 -->
      <span slot="footer">
        <el-button @click="editFormClosed">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="assignRoleVisible" width="40%" @close="dialogClosed">
      <div>
        <p>当前用户:{{userInfo.username}}</p>
        <p>当前角色:{{userInfo.role_name}}</p>
        <p>
          <el-select v-model="roleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRoleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义校验规则，正则匹配
    var checkEmail = (rule, value, callback) => {
      // 邮箱的验证规则
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        return callback()
      }
      // 返回一个错误信息
      callback(new Error('请输入正确的邮箱'))
    }
    var checkMobile = (rule, value, callback) => {
      // 手机验证规则
      const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的手机号码'))
    }
    return {
      queryList: {
        // 查询参数
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 2
      },
      // 用户表单数据对象
      userList: [],
      // 用户总数
      total: 0,
      // 是否显示用户添加对话框
      addUserBol: false,
      // 添加用户数据
      addForm: {
        username: '',
        password: '',
        mobile: '',
        email: ''
      },
      // 添加用户校验规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, max: 15, message: '长度在 8 到 15 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      // 编辑用户对话框显示与隐藏
      editUserBol: false,
      // 编辑用户数据
      editForm: {
        username: '',
        mobile: '',
        email: ''
      },
      // 编辑用户校验规则
      editFormRules: {
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      // 分配角色对话框显示
      assignRoleVisible: false,
      // 分配角色数据
      userInfo: {},
      // 角色列表
      rolesList: [],
      // 角色选择id
      roleId: ''
    }
  },
  methods: {
    // 获取用户信息
    async getListInfo() {
      const { data: res } = await this.$http.get('/users', {
        params: this.queryList
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户信息失败')
      }
      this.userList = res.data.users
      this.total = res.data.total
      console.log('---------------')
      console.log(this.userList)
    },
    handleSizeChange(val) {
      this.queryList.pagesize = val
      this.getListInfo()
    },
    handleCurrentChange(val) {
      this.queryList.pagenum = val
      this.getListInfo()
    },
    // 修改用户状态
    async userStateChanged(userInfo) {
      const { data: res } = await this.$http.put(
        `/users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改用户状态失败')
      }
      this.$message.success('修改用户状态成功')
    },
    // 用户搜索
    searchUserList() {
      this.getListInfo()
    },
    // 添加用户对话框取消
    addFormClosed() {
      this.$refs.addFormRef.resetFields()
      this.addUserBol = false
    },
    // 添加用户对话框确认
    addUser() {
      // 对表单进行校验
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post('/users', this.addForm)
          if (res.meta.status !== 201) {
            this.$message.error('添加用户失败')
          }
          // 弹出成功消息框
          this.$message.success('添加用户成功')
          // 关闭对话框
          this.addUserBol = false
          // 刷新数据
          this.getListInfo()
        }
      })
    },
    // 查询编辑用户信息
    async editUserInfo(id) {
      // 显示对话框
      this.editUserBol = true
      // 根据id查询用户信息
      const { data: res } = await this.$http.get('/users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户信息失败')
      }
      // 将获取的数据填入表单
      this.editForm = res.data
      console.log(this.editForm)
    },
    // 编辑用户对话框取消
    editFormClosed() {
      // 重置用户信息
      this.$refs.editFormRef.resetFields()
      // 关闭对话框
      this.editUserBol = false
    },
    // 编辑用户对话框确认
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        // 发送ajax请求
        const { data: res } = await this.$http.put(
          '/users/' + this.editForm.id,
          {
            id: this.editForm.id,
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败')
        }
        // 关闭对话框
        this.editUserBol = false
        // 成功消息框
        this.$message.success('更新用户信息成功')
        // 刷新列表
        this.getListInfo()
      })
    },
    // 删除用户信息
    removeUserInfo(id) {
      // 返回一个promise对象
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('/users/' + id)
          if (res.meta.status !== 200) {
            return this.$message.error('删除用户失败')
          }
          this.$message.success('删除用户成功')
          this.editUserBol = false
          this.getListInfo()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 分配角色click
    async assignRoles(role) {
      this.userInfo = role
      const { data: res } = await this.$http.get('/roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
      this.assignRoleVisible = true
    },
    // 分配角色对话框确定
    async assignRoleConfirm() {
      // 判断是否有选择角色
      if (!this.roleId) {
        return this.$message.error('请选择角色')
      }
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.roleId
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('更新角色失败！')
      }
      this.$message.success('更新角色信息成功')
      this.getListInfo()
      this.assignRoleVisible = false
    },
    // 分配角色对话框关闭
    dialogClosed() {
      this.roleId = ''
      this.assignRoleVisible = false
    }
  },
  created() {
    this.getListInfo()
  }
}
</script>

<style lang="less" scoped>
</style>

<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加角色 -->
      <el-row class="addrole">
        <el-col>
          <el-button type="primary" @click="addRoles">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-row>
        <el-table :data="rolesList" style="width: 100%" border stripe>
          <!-- 展开列 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <!-- 行 -->
              <el-row
                v-for="(item1,i1) in scope.row.children"
                :key="i1"
                :class="['bdbottom',i1 === 0 ? 'bdtop' : '','expand-row']"
              >
                <!-- 一级权限 -->
                <el-col :span="5">
                  <el-tag closable @close="deleteRightByTag(scope.row,item1.id)">{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 二三级权限 -->
                <el-col :span="19">
                  <!-- 二级权限 -->
                  <el-row
                    v-for="(item2,i2) in item1.children"
                    :key="i2"
                    :class="[i2 === 0 ? '' : 'bdtop','expand-row']"
                  >
                    <el-col :span="6">
                      <el-tag
                        type="success"
                        closable
                        @close="deleteRightByTag(scope.row,item2.id)"
                      >{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag
                        type="warning"
                        v-for="(item3,i3) in item2.children"
                        :key="i3"
                        closable
                        @close="deleteRightByTag(scope.row,item3.id)"
                      >{{item3.authName}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <!-- 索引列 -->
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="roleName" label="角色名称"></el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editRole(scope.row.id)"
              >编辑</el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteRole(scope.row.id)"
              >删除</el-button>
              <el-button
                type="warning"
                icon="el-icon-share"
                size="mini"
                @click="showSetRightDialog(scope.row)"
              >分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addRolesVisible" width="50%">
      <el-form :model="rolesForm" :rules="rolesFormrules" ref="rolesFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="rolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="rolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesVisible = false" @close="rolesFormClosed">取 消</el-button>
        <el-button type="primary" @click="rolesFormCurrent">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editRolesVisible">
      <el-form ref="editformRef" :model="editform" label-width="80px" :rules="rolesFormrules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editform.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editform.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleCurrent">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配权限" :visible.sync="assignRightVisible" width="50%">
      <!-- 树 -->
      <el-tree
        :data="rightsListTree"
        :props="rightsTreeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="TreeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignRightVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getRolesList()
  },
  data() {
    return {
      // 角色列表
      rolesList: [],
      // 添加角色对话框
      addRolesVisible: false,
      // 添加角色数据
      rolesForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色校验
      rolesFormrules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { max: 15, min: 2, message: '输入2-15个字符', trigger: 'blur' }
        ]
      },
      // 编辑角色对话框
      editRolesVisible: false,
      // 编辑角色数据
      editform: {
        roleName: '',
        roleDesc: ''
      },
      // 编辑角色id
      editfromID: '',
      // 分配权限对话框
      assignRightVisible: false,
      // 权限列表树形结构数据
      rightsListTree: [],
      // 树形结构children，label指定
      rightsTreeProps: {
        children: 'children',
        label: 'authName'
      },
      // 设置树形结构默认选中的内容
      defKeys: [],
      // 分配权限当前角色的id
      roleId: ''
    }
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('/roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
    },
    // 添加角色按钮点击事件
    addRoles() {
      this.addRolesVisible = true
    },
    // 关闭添加角色对话框事件
    rolesFormClosed() {
      this.$refs.rolesFormRef.resetFields()
    },
    // 确认添加角色对话框点击事件
    rolesFormCurrent() {
      this.$refs.rolesFormRef.validate(async val => {
        if (val) {
          const { data: res } = await this.$http.post('/roles', this.rolesForm)
          if (res.meta.status !== 201) {
            return this.$message.error('添加角色失败')
          }
          this.$message.success('添加角色成功')
          this.getRolesList()
          this.$refs.rolesFormRef.resetFields()
          this.addRolesVisible = false
        } else {
          return this.$message.error('校验信息失败')
        }
      })
    },
    // 删除角色click事件
    deleteRole(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('/roles/' + id)
          if (res.meta.status !== 200) {
            return this.$message.error('删除角色失败')
          }
          this.$message.success('删除角色成功')
          this.getRolesList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 编辑角色click事件
    async editRole(id) {
      const { data: res } = await this.$http.get('/roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色数据失败')
      }
      this.editfromID = res.data.roleId
      this.editform = res.data
      this.editRolesVisible = true
    },
    // 编辑角色对话框确认点击
    async editRoleCurrent() {
      const { data: res } = await this.$http.put(
        '/roles/' + this.editfromID,
        this.editform
      )
      if (res.meta.status !== 200) {
        return this.$message.error('编辑角色信息失败')
      }
      this.$message.success('编辑角色成功')
      this.getRolesList()
      this.editRolesVisible = false
    },
    // 通过tag删除角色权限
    async deleteRightByTag(scope, rightId) {
      const { data: res } = await this.$http.delete(
        `roles/${scope.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色权限失败')
      }
      // 将api返回的data赋值给scope.children从而无需再重新加载所有权限
      scope.children = res.data
      this.$message.success('删除角色权限成功')
    },
    // 分配角色click事件
    async showSetRightDialog(row) {
      this.roleId = row.id
      this.defKeys = []
      const { data: res } = await this.$http.get('/rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.rightsListTree = res.data
      this.getLeafKeys(row, this.defKeys)
      this.assignRightVisible = true
    },
    // 分配角色对话框确认按钮click事件
    async allotRights() {
      const keys = [
        ...this.$refs.TreeRef.getCheckedKeys(),
        ...this.$refs.TreeRef.getHalfCheckedKeys()
      ]
      const idKeysString = keys.join(',')
      const { data: res } = await this.$http.post(
        `/roles/${this.roleId}/rights`,
        {
          rids: idKeysString
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('分配角色权限失败')
      }
      this.$message.success('分配权限成功！')
      this.getRolesList()
      // 关闭对话框
      this.assignRightVisible = false
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    getLeafKeys(node, arr) {
      // 如果当前 node 节点不包含 children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.bdtop {
  border-top: 1px solid #eee;
}

.expand-row {
  display: flex;
  align-items: center;
}

.addrole {
  margin-bottom: 10px;
}
</style>

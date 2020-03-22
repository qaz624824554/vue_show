<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/yeshou.jpeg" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出登录</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="toggleFlag ? '64px' : '200px'">
        <!-- 侧边栏伸缩按钮 -->
        <div class="toggle-button" @click="toggleChange">| | |</div>
        <!-- 菜单 -->
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#37A0FB"
          :unique-opened="true"
          router
          :collapse="toggleFlag"
          :collapse-transition="false"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="'/' + item.path" v-for="item in menusInfo" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path + ''" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
              <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    // 退出btn
    logout() {
      window.sessionStorage.clear()
      this.$message.success('退出成功')
      this.$router.push('/login')
    },
    // 获取菜单列表
    async getMenuList() {
      const { data: res } = await this.$http.get('/menus')
      this.menusInfo = res.data
    },
    // 侧边栏伸缩按钮事件
    toggleChange() {
      this.toggleFlag = !this.toggleFlag
    },
    // 二级菜单高亮
    saveNavState(path) {
      window.sessionStorage.setItem('activePath', path)
      this.activePath = path
    }
  },
  // data数据
  data() {
    return {
      menusInfo: null,
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      toggleFlag: false,
      activePath: ''
    }
  },
  // 生命周期
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  }
}
</script>

<style lang="less" scoped>
.el-container {
  width: 100%;
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    img {
      width: 62px;
      height: 62px;
    }
    span {
      margin-left: 16px;
    }
  }
}

.el-aside {
  background-color: #333744;
}

.el-main {
  background-color: #eaedf1;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 12px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  color: #fff;
  cursor: pointer;
}
</style>

<template>
  <div class="app-wrapper">
    <div class="side-container" :class="collapsed ? 'folded' : 'unfolded'">
      <div class="logo">
        <h2 href="/">
          后台管理系统
        </h2>
      </div>
      <SideMenu />
    </div>
    <div class="main-container" :class="collapsed ? 'wider' : 'normal'">
      <div class="main-header">
        <HeaderBar />
        <TagsNav />
      </div>
      <div class="main-content">
        <el-scrollbar wrap-class="scrollbar">
          <MainView />
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import HeaderBar from './components/HeaderBar/index'
import SideMenu from './components/SideMenu/index'
import TagsNav from './components/TagsView/index'
import MainView from './components/MainView/index'
import Logo from '@/assets/img/logo.png'
import LogoIcon from '@/assets/img/logo-icon.png'

const RESIZE_WIDTH = 1440

export default {
  name: 'Layout',
  components: { HeaderBar, SideMenu, TagsNav, MainView },
  computed: {
    ...mapGetters('app', ['collapsed']),
    imgSrc() {
      if (this.collapsed) {
        return LogoIcon
      }
      return Logo
    }
  },
  created() {
    this.handleResize()
  },
  beforeMount() {
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    ...mapMutations('app', ['openSideMenu', 'closeSideMenu']),
    handleResize() {
      const width = document.body.getBoundingClientRect().width
      if (width <= RESIZE_WIDTH) {
        this.closeSideMenu()
      } else {
        this.openSideMenu()
      }
    }
  }
}
</script>

<style lang="less">
@import "../assets/less/scroll-bar";
.app-wrapper{
  width: 100%;
  height: 100%;
  overflow: hidden;
  .side-container{
    float: left;
    height: 100vh;
    transition: width 0.5s;
    background-color: #263238;
    &.unfolded {
      width: 200px;
      .logo {
        width: 200px;
        height: 64px;
        transition: all 0.5s;
      }
    }
    &.folded {
      width: 64px;
      .logo {
        width: 64px;
        height: 64px;
        padding: 10px;
        box-sizing: border-box;
        transition: all 0.5s;
      }
    }
    h2 {
      display: block;
      width: 100%;
      height: 100%;
      color: #fff;
      font-weight: 500;
      font-size: 15px;
      text-align: center;
      vertical-align: center;
      line-height: 64px;
    }
  }
  .main-container{
    float: left;
    height: 100vh;
    transition: width 0.5s;
    &.normal {
      width: calc(100% - 200px);
    }
    &.wider {
      width: calc(100% - 64px);
    }
    .main-content{
      .el-scrollbar{
        height: calc(100vh - 64px - 40px);
        .scroll-bar;
        .scrollbar{
          height: 100%;
          overflow-x: hidden;
        }
      }
    }
  }
}
</style>

<template>
  <div class="container">
    <span v-for="(item,index) in allTreeList" :key="index"  class="routeList-box">
      <el-tree
          v-loading="loading"
          ref="tree"
          class="el-tree"
          show-checkbox
          :expand-on-click-node="false"
          node-key="id"
          :indent="0"
          :data="[item]"
          :props="defaultProps"
          :highlight-current="true"
          :default-expand-all="true"
          :render-content="renderContent"
          @node-expand="handleExpand"
      >
      </el-tree>
    </span>
  </div>
</template>

<script>
import {getRoleFuncInit} from "@/api/role";

export default {
  data() {
    return {
      loading: false,
      allTreeList:[],
      defaultProps: {
        children: 'children',
        label: 'funcName',
      }
    }
  },
  async created() {
     this.fetchData();
  },
  methods:{
     fetchData(){
      const  roleId = this.$route.params.id;
      this.loading = true;
      getRoleFuncInit(roleId).then(res=>{
         this.allTreeList = res.result.allTreeList;
        this.$nextTick(() => {
          this.changeCss()
        })
      }).finally(()=>{
        this.loading = false;
      })
    },
    handleExpand() {
      this.$nextTick(() => {
        this.changeCss()
      })
    },
    renderContent(h, { node, data, store }) {
      let classname = '';
      let icon = data.funcType === 'dir' ? 'el-icon-folder-opened' : 'el-icon-document';

      // 根据展开状态选择图标
      if (node.isLeaf) {
        icon = 'el-icon-document';
      } else if (node.expanded) {
        icon = 'el-icon-folder-opened';
      } else {
        icon = 'el-icon-folder';
      }

      // 根据节点层级判断是否应用样式或图标
      if (node.level === 4) {
        classname = 'foo';
      } else if (node.level === 3 && node.childNodes.length === 0) {
        classname = 'foo';
      }

      // 渲染图标和文本
      return h(
          'p',
          { class: classname },
          [
            h('i', { class: icon }),  // 图标元素
            h('span', node.label)     // 节点标签
          ]
      );
    },
    changeCss() {
      const levelName = document.getElementsByClassName('foo');
      for (let i = 0; i < levelName.length; i++) {
        levelName[i].parentNode.style.cssFloat = 'left';
        levelName[i].parentNode.style.styleFloat = 'left';
        levelName[i].parentNode.onmouseover = function() {
          this.style.backgroundColor = '#fff'
        }
      }
    }
  }
};
</script>

<style scoped lang="less">
// 树样式
.el-tree {
  ::v-deep .el-tree-node {
    position: relative;
    padding-left: 20px; // 缩进量
  }
  ::v-deep .el-tree-node__children {
    padding-left: 20px; // 缩进量
  }

  // 竖线
  ::v-deep .el-tree-node::before {
    content: "";
    height: 100%;
    width: 1px;
    position: absolute;
    left: -3px;
    top: -26px;
    border-width: 1px;
    border-left: 1px dashed #ccc;
  }

  // 当前层最后⼀个节点的竖线⾼度固定
  ::v-deep .el-tree-node:last-child::before {
    height: 38px; // 可以⾃⼰调节到合适数值
  }

  // 横线
  ::v-deep .el-tree-node::after {
    content: "";
    width: 24px;
    height: 20px;
    position: absolute;
    left: -3px;
    top: 12px;
    border-width: 1px;
    border-top: 1px dashed #ccc;
  }

  // 去掉最顶层的虚线，放最下⾯样式才不会被上⾯的覆盖了
  & > ::v-deep .el-tree-node::after {
    border-top: none;
  }

  & > ::v-deep .el-tree-node::before {
    border-left: none;
  }

  // 展开关闭的icon
  ::v-deep .el-tree-node__expand-icon {
    font-size: 16px;

    // 叶⼦节点（⽆⼦节点）
    ::v-deep &.is-leaf {
      color: transparent;
       //display: none; // 也可以去掉
    }
  }
}
</style>

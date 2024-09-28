<template>
  <div class="container" v-loading="loading">
    <div class="header">
      <div class="role-info">
        {{roleName}}：
        <span class="user-info">{{userList.map(e=>e.realName).join(',')}}</span>
      </div>
      <div class="button-wrapper" style="display: flex; align-items: center; margin-left: auto;">
        <el-button type='primary' @click="handleSave">保存</el-button>
        <el-button type="info" @click="$router.push('/auth/role')">返回</el-button>
      </div>
    </div>
    <span v-for="(item,index) in allTreeList" :key="index"  class="routeList-box">
      <el-tree
          :ref="'tree' + index"
          class="el-tree"
          show-checkbox
          :expand-on-click-node="false"
          node-key="funcId"
          :indent="0"
          :default-checked-keys="funcIdList"
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
import {getRoleFuncInit, roleFuncUpdate, roleFuncUpdateCheck} from "@/api/role";

export default {
  data() {
    return {
      loading: false,
      allTreeList:[],
      funcIdList: [],
      roleName: '',
      roleId: null,
      userList: [],
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
    handleSave() {
      let allCheckedNodes = [];
      let allHalfCheckedNodes = [];

      // 遍历所有 `el-tree` 组件的 ref
      this.allTreeList.forEach((item, index) => {
        const treeRef = this.$refs['tree' + index];
        if (treeRef && treeRef[0]) {  // 由于 `ref` 是数组形式，需要取第一个元素
          // 获取勾选的节点
          const checkedNodes = treeRef[0].getCheckedNodes();
          allCheckedNodes = allCheckedNodes.concat(checkedNodes);

          // 获取半选的节点
          const halfCheckedNodes = treeRef[0].getHalfCheckedNodes();
          allHalfCheckedNodes = allHalfCheckedNodes.concat(halfCheckedNodes);
        }
      });
      // 处理勾选的节点，例如提取 ID 列表
      const checkedFuncIds = allCheckedNodes.map(node => node.funcId);
      const halfCheckedFuncIds = allHalfCheckedNodes.map(node => node.funcId);

      const funcIdList = [...checkedFuncIds, ...halfCheckedFuncIds];
      roleFuncUpdateCheck({roleId: this.roleId, funcIdList}).then(res=>{
        const insertList = res.result.insertList;
        const delList = res.result.delList;

        // 提示新增和删除功能的列表
        const insertStr = insertList.length > 0 ? insertList.map(item => item.funcName).join(', ') : '无';
        const delStr = delList.length > 0 ? delList.map(item => item.funcName).join(', ') : '无';

        // 使用 Element UI 弹框提示
        this.$alert(
            `<strong>新增功能:</strong> ${insertStr}<br><strong>删除功能:</strong> ${delStr}`,
            '操作结果',
            {
              dangerouslyUseHTMLString: true,
              confirmButtonText: '确定',
              type: 'warning',
            }
        ).then(res=>{
          this.loading = true;
          roleFuncUpdate({roleId: this.roleId, funcIdList}).then(res=>{
            this.$message.success('分配功能成功！');
          }).finally(res=>{
            this.loading = false;
          })
        });
      })

    },
     fetchData(){
      const  roleId = this.$route.params.id;
      this.loading = true;
      getRoleFuncInit(roleId).then(res=>{
         this.allTreeList = res.result.allTreeList;
         this.roleName = res.result.roleName;
         this.roleId = res.result.roleId;
         this.userList = res.result.userList;
         this.funcIdList = res.result.funcIdList;
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
      let icon = '';


      // 根据节点层级判断是否应用样式或图标
      if (data.funcType === 'btn') {
        classname = 'foo';
        icon = 'el-icon-document';
      }else {
        if (node.expanded) {
          icon = 'el-icon-folder-opened';
        } else {
          icon = 'el-icon-folder';
        }
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
.header {
  display: flex; /* 使用 Flexbox 布局 */
  align-items: flex-start; /* 对齐方式 */
  margin-bottom: 10px; /* 角色信息和按钮之间的间距 */
}

.role-info {
  flex: 1;
  margin-right: 20px;
  font-weight: 600;
}
.user-info{
  font-size: 12px;
  margin-right: 5px;
  color:#2d8cf0;
  font-weight: normal;
  cursor: pointer;
  width: 50%;
  overflow: hidden;
  display: inline-block;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: bottom;
}
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

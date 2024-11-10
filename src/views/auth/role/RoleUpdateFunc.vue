<template>
  <div class="container" v-loading="loading">
    <div class="header">
      <div class="role-info" @click="showRoleList">
        {{ roleName }}：
        <span class="user-info">{{ userList.map(e => e.realName).join(', ') }}</span>
      </div>
      <div class="button-wrapper" style="display: flex; align-items: center; margin-left: auto;">
        <el-button type='primary' @click="handleSave">保存</el-button>
        <el-button type="info" @click="backToList">返回</el-button>
      </div>
    </div>

    <span v-for="(item, index) in allTreeList" :key="index" class="routeList-box">
      <el-tree
              :ref="'tree' + index"
              class="el-tree"
              show-checkbox
              :expand-on-click-node="false"
              node-key="funcId"
              :indent="0"
              :data="[item]"
              :props="defaultProps"
              :highlight-current="true"
              :default-expand-all="true"
              :render-content="renderContent"
              @node-expand="handleExpand"
      />
    </span>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
  import {getRoleFuncInit, roleFuncUpdate, roleFuncUpdateCheck} from "@/api/auth";

  export default {
    name: 'RoleFuncUpdate',
    data() {
      return {
        loading: false,
        allTreeList: [],
        funcIdList: [],
        roleName: '',
        roleId: null,
        userList: [],
        defaultProps: {
          children: 'children',
          label: 'funcName',
        },
      };
    },
    async created() {
      await this.fetchData();
    },
    methods: {
      ...mapMutations(['delVisitedView']),
      showRoleList(){
        this.$alert(
            this.userList.map(e => e.realName).join(', '),
            '用户列表',
            {
              dangerouslyUseHTMLString: true,
              confirmButtonText: '确定',
              type: 'info',
            }
        );
      },
      async handleSave() {
        const allCheckedNodes = [];
        const allHalfCheckedNodes = [];

        // 遍历所有 `el-tree` 组件的 ref
        this.allTreeList.forEach((_, index) => {
          const treeRef = this.$refs[`tree${index}`]?.[0];
          if (treeRef) {
            allCheckedNodes.push(...treeRef.getCheckedNodes());
            allHalfCheckedNodes.push(...treeRef.getHalfCheckedNodes());
          }
        });

        const funcIdList = [...new Set([
          ...allCheckedNodes.map(node => node.funcId),
          ...allHalfCheckedNodes.map(node => node.funcId),
        ])];

        const { result } = await roleFuncUpdateCheck({ roleId: this.roleId, funcIdList });
        const insertStr = result.insertList.length ? result.insertList.map(item => item.funcName).join(', ') : '';
        const delStr = result.delList.length ? result.delList.map(item => item.funcName).join(', ') : '';

        // 如果新增和删除都为空，则不弹窗或显示提示
        if (insertStr || delStr) {
          const message = `
              ${insertStr ? `<strong style="color: green">${insertStr}</strong> <br>` : ''}
              ${delStr ? `<strong style="color: red">${delStr}</strong> ` : ''}
            `;

           await this.$alert(
               message,
               '操作结果',
               {
                 dangerouslyUseHTMLString: true,
                 confirmButtonText: '确定',
                 type: 'warning',
               }
           );

          this.loading = true;
          try {
            await roleFuncUpdate({ roleId: this.roleId, funcIdList }).then(async () => {
              this.backToList();
            });
          } finally {
            this.loading = false;
          }
        } else {
          // 可选：如果没有任何变化，显示默认提示
          await this.$alert(
              '您当前的操作，没有功能变更！',
              '操作结果',
              {
                dangerouslyUseHTMLString: false,
                confirmButtonText: '确定',
                type: 'warning',
              }
          ).then(()=>{
            this.backToList();
          });
        }
      },

      async fetchData() {
        const roleId = this.$route.query.roleId;
        this.loading = true;

        try {
          const { result } = await getRoleFuncInit(roleId);
          this.allTreeList = result.allTreeList;
          this.roleName = result.roleName;
          this.roleId = roleId;
          this.userList = result.userList;
          this.funcIdList = result.funcIdList;

          await this.$nextTick();
          this.changeCss();

          // 回显子节点
          this.allTreeList.forEach((item, index) => {
            const treeRef = this.$refs[`tree${index}`]?.[0];
            if (treeRef) {
              const parentIdList = this.getParentIds([item]);
              const childrenIdList = this.funcIdList.filter(id => !parentIdList.includes(id));
              treeRef.setCheckedKeys(childrenIdList);
            }
          });
        } catch (error) {
          console.error('Failed to fetch data:', error);
        } finally {
          this.loading = false;
        }
      },

      getParentIds(item) {
        const parentIdsSet = new Set();

        const traverse = (nodes) => {
          nodes.forEach(node => {
            if (node.parentId !== null) {
              parentIdsSet.add(node.parentId);
            }
            if (node.children) {
              traverse(node.children);
            }
          });
        };

        traverse(item);
        return Array.from(parentIdsSet);
      },

      handleExpand() {
        this.$nextTick(this.changeCss);
      },

      renderContent(h, { node, data }) {
        const icon = data.funcType === 'btn' ? 'el-icon-document' : (node.expanded ? 'el-icon-folder-opened' : 'el-icon-folder');
        return h(
                'p',
                { class: data.funcType === 'btn' ? 'foo' : '' },
                [h('i', { class: icon }), h('span', node.label)]
        );
      },

      changeCss() {
        const levelName = document.getElementsByClassName('foo');
        Array.from(levelName).forEach(element => {
          element.parentNode.style.cssFloat = 'left';
          element.parentNode.style.styleFloat = 'left';
        });
      },
      backToList(){
        this.delVisitedView(this.$route);
        this.$router.push('/auth/role')
      }
    },
  };
</script>

<style scoped lang="less">
  .header {
    display: flex;
    align-items: flex-start;
    margin-bottom: 10px;
  }

  .role-info {
    flex: 1;
    margin-right: 20px;
    font-weight: 600;
  }

  .user-info {
    font-size: 12px;
    margin-right: 5px;
    color: #2d8cf0;
    font-weight: normal;
    cursor: pointer;
    width: 50%;
    overflow: hidden;
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align: bottom;
  }

  .el-tree {
    ::v-deep .el-tree-node {
      position: relative;
      padding-left: 20px;
    }
    ::v-deep .el-tree-node__children {
      padding-left: 20px;
    }
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
    ::v-deep .el-tree-node:last-child::before {
      height: 38px;
    }
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
    & > ::v-deep .el-tree-node::after {
      border-top: none;
    }
    & > ::v-deep .el-tree-node::before {
      border-left: none;
    }
    ::v-deep .el-tree-node__expand-icon {
      font-size: 16px;
      ::v-deep &.is-leaf {
        color: transparent;
      }
    }
  }
</style>

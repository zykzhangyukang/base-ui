<template>
  <div class="table-func-wrapper">
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="search-input-wrapper">
          <el-input
              placeholder="输入关键字进行过滤"
              v-model="filterText"
              clearable
              size="mini">
          </el-input>
        </div>
        <div class="tree-wrapper">
          <el-tree
              ref="funcTree"
              :data="treeData"
              :props="defaultProps"
              @node-click="handleNodeClick"
              :filter-node-method="filterNode"
              :highlight-current="false"
              v-loading="treeLoading"
              :default-expanded-keys="defaultExpandedKeys"
              :expand-on-click-node="false"
              node-key="funcId"
          >
            <template #default="{ node, data }">
              <span class="custom-tree-node" :id="'customer-tree-node-'+data.funcId">
                <el-icon
                    v-if="data.funcType === 'dir' && !node.expanded"
                    class="el-icon-folder icon">
                </el-icon>
                <el-icon
                    v-if="data.funcType === 'dir' && node.expanded"
                    class="el-icon-folder-opened icon">
                </el-icon>
                <el-icon
                    v-if="data.funcType === 'btn'"
                    class="el-icon-document icon">
                </el-icon>
                <span v-html="highlightText(node.label)"></span>
              </span>
            </template>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="20">
        <!-- 查询栏 -->
        <el-form :inline="true" :model="searchForm" class="searchForm" ref="searchForm">
          <el-form-item label="功能名称" prop="funcName">
            <el-input v-model="searchForm.funcName" placeholder="功能名称"></el-input>
          </el-form-item>
          <el-form-item label="功能标识" prop="funcKey">
            <el-input v-model="searchForm.funcKey" placeholder="功能标识"></el-input>
          </el-form-item>
          <el-form-item label="资源url" prop="rescUrl">
            <el-input v-model="searchForm.rescUrl" placeholder="资源url"></el-input>
          </el-form-item>
          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker
                :clearable="false"
                v-model="searchForm.startTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择开始时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker
                v-model="searchForm.endTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                default-time="23:59:59"
                placeholder="选择结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="功能类型" prop="funcType">
            <el-select v-model="searchForm.funcType" placeholder="功能类型" clearable :style="{width : '180px'}">
              <el-option :label="funcTypeGName[item.code]" v-for="item in funcTypeG" :value="item.code" :key="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否显示" prop="hide">
            <el-select v-model="searchForm.hide" placeholder="是否显示" clearable :style="{width : '180px'}">
              <el-option :label="funcHideGName[item.code]" v-for="item in funcHideG" :value="item.code" :key="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onSubmit" :loading="loading" v-permission="'auth_func_page'">查询
            </el-button>
            <el-button type="info" icon="el-icon-refresh-right" @click="resetForm('searchForm')">重置</el-button>
            <el-button type="success" icon="el-icon-plus" @click="handleAdd" v-permission="'auth_func_add'">新增</el-button>
            <el-button plain @click="handleExcel" :loading="downloadLoading" v-permission="'auth_func_export'">导出列表</el-button>
            <el-button plain @click="positionTreeNode()">树中定位</el-button>
          </el-form-item>
          <el-form-item>
            <el-dropdown @command="handleCommand">
              <el-button>
                更多操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="clearResc" v-permission="'auth_func_resc_remove'">
                  <el-icon class="el-icon-folder-delete"></el-icon>
                  清空资源
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
        </el-form>
        <!-- 表格栏 -->
        <my-table
            border
            ref="tableList"
            v-loading="tableLoading"
            :data="tableData"
            @sort-change="sortChange"
            @selection-change="handleSelectionChange"
        >
          <el-table-column
              type="selection"
              width="55">
          </el-table-column>
          <el-table-column
              prop="funcName"
              label="功能名称"
              align="center"
          >
          </el-table-column>
          <el-table-column
              prop="funcKey"
              label="功能标识"
              align="center"
              show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
              prop="rescVOList"
              label="资源列表"
              align="center"
          >
            <template slot-scope="scope">
              <div class="ellipsis">
                <span class="ellipsis-button" @click="showRescVoList(scope.row.rescVOList)">
                  {{ scope.row.rescVOList.map(e => e.rescUrl).join(',') || '-' }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
              prop="funcType"
              label="功能类型"
              align="center"
          >
            <template slot-scope="scope">
              <el-icon v-if="scope.row.funcType === 'dir'" class="el-icon-folder-opened "></el-icon>
              <el-icon v-if="scope.row.funcType === 'btn'" class="el-icon-document "></el-icon>
              {{ funcTypeGName[scope.row.funcType] }}
            </template>
          </el-table-column>
          <el-table-column
              prop="hide"
              label="是否显示"
              align="center"
          >
            <template slot-scope="scope">
              {{ funcHideGName[scope.row.hide] }}
            </template>
          </el-table-column>
          <el-table-column
              prop="funcSort"
              label="排序"
              align="center"
              sortable
          >
          </el-table-column>
          <el-table-column
              prop="createTime"
              label="创建时间"
              align="center"
              sortable
          >
          </el-table-column>
          <el-table-column
              label="操作"
          >
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleUpdate(scope.row.funcId)"
                         v-permission="'auth_func_update'">编辑
              </el-button>
              <el-button size="mini" type="text" @click="handleDel(scope.row.funcId)" v-permission="'auth_func_delete'">
                删除
              </el-button>
            </template>
          </el-table-column>
        </my-table>
        <!-- 分页栏 -->
        <div class="pagination-wrapper">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="searchForm.currentPage"
              :page-sizes="[10, 15, 20, 50]"
              :page-size="searchForm.pageSize"
              layout="total, prev, pager, next, sizes, jumper"
              :total="total">
          </el-pagination>
        </div>
      </el-col>
    </el-row>

    <!-- 添加弹框 -->
    <func-add ref="addRef" @success="handAddSuccess"></func-add>
    <!-- 修改弹框 -->
    <func-update ref="updateRef" @success="handUpdateSuccess"></func-update>
    <!-- 资源列表 -->
    <func-resc ref="funcRescRef"></func-resc>
  </div>
</template>

<script>
import FuncAdd from "@/views/auth/func/FuncAdd.vue";
import FuncUpdate from "@/views/auth/func/FuncUpdate.vue";
import FuncResc from "@/views/auth/func/FuncResc.vue";
import MyTable from '@/components/MyTable/index'
import {deleteFunc, exportFuncList, exportRescList, funcRescRemove, getFuncPage, getFuncTree} from "@/api/auth";
import NProgress from "nprogress";

export default {
  name: 'FuncList',
  components: {
    FuncAdd,
    FuncUpdate,
    FuncResc,
    MyTable
  },
  data() {
    return {
      downloadLoading: false,
      filterText: '',
      treeData: [],
      defaultExpandedKeys: [],
      treeLoading: false,
      loading: false,
      defaultProps: {
        children: 'children',
        label: 'funcName',
      },
      searchForm: {
        currentPage: 1,
        pageSize: 20,
        funcName: '',
        funcKey: '',
        funcType: '',
        rescUrl: '',
        hide: null,
        startTime: null,
        endTime: null
      },
      // 数据总条数
      total: 0,
      // 表格数据数组
      multipleSelection: [],
      tableData: [],
      tableLoading: true,
      // 点击的树节点
      parentNode: null,
    };
  },
  watch: {
    filterText(val) {
      this.$refs.funcTree.filter(val);
    },
  },
  computed: {
    funcHideG() {
      return this.$getConst("func_hide_group")
    },
    funcHideGName() {
      return this.$formatConst(this.funcHideG);
    },
    funcTypeG() {
      return this.$getConst("func_type_group")
    },
    funcTypeGName() {
      return this.$formatConst(this.funcTypeG);
    },
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    showRescVoList(list) {
      this.$refs.funcRescRef.handleOpen(list);
    },
    handleDel(id) {
      this.$confirm('此操作将删除该功能, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFunc(id).then(res => {
          this.$message.success("删除成功！");
          this.onSubmit();
        })
      });
    },
    handAddSuccess() {
      this.onSubmit();
    },
    handUpdateSuccess() {
      this.onSubmit();
    },
    handleUpdate(id) {
      this.$refs.updateRef.handleOpen(id);
    },
    handleAdd() {
      this.$refs.addRef.handleOpen(this.parentNode);
    },
    handleExcel(){
      this.downloadLoading = true;
      NProgress.start();
      this.searchForm.idList = this.multipleSelection.map(e=>e.funcId);
      exportFuncList(this.searchForm).then(res=>{
        this.$downloadFile(res.data, 'xlsx', '资源列表')
        this.$message.success("导出成功！")
      }).finally(()=>{
        this.downloadLoading = false;
        NProgress.done();
      });
    },
    positionTreeNode() {
      if (this.multipleSelection.length !== 1) {
        return this.$message.warning("请勾选一条记录进行操作！");
      }
      const tree = this.$refs.funcTree;
      if (!tree) {
        return this.$message.error("树组件未正确绑定！");
      }
      const nodeId = this.multipleSelection[0].funcId;
      const targetNode = tree.getNode(nodeId);
      if (!targetNode) {
        return this.$message.error("无法找到指定节点！");
      }

      // 关闭所有已展开的节点
      this.closeAllNodes(tree.root);

      // 展开目标节点及其父节点
      this.expandParentNodes(targetNode);

      // 确保目标节点本身被展开
      if (!targetNode.expanded) {
        targetNode.expand();

        this.$nextTick(() => {
          this.highlightNodeById(nodeId);
        });
      }
    },
    clearNodeClassName(){
      const allNodes = this.$refs.funcTree.$el.querySelectorAll(".custom-highlight-node");
      allNodes.forEach((node) => node.classList.remove("custom-highlight-node"));
    },
    highlightNodeById(nodeId) {
      // 清除之前所有的高亮节点
      this.clearNodeClassName();

      // 获取目标节点的 DOM 元素
      const targetNodeElement = document.getElementById('customer-tree-node-' + nodeId);
      if (targetNodeElement) {
        targetNodeElement.classList.remove("custom-highlight-node");
        targetNodeElement.offsetHeight;
        targetNodeElement.classList.add("custom-highlight-node");
      }
    },
    // 递归关闭所有节点
    closeAllNodes(node) {
      if (node.expanded) {
        node.collapse();
      }
      if (node.childNodes) {
        node.childNodes.forEach(child => {
          this.closeAllNodes(child);
        });
      }
    },
    // 展开目标节点及其所有父节点
    expandParentNodes(node) {
      let currentNode = node.parent;
      while (currentNode && currentNode.level > 0) {
        if (!currentNode.expanded) {
          currentNode.expand();
        }
        currentNode = currentNode.parent;
      }
    },
    handleCommand(command) {
      if (command === 'clearResc') {
        if (this.multipleSelection.length !== 1) {
          return this.$message.warning("请勾选一条记录进行操作！");
        }
        let rowData = this.multipleSelection[0];
        this.$confirm('此操作将清空绑定的资源, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          funcRescRemove(rowData.funcId).then(res => {
            this.$message.success('清空资源成功！');
            this.fetchData();
          })
        });
      }
    },
    sortChange({prop, order}) {
      if (order) {
        this.searchForm.sortField = this.$toLine(prop);
        this.searchForm.sortType = order === 'ascending' ? 'asc' : 'desc';
      } else {
        this.searchForm.sortField = '';
        this.searchForm.sortType = '';
      }
      this.fetchData();
    },
    resetForm(formName) {
      this.parentNode = null;
      this.$refs[formName].resetFields();
    },
    onSubmit() {
      this.searchForm.currentPage = 1
      this.fetchData()
    },
    handleNodeClick(data) {
      this.clearNodeClassName();
      this.parentNode = data;
      this.onSubmit();
    },
    fetchTreeData() {
      this.treeLoading = true;
      getFuncTree()
          .then((res) => {
            this.treeData = res.result;
          })
          .catch((error) => {
            console.error("Failed to fetch tree data:", error);
          })
          .finally(() => {
            this.treeLoading = false;
          });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.funcName.indexOf(value) !== -1;
    },
    highlightText(text) {
      if (!this.filterText) return text;
      const regex = new RegExp(`(${this.filterText})`, 'gi');
      return text.replace(regex, '<span style="color: red;">$1</span>');
    },
    handleSizeChange(val) {
      this.searchForm.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.searchForm.currentPage = val;
      this.fetchData();
    },
    fetchData() {
      this.searchForm.idList = [];
      if (this.parentNode && this.parentNode.funcId) {
        this.searchForm.parentId = this.parentNode.funcId;
      } else {
        this.searchForm.parentId = null;
      }
      this.tableLoading = true;
      this.loading = true;
      getFuncPage(this.searchForm).then(res => {
        this.tableData = res.result.dataList;
        this.total = res.result.totalRow;
      }).finally(() => {
        this.tableLoading = false;
        this.loading = false;
      })
    },
  },
  created() {
    this.fetchTreeData();
    this.fetchData();
  },
};
</script>

<style scoped lang="less">
.tree-wrapper {
  height: calc(100vh - 200px);
  overflow-y: auto;
  position: relative;
  border-right: 1px solid #ebeef5;
}

.search-input-wrapper {
  margin-bottom: 10px;
}

.custom-tree-node .icon {
  margin-right: 5px;
  font-size: 17px;
}

/* 滚动条美化 */
.tree-wrapper::-webkit-scrollbar {
  width: 8px; /* 滚动条宽度 */
}

.tree-wrapper::-webkit-scrollbar-thumb {
  background-color: #c0c4cc;
  border-radius: 4px;
}

.tree-wrapper::-webkit-scrollbar-track {
  background-color: #f5f7fa;
  border-radius: 4px;
}

.pagination-wrapper {
  margin-top: 25px;

  .el-pagination {
    float: right;
  }
}

/* 容器和按钮均需要设置省略号效果 */
.ellipsis {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  cursor: pointer;
}

.ellipsis-button {
  display: inline-block;
  width: 100%; /* 保证按钮占满容器 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center; /* 如果需要文字对齐左边 */
  color: #2d8cf0;
}

.custom-highlight-node{
  animation-name: enterAnimation-jumpReply;
  animation-duration: 5s;
  animation-fill-mode: forwards;
}
@keyframes enterAnimation-jumpReply {
  0% {
    background-color: #dff6fb;
  }
  100% {
    background-color: #dff6fb00;
  }
}
</style>

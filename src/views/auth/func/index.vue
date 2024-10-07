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
              v-loading="loading"
              :default-expanded-keys="defaultExpandedKeys"
              :expand-on-click-node="false"
              node-key="funcId"
          >
            <template #default="{ node, data }">
              <span class="custom-tree-node">
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
            <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
            <el-button type="info" icon="el-icon-refresh-right" @click="resetForm('searchForm')">重置</el-button>
            <el-button type="success" icon="el-icon-plus" @click="handleAdd">新增</el-button>
          </el-form-item>
          <el-form-item>
            <el-dropdown @command="handleCommand">
              <el-button>
                更多操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="clearResc">
                  <el-icon class="el-icon-folder-delete"></el-icon>清空资源
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
            style="width: 100%"
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
              sortable
          >
          </el-table-column>
          <el-table-column
              prop="funcKey"
              label="功能标识"
              align="center"
              sortable
              show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
              prop="rescVOList"
              label="资源列表"
              align="center"
          >
            <template  slot-scope="scope">
              <div class="ellipsis">
                <el-button type="text" size="mini" class="ellipsis-button" @click="showRescVoList(scope.row.rescVOList)">
                  {{ scope.row.rescVOList.map(e => e.rescUrl).join(',') || '-' }}
                </el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column
              prop="funcType"
              label="功能类型"
              align="center"
              sortable
          >
            <template  slot-scope="scope">
              <el-icon v-if="scope.row.funcType === 'dir'" class="el-icon-folder-opened "></el-icon>
              <el-icon v-if="scope.row.funcType === 'btn'" class="el-icon-document "></el-icon>
              {{funcTypeGName[scope.row.funcType]}}
            </template>
          </el-table-column>
          <el-table-column
              prop="hide"
              label="是否显示"
              align="center"
              sortable
          >
            <template  slot-scope="scope">
              {{funcHideGName[scope.row.hide]}}
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
              align="center"
          >
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleUpdate(scope.row.funcId)">编辑</el-button>
              <el-button size="mini" type="text" @click="handleDel(scope.row.funcId)">删除</el-button>
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
import {adminDomain, formatConst, getConst, toLine} from "@/utils";
import FuncAdd from "@/views/auth/func/FuncAdd.vue";
import FuncUpdate from "@/views/auth/func/FuncUpdate.vue";
import FuncResc from "@/views/auth/func/FuncResc.vue";
import MyTable from '@/components/MyTable/index'
import {deleteFunc, funcRescRemove, getFuncPage, getFuncTree} from "@/api/auth";

export default {
  components: {
    FuncAdd,
    FuncUpdate,
    FuncResc,
    MyTable
  },
  data() {
    return {
      filterText: '',
      treeData: [],
      defaultExpandedKeys: [],
      loading: true,
      defaultProps: {
        children: 'children',
        label: 'funcName',
      },
      searchForm:{
        currentPage: 1,
        pageSize: 20,
        funcName: '',
        funcKey: '',
        funcType: '',
        rescUrl: '',
        hide: null,
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
  computed:{
    funcHideG(){
      return getConst("func_hide_group", adminDomain)
    },
    funcHideGName(){
      return formatConst(this.funcHideG);
    },
    funcTypeG(){
      return getConst("func_type_group", adminDomain)
    },
    funcTypeGName(){
      return formatConst(this.funcTypeG);
    },
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    showRescVoList(list){
      this.$refs.funcRescRef.handleOpen(list);
    },
    handleDel(id){
      this.$confirm('此操作将删除该功能, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFunc(id).then(res=>{
          this.$message.success("删除成功！");
          this.onSubmit();
        })
      });
    },
    handAddSuccess(){
      this.onSubmit();
    },
    handUpdateSuccess(){
      this.onSubmit();
    },
    handleUpdate(id){
      this.$refs.updateRef.handleOpen(id);
    },
    handleAdd(){
      this.$refs.addRef.handleOpen(this.parentNode);
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
    sortChange({prop, order }){
      if(order){
        this.searchForm.sortField = toLine(prop);
        this.searchForm.sortType = order === 'ascending' ? 'asc' : 'desc';
      }else {
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
      this.parentNode = data;
      this.onSubmit();
    },
    fetchTreeData() {
      this.loading = true;
      getFuncTree()
          .then((res) => {
            this.treeData = res.result;
          })
          .catch((error) => {
            console.error("Failed to fetch tree data:", error);
          })
          .finally(() => {
            this.loading = false;
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
      if(this.parentNode && this.parentNode.funcId){
        this.searchForm.parentId = this.parentNode.funcId;
      }else {
        this.searchForm.parentId = null;
      }
      this.tableLoading = true;
      getFuncPage(this.searchForm).then(res => {
        this.tableData = res.result.dataList;
        this.total = res.result.totalRow;
      }).finally(() => {
        this.tableLoading = false;
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

.pagination-wrapper{
  margin-top: 25px;
  .el-pagination{
    float: right;
  }
}

/* 容器和按钮均需要设置省略号效果 */
.ellipsis {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

</style>

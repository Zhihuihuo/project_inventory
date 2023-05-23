<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.pcode" placeholder="产品编码" style="width: 180px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.pname" placeholder="产品名称" style="width: 180px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.ptype" placeholder="产品型号" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in modelsOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-upload" @click="handleDownload">
        导入
      </el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row @sort-change="sortChange">
      <el-table-column label="产品编码" prop="code" sortable="custom" align="center" width="150px" :class-name="getSortClass('id')">
        <template slot-scope="scope">
          <span>{{ scope.row.pcode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品名称" align="center" width="150px">
        <template slot-scope="{row}">
          {{ row.pname }}
        </template>
      </el-table-column>
      <el-table-column label="产品型号" align="center" width="130px">
        <template slot-scope="{row}">
          <span>{{ row.ptype }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品规格" align="center" width="100px">
        <template slot-scope="{row}">
          <span>{{ row.pspec }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" width="149px">
        <template slot-scope="{row}">
          {{ row.desc }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchData" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="产品编码" prop="pcode">
          <el-col :span="15"><el-input v-model="temp.pcode" /></el-col>
        </el-form-item>
        <el-form-item label="产品名称" prop="pname">
          <el-col :span="15"><el-input v-model="temp.pname" /></el-col>
        </el-form-item>
        <el-form-item label="产品型号" prop="ptype">
          <el-col :span="15"><el-input v-model="temp.ptype" /></el-col>
        </el-form-item>
        <el-form-item label="产品规格" prop="pspec">
          <el-col :span="15"><el-input v-model="temp.pspec" /></el-col>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input v-model="temp.desc" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()"> 提交</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getList, createProduct, updateProduct } from '@/api/product'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  components: { Pagination },
  filters: {
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        pcode: undefined,
        pname: undefined,
        ptype: undefined,
        sort: '+id'
      },
      temp: {
        id: undefined,
        pcode: '',
        pname: '',
        ptype: '',
        pspec: '',
        desc: '',
        timestamp: new Date()
      },
      modelsOptions: ['X710', 'X720', 'X730', 'X740', 'X750'],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        pcode: [{ required: true, message: 'code is required', trigger: 'change' }],
        pname: [{ required: true, message: 'phone is required', trigger: 'blur' }],
        ptype: [{ required: true, message: 'city is required', trigger: 'blur' }],
        pspec: [{ required: true, message: 'address is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },

    // 弹出添加框
    resetTemp() {
      this.temp = {
        id: undefined,
        pcode: '',
        pname: '',
        ptype: '',
        pspec: '',
        desc: '',
        timestamp: new Date()
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          createProduct(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateProduct(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['产品编码', '产品名称', '产品型号', '产品规格', '备注']
        const filterVal = ['pcode', 'pname', 'ptype', 'pspec', 'desc']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '产品列表'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },

    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>

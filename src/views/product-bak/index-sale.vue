<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.code" placeholder="产品编码" style="width: 180px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.name" placeholder="产品名称" style="width: 180px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.models" placeholder="产品型号" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in modelsOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row  @sort-change="sortChange">
      <el-table-column label="产品编码" prop="code" sortable="custom" align="center" width="160px" :class-name="getSortClass('id')">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品名称" align="center" width="160px">
        <template slot-scope="{row}">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column label="产品型号" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.models }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品规格" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.spec }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center" width="130px">
        <template slot-scope="{row}">
          {{ row.count }}{{ row.unit }}
        </template>
      </el-table-column>
      <el-table-column label="价格" align="center" width="130px">
        <template slot-scope="{row}">
          {{ row.price }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="149" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            销售下单
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchData" />
  </div>
</template>


<script>
import { getList, updateProduct } from '@/api/product'
import waves from '@/directive/waves' // waves directive
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
        code: undefined,
        name: undefined,
        models: undefined,
        sort: '+id'
      },
      modelsOptions: ['X710','X720','X730','X740','X750'],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        code: [{ required: true, message: 'code is required', trigger: 'change' }],
        name: [{ required: true, message: 'phone is required', trigger: 'blur' }],
        models: [{ required: true, message: 'city is required', trigger: 'blur' }],
        spec: [{ required: true, message: 'address is required', trigger: 'blur' }],
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
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
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
        const tHeader = ['产品编码', '产品名称', '产品型号', '产品规格','单位','数量','备注']
        const filterVal = ['code', 'name', 'models', 'spec','unit','count','desc']
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

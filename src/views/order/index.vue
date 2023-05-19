<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.order_date" placeholder="订单日期" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.order_code" placeholder="订单编号" style="width: 150px;margin-left: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.customer_name" placeholder="客户名称" style="width: 100px;margin-left: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.order_status" placeholder="订单状态" clearable style="width: 150px;margin-left: 10px;" class="filter-item">
        <el-option v-for="item in orderStatusOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row @sort-change="sortChange">
      <el-table-column label="订单日期" align="center" width="160px" sortable="custom" :class-name="getSortClass('id')">
        <template slot-scope="scope">
          {{ scope.row.order_date }}
        </template>
      </el-table-column>
      <el-table-column label="订单编号" prop="order_code" align="center" width="160px">
        <template slot-scope="{row}">
          <span>{{ row.order_code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户名称" align="center" width="100px">
        <template slot-scope="{row}">
          {{ row.customer_name }}
        </template>
      </el-table-column>
      <el-table-column label="订单金额" align="center" width="90px">
        <template slot-scope="{row}">
          {{ row.order_price }}
        </template>
      </el-table-column>
      <el-table-column label="业务员" align="center" width="100px">
        <template slot-scope="{row}">
          {{ row.sale_name }}
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" width="200px">
        <template slot-scope="{row}">
          {{ row.order_status }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" @click="handleUpdate(row)">
            详细
          </el-button>
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
        <el-form-item label="订单日期" prop="pcode">
          <el-col :span="15"><el-input v-model="temp.order_date" /></el-col>
        </el-form-item>
        <el-form-item label="订单编码" prop="pcode">
          <el-col :span="15"><el-input v-model="temp.order_code" /></el-col>
        </el-form-item>
        <el-form-item label="订单金额" prop="pname">
          <el-col :span="15"><el-input v-model="temp.order_price" /></el-col>
        </el-form-item>
        <el-form-item label="客户名称" prop="ptype">
          <el-col :span="15"><el-input v-model="temp.customer_name" /></el-col>
        </el-form-item>
        <el-form-item label="业务员" prop="ptype">
          <el-col :span="15"><el-input v-model="temp.sale_name" /></el-col>
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
import { getList, createOrder, updateOrder } from '@/api/order'
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
        order_date: undefined,
        order_code: undefined,
        order_status: undefined,
        customer_name: undefined,
        sale_name: undefined,
        sort: '+id'
      },
      temp: {
        id: undefined,
        order_date: new Date(),
        order_code: '',
        order_price: '',
        customer_name: '',
        desc: ''
      },
      orderStatusOptions: ['已提交，待付款', '已付款，待发货', '已发货，待收货', '已收货'],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        order_date: [{ required: true, message: 'order_date is required', trigger: 'change' }],
        order_code: [{ required: true, message: 'order_code is required', trigger: 'blur' }],
        order_price: [{ required: true, message: 'order_price is required', trigger: 'blur' }],
        customer_name: [{ required: true, message: 'customer_name is required', trigger: 'blur' }]
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
        order_date: new Date(),
        order_code: undefined,
        order_price: undefined,
        customer_name: undefined
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
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          createOrder(this.temp).then(() => {
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
          updateOrder(tempData).then(() => {
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
        const tHeader = ['订单日期', '订单编号', '订单金额', '客户名称', '业务员', '订单状态']
        const filterVal = ['order_date', 'order_code', 'order_price', 'customer_name', 'sale_name', 'order_status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '订单列表'
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

<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="form" label-width="120px">
      <el-form-item label="产品编码" prop="pcode">
        <el-col :span="15"><el-input v-model="form.pcode" /></el-col>
      </el-form-item>
      <el-form-item label="产品名称" prop="pname">
        <el-col :span="15"><el-input v-model="form.pname" /></el-col>
      </el-form-item>
      <el-form-item label="产品型号" prop="ptype">
        <el-col :span="15"><el-input v-model="form.ptype" /></el-col>
      </el-form-item>
      <el-form-item label="产品规格" prop="pspec">
        <el-col :span="15"><el-input v-model="form.pspec" /></el-col>
      </el-form-item>
      <el-form-item label="供应商" prop="supplier">
        <el-col :span="15"><el-input v-model="form.supplier" /></el-col>
      </el-form-item>
      <el-form-item label="进价" prop="in_price">
        <el-col :span="15"><el-input v-model="form.in_price" /></el-col>
      </el-form-item>
      <el-form-item label="数量" prop="count">
        <el-col :span="12">
          <el-input v-model="form.count" />
        </el-col>
        <el-col :span="3">
          <el-select v-model="form.unit" class="filter-item" placeholder="单位">
            <el-option v-for="item in unitOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="入库日期" prop="indate">
        <el-col :span="15">
          <el-date-picker v-model="form.indate" type="date" placeholder="Pick a date" style="width: 100%;" />
        </el-col>
      </el-form-item>
      <el-form-item label="经办人" prop="operator_man">
        <el-col :span="15"><el-input v-model="form.operator_man" /></el-col>
      </el-form-item>
      <el-form-item label="备注">
        <el-col :span="15">
          <el-input v-model="form.desc" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-col>
      </el-form-item>
      <el-form-item>
        <!-- <el-button type="primary" @click="onSubmit">提交</el-button> -->
        <el-button type="primary" @click="formStatus==='create'?createData():updateData()"> 提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { inStock } from '@/api/product'

export default {
  data() {
    return {
      list: null,
      formStatus: 'create',
      form: {
        pcode: '',
        pname: '',
        ptype: '',
        pspec: '',
        desc: ''
      },
      unitOptions: ['个', '箱', '块', '台'],
      rules: {
        pcode: [{ required: true, message: '产品编码不能为空！', trigger: 'change' }],
        pname: [{ required: true, message: '产品名称不能为空！', trigger: 'change' }],
        ptype: [{ required: true, message: '产品型号不能为空！', trigger: 'change' }],
        pspec: [{ required: true, message: '产品规格不能为空！', trigger: 'blur' }],
        count: [{ required: true, message: '产品数量不能为空！', trigger: 'blur' }],
        in_price: [{ required: true, message: '单价不能为空！', trigger: 'blur' }],
        in_date: [{ required: true, message: '入库日期不能为空！', trigger: 'blur' }]
      }
    }
  },
  methods: {
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          inStock(this.form).then(() => {
            this.$notify({
              title: 'Success',
              message: '提交成功！',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    onSubmit() {
      // this.$message('submit!')
      this.$message({
        message: '提交成功！',
        type: 'success'
      })
    },
    onCancel() {
      this.$message({
        message: '已取消！',
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

<template>
  <div class="app-container">
    <el-form :rules="rules" ref="dataForm" :model="form" label-width="120px">
      <el-form-item label="产品编码" prop="code">
        <el-col :span="15"><el-input v-model="form.code" /></el-col>
      </el-form-item>
      <el-form-item label="产品名称" prop="name">
        <el-col :span="15"><el-input v-model="form.name" /></el-col>
      </el-form-item>
      <el-form-item label="产品型号" prop="models">
        <el-col :span="15"><el-input v-model="form.models" /></el-col>
      </el-form-item>
      <el-form-item label="产品规格"  prop="spec">
        <el-col :span="15"><el-input v-model="form.spec" /></el-col>
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
      <el-form-item label="单价" prop="inprice">
        <el-col :span="15"><el-input v-model="form.inprice" /></el-col>
      </el-form-item>
      <el-form-item label="供应商" prop="supplier">
        <el-col :span="15"><el-input v-model="form.supplier" /></el-col>
      </el-form-item>
      <el-form-item label="入库日期" prop="indate">
        <el-col :span="15">
          <el-date-picker v-model="form.indate" type="date" placeholder="Pick a date" style="width: 100%;" />
          </el-col>
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
import { createProduct } from '@/api/product'

export default {
  data() {
    return {
      list: null,
      formStatus: 'create',
      form: {
        name: '',
        desc: '',
      },
      unitOptions: ['个','箱','块','台'],
      rules: {
        code: [{ required: true, message: '产品编码不能为空！', trigger: 'change' }],
        name: [{ required: true, message: '产品名称不能为空！', trigger: 'change' }],
        models: [{ required: true, message: '产品型号不能为空！', trigger: 'change' }],
        spec: [{ required: true, message: '产品规格不能为空！', trigger: 'blur' }],
        count: [{ required: true, message: '产品数量不能为空！', trigger: 'blur' }],
        inprice: [{ required: true, message: '单价不能为空！', trigger: 'blur' }],
        indate: [{ required: true, message: '入库日期不能为空！', trigger: 'blur' }],
      }
    }
  },
  methods: {
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createProduct(this.form).then(() => {
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
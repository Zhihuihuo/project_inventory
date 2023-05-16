<template>
  <div class="app-container">
    <el-form :rules="rules" ref="form" :model="form" label-width="120px">
      <el-form-item label="客商名称" prop="name">
        <el-col :span="15"><el-input v-model="form.name" /></el-col>
      </el-form-item>
      <el-form-item label="所属行业">
        <el-col :span="15"><el-input v-model="form.industry" /></el-col>
      </el-form-item>
      <el-form-item label="所属城市" prop="city">
        <el-col :span="15">
          <el-select v-model="form.city" class="filter-item" placeholder="Please select">
            <el-option v-for="item in cityOptions" :key="item" :label="item" :value="item" />
          </el-select>
          </el-col>
      </el-form-item>
      <el-form-item label="联系人" prop="contact">
        <el-col :span="15"><el-input v-model="form.contact" /></el-col>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-col :span="15"><el-input v-model="form.phone" /></el-col>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-col :span="15"><el-input v-model="form.address" /></el-col>
      </el-form-item>
      <el-form-item label="备注">
        <el-col :span="15">
          <el-input v-model="form.desc" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        industry: '',
        city: '',
        contact: '',
        phone: '',
        address: '',
        desc: '',
      },
      cityOptions: ['北京','上海','广州','深圳','其他'],
      rules: {
        name: [{ required: true, message: 'name is required', trigger: 'change' }],
        contact: [{ required: true, message: 'contact is required', trigger: 'change' }],
        phone: [{ required: true, message: 'phone is required', trigger: 'blur' }],
        city: [{ required: true, message: 'city is required', trigger: 'blur' }],
        address: [{ required: true, message: 'address is required', trigger: 'blur' }],
      }
    }
  },
  methods: {
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


import request from '@/utils/request'

// 库存管理 -> 存货列表
export function getList(params) {
  return request({
    url: '/my-project/product/list',
    method: 'get',
    params
  })
}

export function detailProduct(id) {
  return request({
    url: '/my-project/product/detail',
    method: 'get',
    params: { id }
  })
}

export function createProduct(data) {
  return request({
    url: '/my-project/product/create',
    method: 'post',
    data
  })
}

export function updateProduct(data) {
  return request({
    url: '/my-project/product/update',
    method: 'post',
    data
  })
}

export function inStock(data) {
  return request({
    url: '/my-project/product/in_stock',
    method: 'post',
    data
  })
}

export function outStock(data) {
  return request({
    url: '/my-project/product/out_stock',
    method: 'post',
    data
  })
}

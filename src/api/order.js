import request from '@/utils/request'

// 销售管理 -> 订单管理
export function getList(params) {
  return request({
    url: '/my-project/order/list',
    method: 'get',
    params
  })
}

export function detailProduct(id) {
  return request({
    url: '/my-project/order/detail',
    method: 'get',
    params: { id }
  })
}

export function createProduct(data) {
  return request({
    url: '/my-project/order/create',
    method: 'post',
    data
  })
}

export function updateProduct(data) {
  return request({
    url: '/my-project/order/update',
    method: 'post',
    data
  })
}

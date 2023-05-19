const Mock = require('mockjs')

const List = []
const count = 30

for (let i = 0; i < count; i++) {
  var order_code = 'O20230519093000001' + i
  List.push(Mock.mock({
    order_date: +Mock.Random.date('T'),
    'order_code|1': order_code,
    order_price: '@float(0, 100, 2, 2)',
    order_status: ['已提交，待付款', '已付款，待发货', '已发货，待收货', '已收货'],
    custorm_name: Mock.Random.cname(),
    sale_name: Mock.Random.cname()

    // id: '@increment',
    // timestamp: +Mock.Random.date('T'),
    // author: '@first',
    // reviewer: '@first',
    // title: '@title(5, 10)',
    // content_short: 'mock data',
    // content: baseContent,
    // forecast: '@float(0, 100, 2, 2)',
    // importance: '@integer(1, 3)',
    // 'type|1': ['CN', 'US', 'JP', 'EU'],
    // 'status|1': ['published', 'draft'],
    // display_time: '@datetime',
    // comment_disabled: true,
    // pageviews: '@integer(300, 5000)',
    // image_uri,
    // platforms: ['a-platform']
  }))
}

module.exports = [
  {
    url: '/my-project/order/list',
    type: 'get',
    response: config => {
      const { order_date, order_code, order_price, order_status, page = 1, limit = 20, sort } = config.query
      let mockList = List.filter(item => {
        if (order_date && item.order_date !== order_date) return false
        if (order_code && item.order_code !== order_code) return false
        if (order_price && item.order_price !== order_price) return false
        if (order_status && item.order_status !== order_status) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/my-project/order/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/my-project/order/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

const Mock = require('mockjs')

const List = []
const count = 30

for (let i = 0; i < count; i++) {
  var pcode = 'P000' + i
  List.push(Mock.mock({
    'pcode|1': pcode,
    pname: '@first',
    'ptype|1': ['X710', 'X720', 'X730', 'X740', 'X750'],
    'pspec|1': ['100*100','100*130','100*150','100*180','100*200','150*150'],
    // count: '@integer(300, 5000)', 
    // price: '@float(0, 100, 2, 2)', 
    desc: '@first'

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
    url: '/my-project/product/list',
    type: 'get',
    response: config => {
      const { pcode, pname, ptype, page = 1, limit = 20, sort } = config.query
      let mockList = List.filter(item => {
        if (pcode && item.pcode !== pcode) return false
        if (pname && item.pname !== pname) return false
        if (ptype && item.ptype !== ptype) return false
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
    url: '/my-project/product/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/my-project/product/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/my-project/product/in_stock',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/my-project/product/out_stock',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

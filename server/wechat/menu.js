import config from '../config'

export default {
  // {
  //   'name': '智能鞋垫',
  //   'sub_button': [{
  //     'name': '医疗康复',
  //     'type': 'click',
  //     'key': 'kf'
  //   }, {
  //     'name': '跑步训练',
  //     'type': 'view',
  //     'url': 'http://admin.podoon.com/app/'
  //   }]
  // }
  button: [{
    'name': '资料库',
    'type': 'view',
    'url': config.SITE_ROOT_URL + '/zing'
  },
  {
    'name': '报名活动',
    'type': 'view',
    'url': config.SITE_ROOT_URL + '/apply'
  },
  {
    'name': '个人中心',
    'type': 'view',
    'url': config.SITE_ROOT_URL + '/user'
  }]
}

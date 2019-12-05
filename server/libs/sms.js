import QcloudSms from 'qcloudsms_js'

// 短信应用 SDK AppID
var appid = 1400219523  // SDK AppID 以1400开头

// 短信应用 SDK AppKey
var appkey = 'cc41cf1a874db93db58746f7429f826a'

// 短信模板 ID，需要在短信控制台中申请
var templateId = 354847

// 签名
var smsSign = '办公室计划'

// 实例化 QcloudSms
var qcloudsms = QcloudSms(appid, appkey)

const sendSmsCode = (photoNumber) => new Promise((resolve, reject) => {
  var ssender = qcloudsms.SmsSingleSender()
  var smsCode = getCode(4)
  ssender.sendWithParam(86, photoNumber, templateId, [smsCode],
    smsSign, '', '', (err, res, resData) => {
      if (err) {
        reject(err)
      } else {
        console.log('request data: ', res.req)
        console.log('response data: ', resData)
        resolve(smsCode)
      }
    }
  )
})

const sendSmsCodeInTest = (photoNumber) => new Promise((resolve, reject) => {
  var smsCode = getCode(4)
  resolve(smsCode)
})

function getCode(n) {
  var all = '1234567890'
  var b = ''
  for (var i = 0; i < n; i++) {
    var index = Math.floor(Math.random() * 10)
    b += all.charAt(index)
  }
  return b
}

export default {
  sendSmsCode,
  sendSmsCodeInTest
}

import xml2js from 'xml2js'
import template from './tpl'
import sha1 from 'sha1'

function parseXML(xml) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, {
      trim: true
    }, (err, content) => {
      if (err) reject(err)
      else resolve(content)
    })
  })
}

function formatMessage(result) {
  let message = {}

  if (typeof result === 'object') {
    const keys = Object.keys(result)

    for (let i = 0; i < keys.length; i++) {
      let item = result[keys[i]]
      let key = keys[i]

      if (!(item instanceof Array) || item.length === 0) {
        continue
      }

      if (item.length === 1) {
        let val = item[0]

        if (typeof val === 'object') {
          message[key] = formatMessage(val)
        } else {
          message[key] = (val || '').trim()
        }
      } else {
        message[key] = []

        for (let j = 0; j < item.length; j++) {
          message[key].push(formatMessage(item[j]))
        }
      }
    }
  }

  return message
}

function tpl(content, message) {
  let type = 'text'

  if (Array.isArray(content)) {
    type = 'news'
  }

  // if (!content) {
  //   content = '收到'
  // }

  if (content) {
    if (content && content.type) {
      type = content.type
    }
    let info = Object.assign({}, {
      content: content,
      createTime: new Date().getTime(),
      msgType: type,
      toUserName: message.FromUserName,
      fromUserName: message.ToUserName
    })
    return template(info)
  } else {
    return null
  }
}

function createNonce() {
  return Math.random().toString(36).substr(2, 15)
}

function createTimestamp() {
  return parseInt(new Date().getTime() / 1000, 0) + ''
}

function dayTimeStr(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].join('-')
}

function getXingzuo(m, d) {
  if (!m || !d) {
    return 0
  }
  // 输出0～12的数字，0表示摩羯，1表示水瓶，依此类推，...，11是射手，12是摩羯。
  var result = m - (d < '102223444433'.charAt(m - 1) - -19)
  result += 1
  result %= 12
  return result
}

function raw(args) {
  let keys = Object.keys(args)
  let newArgs = {}
  let str = ''

  keys = keys.sort()
  keys.forEach((key) => {
    newArgs[key.toLowerCase()] = args[key]
  })

  for (let k in newArgs) {
    str += '&' + k + '=' + newArgs[k]
  }

  return str.substr(1)
}

function signIt(nonce, ticket, timestamp, url) {
  const ret = {
    jsapi_ticket: ticket,
    nonceStr: nonce,
    timestamp: timestamp,
    url: url
  }

  const string = raw(ret)
  const sha = sha1(string)

  return sha
}

function ymdToDate(year, month, day) {
  var yearStr = `${year}`
  var monthStr = digit2Bit(month)
  var dayStr = digit2Bit(day)
  return Date.parse([yearStr, monthStr, dayStr].join('-'))
}

function digit2Bit(i) {
  return (i < 10 ? '0' : '') + i
}

function sign(ticket, url) {
  const nonce = createNonce()
  const timestamp = createTimestamp()
  const signature = signIt(nonce, ticket, timestamp, url)
  return {
    noncestr: nonce,
    timestamp: timestamp,
    signature: signature
  }
}

export {
  formatMessage,
  parseXML,
  tpl,
  sign,
  dayTimeStr,
  getXingzuo,
  ymdToDate
}

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const SALT_WORK_FACTOR = 10
const MAX_LOGIN_ATTEMPTS = 5
const LOCK_TIME = 2 * 60 * 60 * 1000
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
// const ObjectId = Schema.Types.ObjectId
// const Mixed = Schema.Types.Mixed

const UserSchema = new Schema({
  // user admin superAdmin
  userId: { type: Number, default: 0 },
  openid: [String],
  unionid: String,
  // user普通 vip会员 admin管理员 superadmin超级管理员
  role: {
    type: String,
    default: 'user'
  },
  nickname: String,
  phoneNumber: String,
  wxcode: String,
  // 0 未知 1男 2女
  gender: Number,
  // 0 保密 1博士及以上 2研究生 3本科 4专科 5专科以下
  degree: Number,
  height: Number,
  // 格式固定 1988-11-14
  birthyear: Number,
  birthmonth: Number,
  birthdate: Number,
  birthday: String,
  // 0-12 未知,魔羯座,水瓶座,双鱼座,白羊座,金牛座,双子座,巨蟹座,狮子座,处女座,天秤座,天蝎座,射手座
  xingzuo: Number,
  // 微信读取到的
  provinceName: String,
  cityName: String,
  // 工作城市
  city: String,
  hometown: String,
  career: String,
  // 0 未知, 1 10w内, 2 10-20, 3 20-50, 4 50以上
  income: Number,
  // 0其他 1国企 2外企 3私企 4事业单位 5自由职业 6创业
  jobType: Number,
  photos: [String],
  // 0 我想保密 1无房产 2和家人住 3已购房产
  houseType: Number,
  aboutMe: String,
  aboutOther: String,
  avatarUrl: String,
  interestId: [{
    type: ObjectId,
    ref: 'Interest'
  }],

  userToken: String,
  // 暂时锁定
  lockUntil: {
    type: Number
  },
  vipUntil: {
    type: Number,
    default: 0
  },
  vipUntilStr: {
    type: String
  },
  // 0 未知 1男 2女 3与性别取反
  filterGender: {
    type: Number,
    default: 3
  },
  // 0 不限制 1、20岁以上 2、25岁以上 3、30岁以上 4、35岁以上
  filterAge: {
    type: Number,
    default: 0
  },
  filterDegree: {
    type: Number,
    default: 0
  },
  filterHeight: {
    type: Number,
    default: 0
  },
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  },
  description: String,
  code: String,
  password: {
    type: String
  },
  loginAttempts: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  toObject: { virtuals: true },
  toJSON: {virtuals: true}
})

UserSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now())
})

UserSchema.virtual('isVip').get(function () {
  return !!(this.vipUntil && this.vipUntil > Date.now())
})

UserSchema.virtual('age').get(function () {
  var birthday = this.birthday
  if (birthday == null) {
    return 0
  }
  var returnAge
  var strBirthdayArr = birthday.split('-')
  var birthYear = strBirthdayArr[0]
  var birthMonth = strBirthdayArr[1]
  var birthDay = strBirthdayArr[2]

  let d = new Date()
  var nowYear = d.getFullYear()
  var nowMonth = d.getMonth() + 1
  var nowDay = d.getDate()

  if (nowYear === birthYear) {
    returnAge = 0
  } else {
    var ageDiff = nowYear - birthYear
    if (ageDiff > 0) {
      if (nowMonth === birthMonth) {
        var dayDiff = nowDay - birthDay
        if (dayDiff < 0) {
          returnAge = ageDiff - 1
        } else {
          returnAge = ageDiff
        }
      } else {
        var monthDiff = nowMonth - birthMonth
        if (monthDiff < 0) {
          returnAge = ageDiff - 1
        } else {
          returnAge = ageDiff
        }
      }
    } else {
      returnAge = 0
    }
  }
  return returnAge
})

UserSchema.virtual('token').get(function () {
  var salt = bcrypt.genSaltSync(10)
  var token = bcrypt.hashSync(String(this._id), salt)

  return token
})

// 保存前，设定创建时间或更新时间
UserSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }

  if (!this.userId) {
    const Counter = mongoose.model('Counter')
    var doc = this
    Counter.findByIdAndUpdate({_id: 'entityId'}, { $inc: {seq: 1} }, function (error, counter) {
      console.log('userId:', error, counter)
      if (error) {
        return next(error)
      }
      if (counter) {
        doc.userId = counter.seq
        console.log('save user:', doc.userId)
      }
      next()
    })
  } else {
    next()
  }
})

// 保存前判断密码是否更改，没更改跳过该切片，更改的话需要对密码进行hash再入库
UserSchema.pre('save', function (next) {
  var user = this

  if (!user.isModified('password')) return next()
  // 加盐
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err)
    bcrypt.hash(user.password, salt, (error, hash) => {
      if (error) return next(error)

      user.password = hash
      next()
    })
  })
})

UserSchema.statics = {
  async removeAll() {
    await this.find({}).remove().exec()
  }
  // async getFollower(userId, depth) {
  //   const User = this
  //   let currentUsers = await this.find({follow: userId}).exec()
  //   let allFollowers = [...currentUsers]
  //   if (depth > 0) {
  //     currentUsers.forEach(async currentUser => {
  //       allFollowers.push(await User.getFollower(currentUser.userId, depth - 1))
  //     })
  //   }
  //   return allFollowers
  // }
}

UserSchema.methods = {
  comparePassword: function (_password, password) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(_password, password, function (err, isMatch) {
        if (!err) resolve(isMatch)
        else reject(err)
      })
    })
  },

  incVipTime: function (vipTime) {
    var that = this

    return new Promise((resolve, reject) => {
      var vipUntil = 0
      if (that.vipUntil && that.vipUntil > Date.now()) {
        vipUntil = that.vipUntil + vipTime
      } else {
        vipUntil = Date.now() + vipTime
      }
      var vipUntilDate = new Date(vipUntil)
      var dd = vipUntilDate.getDate()
      var mm = vipUntilDate.getMonth() + 1

      var yyyy = vipUntilDate.getFullYear()
      if (dd < 10) {
        dd = '0' + dd
      }
      if (mm < 10) {
        mm = '0' + mm
      }
      var vipUntilStr = dd + '/' + mm + '/' + yyyy
      console.log('vip时间增加至：' + vipUntilStr)
      var updates = {
        $set: {vipUntil, vipUntilStr}
      }
      that.update(updates, err => {
        if (!err) resolve(true)
        else reject(err)
      })
    })
  },

  incLoginAttempts: function (user) {
    var that = this

    return new Promise((resolve, reject) => {
      if (that.lockUntil && that.lockUntil < Date.now()) {
        that.update({
          $set: {
            loginAttempts: 1
          },
          $unset: {
            lockUntil: 1
          }
        }, function (err) {
          if (!err) resolve(true)
          else reject(err)
        })
      }
      var updates = {
        $inc: {
          loginAttempts: 1
        }
      }
      if (that.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !that.isLocked) {
        updates.$set = {
          lockUntil: Date.now() + LOCK_TIME
        }
      }

      that.update(updates, err => {
        if (!err) resolve(true)
        else reject(err)
      })
    })
  }
}

mongoose.model('User', UserSchema)

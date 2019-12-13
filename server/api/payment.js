import mongoose from 'mongoose'

const Payment = mongoose.model('Payment')

export async function fetchPayments() {
  const data = await Payment.find({}).populate('user').exec()

  return data
}

export async function create(user, vipType, price, order, outTradeNo) {
  let payment = new Payment({
    user: user._id,
    vipType: vipType,
    order: order,
    totalFee: price,
    outTradeNo: outTradeNo
  })

  payment = await payment.save()

  return payment
}

export async function savePayment(payment) {
  payment = new Payment(payment)
  payment = await payment.save()
  return payment
}

export async function updatePayment(payment) {
  payment = await payment.save()
  return payment
}

export async function getPayment(_id) {
  const payment = await Payment.findOne({ _id })
    .populate([
      {
        path: 'user',
        select: 'openid'
      }
    ])
    .exec()
  return payment
}

export async function getPaymentByTrade(outTradeNo) {
  const payment = await Payment.findOne({
    outTradeNo: outTradeNo
  }).exec()
  return payment
}

export async function getPaymentCount(id) {
  const params = id ? { user: id } : {}
  const total = await Payment.find(params).count()
  return total
}

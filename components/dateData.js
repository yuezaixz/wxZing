var currentDate = new Date()

var yearsData = [

]

var monthsData = {}

var monthsDataItem = []

var daysData = {}

for (var j = 1; j <= 12; j++) {
  monthsDataItem.push({
    text: '' + j + '月',
    value: j
  })
  var daysDataItem = []
  for (var k = 1; k <= [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][j]; k++) {
    daysDataItem.push({
      text: '' + k + '日',
      value: k
    })
  }
  daysData[j] = daysDataItem
}

for (var i = 1970; i <= currentDate.getFullYear(); i++) {
  yearsData.push({
    text: '' + i + '年',
    value: i
  })
  monthsData[i] = monthsDataItem
}

var heightData = []

for (var l = 140; l <= 200; l++) {
  heightData.push({
    text: '' + l + 'cm',
    value: l
  })
}

export { yearsData, monthsData, daysData, heightData }

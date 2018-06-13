import R from 'ramda'
import React from 'react'



export const getErrorMessage = (error) => {
  if (R.path(['graphQLErrors'])(error)) {
    const graphQLErrors = R.path(['graphQLErrors'])(error)
    return (graphQLErrors || []).map(i => i.message).join(',')
  } else {
    return R.path(['message'])(error)
  }
}
export const typeToLabel = (type) => R.pathOr('', ['zh_CN'])(type)
export const yardToMeter = (yard) => (parseFloat(yard) * 0.9144).toFixed(3)
export const meterToYard = (meter) => (parseFloat(meter) * 1.0936133).toFixed(3)
export const selectFiledsByName = (names) => (fields) => fields.filter(i => names.some(name => name === i.name))
export const selectFiledsByTag = (tag) => (fields) => fields.filter(i => tag === i.tag) || []
export const selectFiledsByTagAndLevel = (tag, level) => (fields) => fields.filter(i => tag === i.tag && i.level <= level)
export const mergeObjects = (...objects) => {
  let obj = {}
  objects.forEach((item) => {
    obj = Object.assign(obj, item)
  })

  return obj
}

export const dealInteger = (money) => {
  if (money && money != null) {
    money = money.toString()
    let left = money.split('.')[0]
    let right = money.split('.')[1]
    right = right ? (right.length >= 2 ? '.' + right.substr(0, 2) : '.' + right + '0') : ''
    let temp = left.split('').reverse().join('').match(/(\d{1,3})/g)
    let result = (Number(money) < 0 ? '-' : '') + temp.join(',').split('').reverse().join('') + right
    result = result.replace(',', ', ')
    return result
  } else if (money === 0) {   // 注意===在这里的使用，如果传入的money为0,if中会将其判定为boolean类型，故而要另外做===判断
    return '0'
  } else {
    return ''
  }
}

export const dealNumber = (money) => {
  if (money && money != null) {
    money = money.toString()
    let left = money.split('.')[0]
    let right = money.split('.')[1]
    right = right ? (right.length >= 2 ? '.' + right.substr(0, 2) : '.' + right + '0') : '.00'
    let temp = left.split('').reverse().join('').match(/(\d{1,3})/g)
    let result = (Number(money) < 0 ? '-' : '') + temp.join(',').split('').reverse().join('') + right
    result = result.replace(',', ', ')
    return result
  } else if (money === 0) {   // 注意===在这里的使用，如果传入的money为0,if中会将其判定为boolean类型，故而要另外做===判断
    return '0.00'
  } else {
    return ''
  }
}

export const convertCurrency = (money) => {
  // 汉字的数字
  const cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  // 基本单位
  const cnIntRadice = ['', '拾', '佰', '仟']
  // 对应整数部分扩展单位
  const cnIntUnits = ['', '万', '亿', '兆']
  // 对应小数部分单位
  const cnDecUnits = ['角', '分', '毫', '厘']
  // 整数金额时后面跟的字符
  const cnInteger = '整'
  // 整型完以后的单位
  const cnIntLast = '元'
  // 最大处理的数字
  const maxNum = 999999999999999.9999
  // 金额整数部分
  let integerNum
  // 金额小数部分
  let decimalNum
  // 输出的中文金额字符串
  let chineseStr = ''
  // 分离金额后用的数组，预定义
  let parts
  if (money === '') {
    return ''
  }
  money = parseFloat(money)
  if (money >= maxNum) {
    // 超出最大处理数字
    return ''
  }
  if (money === 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger
    return chineseStr
  }
  // 转换为字符串
  money = money.toFixed(2)
  if (money.indexOf('.') === -1) {
    integerNum = money
    decimalNum = ''
  } else {
    parts = money.split('.')
    integerNum = parts[0]
    decimalNum = parts[1].substr(0, 4)
  }
  // 获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    let zeroCount = 0
    let IntLen = integerNum.length
    for (let i = 0; i < IntLen; i++) {
      const n = integerNum.substr(i, 1)
      const p = IntLen - i - 1
      const q = p / 4
      const m = p % 4
      if (n === '0') {
        zeroCount++
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0]
        }
        // 归零
        zeroCount = 0
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m]
      }
      if (m === 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q]
      }
    }
    chineseStr += cnIntLast
  }
  // 小数部分
  if (decimalNum !== '') {
    let decLen = decimalNum.length
    for (let i = 0; i < decLen; i++) {
      const n = decimalNum.substr(i, 1)
      if (n !== '0') {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i]
      }
    }
  }
  if (chineseStr === '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger
  } else if (decimalNum === '') {
    chineseStr += cnInteger
  } else if (parseFloat(decimalNum) === 0) {
    chineseStr += cnInteger
  }
  return chineseStr
}

export const getParentRouteKey = (state) => {
  const route = state.routes[state.index]
  return typeof route.index === 'undefined' ? state.key : getParentRouteKey(route)
}

export const floatNumberToFixed = (number, fixed) => {
  return (parseFloat(number) % 1 ? parseFloat(parseFloat(number).toFixed(fixed || 2)) : parseInt(number)) || 0
}

export const getPercentage = (numerator, denominator, fixed) => {
  const percent = numerator === 0 ? 0 : denominator === 0 ? 100 : Math.max(0, Math.min((numerator / denominator) * 100, 100))
  return (floatNumberToFixed(percent, fixed || 1)) || 0
}

export const getFactoryPatternName = (item) => {
  const name = R.path(['code'])(item) || R.path(['fileName'])(item) || '暂无'
  const color = R.path(['color'])(item)
  return `${name}${color ? ` - ${color}` : ''}`
}

export const fetchMoreProps = (queryAliasName, queryName, obj) => {
  const resultObject = {}
  resultObject[queryAliasName] = {
    ...obj,
    loadMoreEntries (page) {
      return obj.fetchMore({
        variables: {
          ...obj.variables,
          page: page
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          // console.tron.log(previousResult)
          if (!fetchMoreResult[queryName] || !fetchMoreResult[queryName].nodes || (page !== 1 &&
            page <=
            R.path([queryName, 'pageInfo', 'currentPage'])(previousResult))) {
            return previousResult
          }
          // console.tron.log(fetchMoreResult)
          let result = {}
          result[queryName] = {
            ...R.pathOr({}, [queryName])(fetchMoreResult),
            nodes: page === 1 ? R.pathOr([],
              [queryName, 'nodes'])(fetchMoreResult)
              : [...R.pathOr([], [queryName, 'nodes'])(previousResult),
                ...R.pathOr([], [queryName, 'nodes'])(fetchMoreResult)]
          }
          return Object.assign({}, previousResult, result)
        }
      })
    }
  }
  // console.tron.log(resultObject)
  return resultObject
}


// 获取当前路由
export const getCurrentRoute = (nav) => {
  const findCurrentRoute = (navState: Object) => {
    if (navState.index !== undefined) {
      return findCurrentRoute(navState.routes[navState.index])
    }
    return navState.routeName
  }
  return findCurrentRoute(nav)
}

// 获取父路由
export const getParentRoute = (state) => {
  const route = state.routes[state.index]
  return typeof route.index === 'undefined' ? state.routeName : getParentRoute(route)
}







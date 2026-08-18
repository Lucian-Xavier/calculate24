// TODO 获取元素
// 开始页面
const startPage = document.querySelector('.start')
const startBtn = document.querySelector('.btn-start')
const helpText = document.querySelector('.start .help span')
// 游戏页面
const gamePage = document.querySelector('.game')
const gameBackIndexBtn = document.querySelector('.back-index')
const timetext = document.querySelector('.timetext')
const rightText = document.querySelector('.right-text')
const tipCalcText = document.querySelector('.catculation')
const cardbox = document.querySelector('.cardbox')
const cards = document.querySelectorAll('.card')
const operatorbox = document.querySelector('.operatorbox')
const revocationBtn = document.querySelector('.revocation')
const resetBtn = document.querySelector('.reset')
// 结束页面
const endPage = document.querySelector('.end')
const endBackIndexBtn = document.querySelector('.btn-back')
const overtext = document.querySelector('.over')
const againBtn = document.querySelector('.btn-again')

// TODO 定义常量
const gameTimeSecond = 180 // 游戏时间：3分
const CardTransitionTimeMs = 350 // 卡片过渡时间（单位ms）
// 时间的提示文本
const timeTipText =gameTimeSecond % 60 === 0 ? `${gameTimeSecond / 60}分钟` : `${Math.floor(gameTimeSecond / 60)}分${gameTimeSecond % 60}秒`

// TODO 定义变量
let gameTimeId = null // 游戏时间计时器的编号
let cardDegreeCount = 0 // 卡片旋转次数
let step = [] // 卡片操作后的信息记录 [ME, TE, offset:[], text]
let rightCount = 0 // 游戏正确个数

// TODO 定义切换页面函数
/**
 * 切换页面函数
 * @param {Element} page 
 */
let changePage = (page) => {
  document.querySelector('.show').classList.remove('show')
  page.classList.add('show')
}

// TODO 获取随机数函数
let getRandom = (M, N) => {
  return Math.floor(Math.random() * (M - N + 1)) + N
}

// TODO 设置卡片过渡
for (let i = 0; i < cards.length; i++) {
  cards[i].style.transition = `transform ${CardTransitionTimeMs}ms ease-in, color ${CardTransitionTimeMs * 0.8}ms ease-in`
}

// TODO 定义初始化函数
let initGamePage = () => {
  // 禁用符号按钮
  for (let i = 0; i < operatorbox.children.length; i++) {
    operatorbox.children[i].disabled = true
  }
  // 禁用撤回按钮
  revocationBtn.disabled = true
  // 初始化计算提示文本
  tipCalcText.innerHTML = '=24'
  tipCalcText.className = 'catculation normal'
  // 重置卡片操作信息
  step = []
  // 获取高亮卡片
  const activeCard = document.querySelector('.cardbox .active')
  const activeBtn = document.querySelector('.operatorbox .active')
  const hiddenCards = document.querySelectorAll('.cardbox .hidden')

  // 取消数字卡片高亮
  if (activeCard) activeCard.classList.remove('active')
  // 取消符号按钮高亮
  if (activeBtn) activeBtn.classList.remove('active')
  // 取消数字卡片隐藏
  if (hiddenCards.length !== 0) {
    setTimeout(() => {
      for (let i = 0; i < hiddenCards.length; i++) {
        hiddenCards[i].classList.remove('hidden')
      }
    }, CardTransitionTimeMs * 1.4);
  }
  // 开始动画
  cardStartAnimate()
}

// TODO 定义两位数补0函数
/**
 * 不足两位数补0函数
 * @param {Number} num
 * @returns {string} 
 */
let _addZore = num => {
  return num / 10 < 1 ? `0${num}` : `${num}`
}

// TODO 定义获取当前剩余游戏时间函数
/**
 * 
 * @param {Number} targetTime 目标时间的时间戳
 * @returns {[String, Number]}
 */
let getGameTimeRemaining = (targetTime) => {
  // 获取当前时间
  const presentTime = +new Date() 
  // 获取剩余时间
  const timeRemainingSecond = Math.floor((targetTime - presentTime) / 1000)
  const remainingMin = Math.floor(timeRemainingSecond / 60)
  const remainingSecond = Math.floor(timeRemainingSecond % 60)
  return [`${_addZore(remainingMin)}:${_addZore(remainingSecond)}`, timeRemainingSecond]
}

// TODO 定义开始游戏函数
let startGame = () => {
  // 显示计算界面
  changePage(gamePage)
  // 将卡片文字改为空
  for (let i = 0; i < cards.length; i++) {
    cards[i].innerHTML = ''
  }
  // 初始化挑战页面
  initGamePage()
  // 初始化正确个数
  rightCount = 0
  rightText.innerHTML = rightCount
  // TODO 实现计时功能
  // 得到目标时间的时间戳
  const gameTargetTime = +new Date() + gameTimeSecond * 1000
  // 开始计时--递归
  let startTime = () => {
    // 获取剩余时间（解构）
    const [text, remainingTimeMs] = getGameTimeRemaining(gameTargetTime)
    // 修改时间文本为当前剩余时间
    timetext.innerHTML = text
    // 判断时间是否小于等于0 
    if (remainingTimeMs <= 0) {
      // 如果小于等于0
      // 将结束文本更新 --> 您在3分钟中内答对了10道题
      overtext.innerHTML = `您在${timeTipText}中内答对了${rightCount}道题`
      // 切换到结束页面
      changePage(endPage)
      // 停止递归
      return
    }
    // 0.9秒后递归函数 -> 防止误差
    gameTimeId = setTimeout(startTime, 900)
  }
  startTime()
}

// TODO 获取偏移字符串
/**
 * 获取卡片transform字符串
 * @param {number} x 
 * @param {number} y 
 * @param {number} degree  
 */
let getCardTransFormString = (x, y, degree = cardDegreeCount) => {
  return `translate(${x}px, ${y}px) rotate(${degree * 360}deg)`
}

// TODO 定义卡片开始动画函数
let cardStartAnimate = () => {
  // 获取卡片距离中心的偏移值
  /**
   * 获取卡片距离中心的偏移值
   * @returns {[[Number, Number], [Number, Number], [Number, Number], [Number, Number]]}
   */
  let _getCardOffsetCenter = () => {
    const cardboxSize = parseFloat(getComputedStyle(cardbox).width)
    const cardSize = parseFloat(window.getComputedStyle(cards[0]).width)
    const offsetCenter = cardboxSize / 2 - cardSize / 2
    return [
      [+offsetCenter, +offsetCenter],
      [-offsetCenter, +offsetCenter],
      [+offsetCenter, -offsetCenter],
      [-offsetCenter, -offsetCenter]
    ]
  }
  
  // 增加卡片旋转次数
  cardDegreeCount++
  // 将卡片禁用
  for (let i = 0; i < cards.length; i++) {
    cards[i].disabled = true
  }
  // 卡片收起
  for (let i = 0; i < cards.length; i++) {
    cards[i].style.transform = getCardTransFormString(..._getCardOffsetCenter()[i])
    // 文字隐藏
    cards[i].style.color = 'transparent'
  }
  // 卡片展开（1.5倍过渡时间后）
  setTimeout(() => {
    for (let i = 0; i < cards.length; i++) {
      cards[i].style.transform = getCardTransFormString(0,0)
      // 将卡片启用
      cards[i].disabled = false
      // 更改文字文本
      cards[i].innerHTML = getRandom(1, 10)
      // 文字显示
      cards[i].style.color = `black`
    }
  }, CardTransitionTimeMs * 1.5)
}

// TODO 定义获得卡片距离函数
/**
 * 获得两个卡片之间的距离函数
 * @param {Element} E1 
 * @param {Element} E2 
 * @returns {[Number, Number]}
 */
let getCardDistance = (E1, E2) => {
  const x1 = parseFloat(getComputedStyle(E1).left)
  const x2 = parseFloat(getComputedStyle(E2).left)
  const y1 = parseFloat(getComputedStyle(E1).top)
  const y2 = parseFloat(getComputedStyle(E2).top)
  return [x1 - x2, y1 - y2]
}

// TODO 定义计算函数
/**
 * 计算函数
 * @param {Number} num1 
 * @param {Number} num2 
 * @param {Number} operatorId 
 * @returns {[String, Number]}
 */
function calc(num1, num2, operatorId) {
  switch (operatorId) {
    case 1:
      return [`${num1} + ${num2} = ${num1 + num2}`, num1 + num2]

    case 2:
      if (num1 >= num2) {
        return [`${num1} - ${num2} = ${num1 - num2}`, num1 - num2] 
      } else {
        return [`${num2} − ${num1} = ${num2 - num1}`, num2 - num1]
      }

    case 3:
      return [`${num1} × ${num2} = ${num1 * num2}`, num1 * num2]

    case 4:
      if (num1 % num2 !== 0 && num2 % num1 !== 0) {
        return [`${num1}÷${num2}不能整除`, -1]
      }
      if (num1 >= num2) {
        return [`${num1} ÷ ${num2} = ${num1 / num2}`, num1 / num2]
      } else {
        return [`${num2} ÷ ${num1} = ${num2 / num1}`, num2 / num1]
      }
  }
}

// TODO 更改开始页面的帮助文本的内容
helpText.innerHTML = timeTipText 

// TODO 监听开始按钮点击事件
startBtn.addEventListener('click', () => startGame())

// TODO 监听挑战页面中返回按钮点击事件 
gameBackIndexBtn.addEventListener('click', () => {
  // 停止计时器
  clearTimeout(gameTimeId)
  // 返回开始页面
  changePage(startPage)
})

// TODO 监听结束页面中的返回按钮
endBackIndexBtn.addEventListener('click', () => {
  changePage(startPage)
})

// TODO 监听结束页面中的重新挑战按钮
againBtn.addEventListener('click', () => startGame())

// TODO 监听数字卡片点击事件（事件委托）
cardbox.addEventListener('click', (e) => {
  // 判断是否点击是否为按钮
  if (e.target.tagName !== 'BUTTON') {
    return
  }

  // 获取上次点击的数字卡片
  const activeCard = document.querySelector('.cardbox .active')
  // 获取点击的符号按钮
  const activeBtn = document.querySelector('.operatorbox .active')

  // 判断是否为再次点击
  if (e.target === activeCard) {
    // 取消卡片的高亮
    activeCard.classList.remove('active')
    // 将符号按钮禁用
    for (let i = 0; i < operatorbox.children.length; i++) {
      operatorbox.children[i].disabled = true
    }
    // 防止取消卡片高亮后，符号按钮还在高亮
    if (activeBtn) activeBtn.classList.remove('active')
    return
  }else {
    // 不是再次点击 
    // 判断是否点击了符号按钮
    if (activeBtn) {
      // * 点击了符号按钮
      // 添加当前卡片高亮状态
      e.target.classList.add('active')
      // 设置卡片层级为-1
      activeCard.style.zIndex = '-1'
      // 移动卡片
      activeCard.style.transform =  getCardTransFormString(...getCardDistance(e.target, activeCard))
      // 将卡片禁用
      for (let i = 0; i < cards.length; i++) {
        cards[i].disabled = true
      }
      // 计算结果
      const [formula, result] = calc(+e.target.innerHTML, +activeCard.innerHTML, +activeBtn.dataset.id)
      // 将提示文本改为计算公式
      tipCalcText.innerHTML = formula
      // 判断是否是“不能整除”
      if (result < 0) {
        // - 不能整除
        // 更改提示文本颜色
        tipCalcText.className = 'catculation wrong'
        // 返回卡片
        setTimeout(() => {
          activeCard.style.transform =  getCardTransFormString(0, 0)
          // 将数字卡片启用
          for (let i = 0; i < cards.length; i++) {
            cards[i].disabled = false
          }
          // 设置卡片层级为0
          activeCard.style.zIndex = '0'
        }, CardTransitionTimeMs)
      }else {
        // - 能整除
        setTimeout(() => {
          // 记录操作卡片信息
          step.push([activeCard, e.target, getCardDistance(e.target, activeCard), e.target.innerHTML])
          // 将撤回按钮启用
          revocationBtn.disabled = false
          // 将卡片启用
          for (let i = 0; i < cards.length; i++) {
            cards[i].disabled = false
          }
          // 将计算结果添加在卡片上
          e.target.innerHTML = result
          // 将卡片隐藏
          activeCard.classList.add('hidden')
          // 卡片移动到原来位置
          activeCard.style.transform =  getCardTransFormString(0, 0)
          // 设置卡片层级为0
          activeCard.style.zIndex = '0'
          // 判断是否胜利 -> 显示卡片个数为1，且文本等于24
          if (step.length === 3 && +document.querySelector('.card:not(.hidden)').innerHTML === 24) {
            initGamePage()
            rightText.innerHTML = ++rightCount
          }
        }, CardTransitionTimeMs)
        // 更改提示文本颜色
        tipCalcText.className = 'catculation right'
      }
      setTimeout(() => {
        // 取消高亮
        e.target.classList.remove('active')
        activeCard.classList.remove('active')
        activeBtn.classList.remove('active')
        // 禁用符号按钮
        for (let i = 0; i < operatorbox.children.length; i++) {
          operatorbox.children[i].disabled = true
        }
      }, CardTransitionTimeMs)
    } else {
      // * 没有点击符号按钮
      // 取消上一个卡片的高亮
      if (activeCard) activeCard.classList.remove('active')
      // 添加当前卡片高亮状态
      e.target.classList.add('active')
      // 将符号按钮启用
      for (let i = 0; i < operatorbox.children.length; i++) {
        operatorbox.children[i].disabled = false
      }
    }
  }
})

// TODO 监听符号按钮点击事件（事件委托）
operatorbox.addEventListener('click', (e) => {
  // 判断点击元素是不是符号按钮
  if (e.target.tagName !== 'BUTTON') {
    return
  }

  // 获取上次点击的按钮
  const activeBtn = document.querySelector('.operatorbox .active')

  // 判断是否为再次点击
  if (e.target === activeBtn) {
    // 取消卡片的高亮
    activeBtn.classList.remove('active')
    return
  }else {
    // 取消上一个卡片的高亮
    if (activeBtn) activeBtn.classList.remove('active')
    // 添加当前卡片高亮状态
    e.target.classList.add('active')
  }
})

// TODO 监听重置按钮点击事件
resetBtn.addEventListener('click', () => initGamePage())

// TODO 监听撤回按钮的点击事件
revocationBtn.addEventListener('click' , () => {
  // 取消卡片高亮状态
  const activeCard = document.querySelector('.cardbox .active')
  const activeBtn = document.querySelector('.operatorbox .active')
  // 取消数字卡片高亮
  if (activeCard) activeCard.classList.remove('active')
  // 取消符号按钮高亮
  if (activeBtn) activeBtn.classList.remove('active')
  // 获取卡片最后一次的卡片操作信息
  const [ME, TE, offset, text] = step[step.length - 1]
  // 恢复卡片位置
  ME.style.transform = getCardTransFormString(...offset)
  // 设置卡片层级为-1
  ME.style.zIndex = '-1'
  // 将卡片显示
  ME.classList.remove('hidden')
  setTimeout(() => {
    // 将卡片移动卡片到初始位置
    ME.style.transform = getCardTransFormString(0,0)
    // 卡片数字恢复
    TE.innerHTML = text
    // 将按钮禁用
    revocationBtn.disabled = true
    // 设置卡片层级为-1
    ME.style.zIndex = '0'
  }, 0)
  // 删除此次卡片信息
  step.pop()
  // 判断是否可以继续撤回: 
  console.log(step.length)
  if (step.length === 0) {
    // - 不能 -> 将按钮禁用
    revocationBtn.disabled = true
  } else {
    // - 能 -> 将按钮启用用
    setTimeout(() => revocationBtn.disabled = false, CardTransitionTimeMs)
  }
})

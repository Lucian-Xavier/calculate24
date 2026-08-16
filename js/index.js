// TODO 获取元素
// 开始页面
const startPage = document.querySelector('.start')
const startBtn = document.querySelector('.btn-start')
// 游戏页面
const gamePage = document.querySelector('.game')
const gameBackIndexBtn = document.querySelector('.back-index')
const timetext = document.querySelector('.timetext')
const rightText = document.querySelector('.right-text')
const tipCalcText = document.querySelector('.catculation')
const cardbox = document.querySelector('cardbox')
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
const gameTimeSecond = 5 // 游戏时间：1分30秒


// TODO 定义变量
let gamTimeId = null // 游戏时间计时器的编号

// TODO 定义切换页面函数
/**
 * 切换页面函数
 * @param {Element} page 
 */
let changePage = (page) => {
  document.querySelector('.show').classList.remove('show')
  page.classList.add('show')
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
  // 初始化挑战页面
  initGamePage()
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
      // 切换到结束页面
      changePage(endPage)
      // 停止递归
      return
    }
    console.log(1)
    // 0.9秒后递归函数 -> 防止误差
    gamTimeId = setTimeout(startTime, 900)
  }
  startTime()
}

// TODO 定义卡片开始动画函数
let cardStartAnimate = () => {

}

// TODO 监听开始按钮点击事件
startBtn.addEventListener('click', () => startGame())

// TODO 监听挑战页面中返回按钮点击事件 
gameBackIndexBtn.addEventListener('click', () => {
  // 停止计时器
  clearTimeout(gamTimeId)
  // 返回开始页面
  changePage(startPage)
})

// TODO 监听结束页面中的返回按钮
endBackIndexBtn.addEventListener('click', () => {
  changePage(startPage)
})

// TODO 监听结束页面中的重新挑战按钮
againBtn.addEventListener('click', () => startGame())

// TODO 获取元素
const startPage = document.querySelector('.start')
const gamePage = document.querySelector('.game')
const endPage = document.querySelector('.end')
const overtext = document.querySelector('.over')
const gameBackIndexBtn = document.querySelector('.back-index')
const endBackIndexBtn = document.querySelector('.btn-back')
const againBtn = document.querySelector('.btn-again')
const timetext = document.querySelector('.timetext')
const rightText = document.querySelector('.right-text')
const tipCalcText = document.querySelector('.catculation')
const cardbox = document.querySelector('cardbox')
const cards = document.querySelectorAll('.card')
const operatorbox = document.querySelector('.operatorbox')
const revocationBtn = document.querySelector('.revocation')
const resetBtn = document.querySelector('.reset')

// TODO 定义常量
const timeCalcSecond = 90 // 计算时间：1分30秒

// TODO 定义变量

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

// TODO 监听开始按钮点击事件（事件委托）
startPage.addEventListener('click', e => {
  // 判断是否是点击按钮
  if (e.target.tagName !== "BUTTON") {
    return
  }
  // 显示计算界面
  changePage(gamePage)
  // 初始化挑战页面
  initGamePage()
})

// TODO 监听挑战中页面返回按钮点击事件 -> 返回开始页面
gameBackIndexBtn.addEventListener('click', () => changePage(startPage))

// TODO 计时功能
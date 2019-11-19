import Taro, {
  Component
} from '@tarojs/taro'
import Index from './pages/index/index'

import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/user/user',
      'pages/intellect/intellect'
    ],
    window: {
      backgroundColor: '#f4f4f4',
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      color: '#666',
      selectedColor: '#ed6c00',
      backgroundColor: '#fafafa',
      borderStyle: 'black',
      custom: true,
      list: [{
        pagePath: 'pages/index/index',
        iconPath: 'assets/home.png',
        selectedIconPath: 'assets/home-active.png',
        text: '主页'
      }, {
        pagePath: 'pages/user/user',
        iconPath: 'assets/user.png',
        selectedIconPath: 'assets/user-active.png',
        text: '我的'
      }]
    }
  }

  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return ( <Index /> )
  }
}

Taro.render( <App /> , document.getElementById('app'))

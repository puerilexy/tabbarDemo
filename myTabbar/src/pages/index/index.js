import Taro, {
  Component
} from '@tarojs/taro'
import {
  View,
  Text
} from '@tarojs/components'
import './index.scss'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount () { }

  componentDidMount () { 
  }

  componentWillUnmount () { }

  componentDidShow () { 
    if (typeof this.$scope.getTabBar === 'function' && this.$scope.getTabBar()) {
      this.$scope.getTabBar().$component.setState({
        selected: 0
      })
    }  
  }

  componentDidHide () { }

  render () {
    return (<View className='index'>
      <Text > Hello world! </Text> </View>
    )
  }
}

import Taro, {
  Component
} from '@tarojs/taro'
import {
  View,
  Text
} from '@tarojs/components'
import './intellect.scss'

export default class Intellect extends Component {

  config = {
    navigationBarTitleText: '智能问答'
  }

  componentWillMount () { }

  componentDidMount () { 
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (<View className='intellect'>
      <Text > 智能问答页面 </Text> </View>
    )
  }
}

import Taro, {
  Component
} from '@tarojs/taro'
import {
  View,
  Text
} from '@tarojs/components'
import './user.scss'

export default class User extends Component {

  config = {
    navigationBarTitleText: '我的'
  }

  componentWillMount() {}

  componentDidMount() {
  }

  componentWillUnmount() {}

  componentDidShow() {
    if (typeof this.$scope.getTabBar === 'function' && this.$scope.getTabBar()) {
      this.$scope.getTabBar().$component.setState({
        selected: 1
      })
    }  
  }

  componentDidHide() {}

  render() {
    return ( <View >
      <Text > Hello user! </Text> </View >
    )
  }
}

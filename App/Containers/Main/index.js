import React, { Component } from 'react';
import {
  ScrollView, View, Text, TextInput, TouchableOpacity, AsyncStorage,
  StyleSheet, Platform
} from 'react-native';
import { ActionCable } from 'react-actioncable-provider';
import { compose } from 'react-apollo'
import { fetchCurrentStaff } from '../../Data/Staffs'
import R from 'ramda'
import DataList from './DataList'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
  'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
  'Shake or press menu button for dev menu',
});

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showDataList: true
    }
  }

  componentWillReceiveProps(nextProps) {

  }


  componentDidMount() {

  }


  render() {
    const name = R.path(['viewer', 'viewer', 'name'])(this.props)
    return (
        <View style={styles.container}>
          <View style={{
            paddingLeft: 15,
            paddingRight: 15,
            paddingTop: 10,
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderColor: 'white',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>
            <View style={{ flexDirection: 'row'}}>
            <Text style={{ color: 'white', fontSize: 16 }}>有数派仓库大盘 v1.0.0</Text>

            <Text style={{ color: 'white', fontSize: 16, marginLeft: 15 }}>当前仓库：仓库一</Text>
            </View>

            <View style={{ flexDirection: 'row'}}>
            <Text style={{ color: 'white', fontSize: 16, marginLeft: 15 }}>{`当前账号：${name}`}</Text>

            <Text style={{ color: 'white', fontSize: 16, marginLeft: 15 }}>切换仓库 | 退出登录</Text>
            </View>
          </View>
          <DataList/>
        </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default compose(fetchCurrentStaff)(Main)

import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import UploadFile from "../UploadFile";
import Button from "../../Component/Button";


class Home extends Component {

  static navigationOptions = () => {
    return ({
      headerTitle: 'fe-graphql-demo'
    })
  }


  render() {
    return (
        <View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
          <Button
              onPress={() => this.props.navigation.navigate('UploadFile')}
              containerStyle={styles.buttonContainer}
              style={styles.buttonText}>
            上传 Example
          </Button>
        </View>
    )
  }

}


const styles = {
  buttonContainer: {
    width: '60%',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#007aff',
    borderRadius: 4,
    backgroundColor:'white'
  },
  buttonText: { fontSize: 14, color: '#007aff' }

}

export default Home
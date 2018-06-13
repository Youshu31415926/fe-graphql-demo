import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { ReactNativeFile } from '../../Services/uploadNetworkInterface'

class UploadFile extends Component {

  uploadFile = ()=>{

    const fileUrl = 'getFileUrl';
    const file = new ReactNativeFile({
      uri: fileUrl,
      type: 'image/jpeg',
      name: 'file name'
    });
    this.props.uploadFile({
      variables: {
        input: {
          file,
        }
      }
    })
  };

  render() {
    return (
        <View>
          <TouchableOpacity onPress={this.uploadFile}>
          <Text>上传</Text>
          </TouchableOpacity>

        </View>
    )
  }

}


export default UploadFile
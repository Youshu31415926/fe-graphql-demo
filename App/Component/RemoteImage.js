import React, { Component } from 'react'
import { PixelRatio, Image } from 'react-native'
import R from 'ramda'
import { Colors } from '../Themes'
import ProgressImage from 'react-native-image-progress'
import { Circle } from 'react-native-progress'

/**
 * 加载七牛图片
 * @param props {
 * source url or Image object
   width
   height
   format Image format (jpg/png...)
   quality 1 - 100
   }
 * @returns {XML}
 * @constructor
 */

class RemoteImage extends Component {
  render () {
    const props = this.props
    const url = R.path(['source', 'uri'])(props) || ''
    const hasQuery = url.includes('?')
    const source = R.path(['source', 'uri'])(props) ? { uri: `${R.path(['source', 'uri'])(props)}${hasQuery ? '&' : '?'}imageView2/0/w/${PixelRatio.getPixelSizeForLayoutSize(props.width)}/h/${PixelRatio.getPixelSizeForLayoutSize(props.height)}/format/${props.format || 'jpg'}/q/${props.quality || '60'}/` } : props.source
    const style = Object.assign({}, props.style || {}, {
      width: props.width,
      height: props.height
    })
    if (props.placeholder) {
      return props.placeholder({ style })
    }
    let needPlaceHolder = false
    if (!source || source === '' || !source.uri || source.uri === '') {
      needPlaceHolder = true
    }
    return (needPlaceHolder
          ? <Image
            source={require('../Images/placeholder.jpg')}
            borderRadius={this.props.borderRadius}
            style={style} />
          : <ProgressImage
            indicator={Circle}
            indicatorProps={{
              size: props.width > 30 ? 30 : 10,
              color: Colors.greenContent
            }}
            {...props}
            source={source}
            style={style}
          />
    )
  }
}

RemoteImage.propTypes = {}
RemoteImage.defaultProps = {}

export default RemoteImage

export function getUrl ({ url, width, height, format, quality }) {
  const suffix = `imageView2/0/w/${PixelRatio.getPixelSizeForLayoutSize(width)}/h/${PixelRatio.getPixelSizeForLayoutSize(height)}/format/${format || 'jpg'}/q/${quality || '60'}/`
  let imageUrl = url
  if (url.includes('?')) {
    imageUrl = `${url}&${suffix}`
  } else {
    imageUrl = `${url}?${suffix}`
  }
  return imageUrl
}

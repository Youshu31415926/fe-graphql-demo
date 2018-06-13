import React, { Component } from 'react'
import { compose } from 'react-apollo'
import {
  ScrollView, View, Text, TextInput, TouchableOpacity, AsyncStorage,
  StyleSheet, Platform
} from 'react-native'
import { fetchReadyToShipShipments, fetchPickingShipments } from '../../Data/Shipments'
import { Colors } from '../../Themes'
import R from 'ramda'
import QRCode from 'react-native-qrcode'
import List from '../../Component/List'
import RemoteImage from "../../Component/RemoteImage";
import {
  typeToLabel
} from '../../Services/helpers'

class DataList extends Component {

  renderShipment = (item, index) =>{
    const items = item.items && item.items[0] ? item.items[0] : {}
    const getPropFromPath = (path) => R.path(path)(items)
    const id = R.path(['id'])(item) || ''
    const imageUrl = {uri: R.pathOr(null,  ['images', 0, 'url'])(item)}
    const variantCode = getPropFromPath(['productVariant', 'variantCode']) || ''
    const variantTypeLabel = typeToLabel(getPropFromPath(['productVariant', 'variantTypeLabel']) || '')
    console.tron.log(getPropFromPath(['productVariant', 'variantTypeLabel']) || '')
    console.tron.log(variantTypeLabel)
    const productTypeLabel = `${variantTypeLabel}：${variantCode}`
    const productName = getPropFromPath(['productVariant', 'name']) || '-'
    const totalQuantities = R.path(['totalQuantities'])(item)
    return (<View key={`left-${id}`} style={{flexDirection: 'row', alignItems: 'center', paddingLeft: 15, paddingRight: 15, paddingTop: 10, paddingBottom: 10}}>
      <RemoteImage borderRadius={0} source={imageUrl} width={60} height={60} />
      <Text style={{ color: Colors.greenContent, fontSize: 20, marginLeft: 10 }}>{productName}</Text>
      <Text style={{ color: Colors.greenContent, fontSize: 20, marginLeft: 10 }}>{productTypeLabel}</Text>
      <Text style={{ color: Colors.greenContent, fontSize: 20, marginLeft: 10 }}>{totalQuantities}</Text>
    </View>)
  }

  render() {
    console.tron.log(this.props)
    const pickingShipmentsCount = R.path(['shipments', 'pageInfo', 'totalCount'])(this.props.pickingShipments)
    const leftData = R.path(['shipments', 'nodes'])(this.props.pickingShipments)
    const rightData = R.path(['shipments', 'nodes'])(this.props.readyToShipments)
    const readyToShipmentsCount = R.path(['shipments', 'pageInfo', 'totalCount'])(this.props.readyToShipments)
    return (<View style={{ flex: 1, flexDirection: 'row' }}>
      <View style={{flex: 1, borderRightWidth: 1, borderColor: 'white'}}>
        <View style={{
          width: '100%',
          justifyContent: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          height: 50,
          borderBottomWidth: 1,
          borderColor: 'white'
        }}>
          <Text style={{ color: Colors.greenContent, fontSize: 28 }}>{`待配货`}</Text>
          <Text style={{
            color: Colors.greenContent,
            fontSize: 20,
            marginLeft: 15,
            marginTop: 5
          }}>{`${pickingShipmentsCount} 条`}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <List
              ref={(ref) => {
                this.leftListRef = ref
              }}
              data={leftData}
              itemKey='id'
              renderItem={(item, index) =>
                  this.renderShipment(item, index)
              }
              onFetch={this.props.pickingShipments && this.props.pickingShipments.loadMoreEntries}
              totalPage={R.path(['shipments', 'pageInfo', 'totalPages'])(this.props.pickingShipments)}
              currentPage={R.path(['shipments', 'pageInfo', 'currentPage'])(this.props.pickingShipments)}
              isFetching={R.path(['loading'])(this.props.pickingShipments)}
          /></View>
      </View>
      <View style={{flex: 1}}>
        <View style={{
          width: '100%',
          justifyContent: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          height: 50,
          borderBottomWidth: 1,
          borderColor: 'white'
        }}>
          <Text style={{ color: Colors.greenContent, fontSize: 28 }}>{`待发货`}</Text>
          <Text style={{
            color: Colors.greenContent,
            fontSize: 20,
            marginLeft: 15,
            marginTop: 5
          }}>{`${readyToShipmentsCount} 条`}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <List
              ref={(ref) => {
                this.rightListRef = ref
              }}
              data={rightData}
              itemKey='id'
              renderItem={(item, index) =>
                  this.renderShipment(item, index)
              }
              onFetch={this.props.pickingShipments && this.props.pickingShipments.loadMoreEntries}
              totalPage={R.path(['shipments', 'pageInfo', 'totalPages'])(this.props.pickingShipments)}
              currentPage={R.path(['shipments', 'pageInfo', 'currentPage'])(this.props.pickingShipments)}
              isFetching={R.path(['loading'])(this.props.pickingShipments)}
          /></View>
      </View>
    </View>)
  }


}


export default compose(fetchReadyToShipShipments, fetchPickingShipments)(DataList)
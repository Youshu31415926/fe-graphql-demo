import React, { Component } from 'react'
import PropTypes from 'prop-types'
import R from 'ramda'
import { View, FlatList, RefreshControl, Text, ActivityIndicator, Image } from 'react-native'
import styles from './ListViewStyle'

export default class ListView extends Component {
  // // Prop type warnings
  static propTypes = {
    data: PropTypes.array,
    itemKey: PropTypes.string.isRequired,
    renderItem: PropTypes.func.isRequired,
    currentPage: PropTypes.number,
    totalPage: PropTypes.number,
    emptyView: PropTypes.node,
    onFetch: PropTypes.func,
    isFetching: PropTypes.bool,
    numColumns: PropTypes.number,
    ListHeaderComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.component, PropTypes.element])
  }
  //
  // // Defaults for props
  static defaultProps = {
    currentPage: 1,
    totalPage: 1,
    numColumns: 1
  }

  constructor (props) {
    super(props)
    this.state = {}
  }

  componentWillMount () {
    // this.props.onFetch && this.props.onFetch(1, true)
  }

  componentDidMount () {
    this.onReset()
  }

  onRefresh = () => {
    this.props.onFetch && this.props.onFetch(1)
  }

  // reset a flatList
  onReset = () => {
    this.listRef && this.listRef.scrollToOffset({
      y: 1,
      x: 0
    })
  }

  renderMore = () => {
    if (this.props.isFetching) {
      return
    }

    if (this.props.currentPage >= this.props.totalPage) {
      return
    }

    if (this.props.onFetch) {
      this.props.onFetch(this.props.currentPage + 1)
    }
  }

  render () {
    const {data, itemKey, renderItem, isFetching, numColumns} = this.props
    if (!data) {
      return (
        <View style={styles.container}>

        </View>
      )
    } else {
      return <View style={styles.container}>
        <FlatList
          ref={(ref) => {
            this.listRef = ref
          }}
          style={styles.container}
          data={data}
          keyExtractor={(item) => R.prop(itemKey)(item)}
          renderItem={({item, index}) => renderItem(item, index)}
          onEndReachedThreshold={0.5}
          onEndReached={this.renderMore}
          ListHeaderComponent={this.props.ListHeaderComponent}
          initialNumToRender={10}
          removeClippedSubviews
          numColumns={numColumns}
          showsHorizontalScrollIndicator={false}
          ListFooterComponent={() => this.props.currentPage < this.props.totalPage ? (
            <View style={styles.loadMore}>
              <ActivityIndicator />
              <Text style={styles.loadMoreText}>正在加载更多...</Text>
            </View>) : (<View style={{paddingBottom: 35}} />)}
          delayPressIn={0}
          refreshControl={
            <RefreshControl
              refreshing={!!isFetching && this.props.currentPage === 1}
              onRefresh={this.onRefresh}
            />
          }
        />
      </View>
    }
  }
}

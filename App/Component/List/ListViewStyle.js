import { StyleSheet } from 'react-native'
import { Colors } from '../../Themes'

export default StyleSheet.create({
  container: {
    flex: 1
  },
  loadMore: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadMoreText: {
    marginLeft: 15
  },
  emptyListView: {
    width: '100%',
    height: 500,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyListImage: {
    resizeMode: 'contain',
    alignSelf: 'center',
    width: 128,
    height: 128
  },
})

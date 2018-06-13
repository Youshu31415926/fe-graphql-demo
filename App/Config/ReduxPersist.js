import immutablePersistenceTransform from 'Services/ImmutablePersistenceTransform'
import { AsyncStorage } from 'react-native'
// More info here:  https://shift.infinite.red/shipping-persistant-reducers-7341691232b1
const REDUX_PERSIST = {
  active: true,
  reducerVersion: '8',
  storeConfig: {
    storage: AsyncStorage,
    blacklist: ['nav', 'codepush'], // reducer keys that you do NOT want stored to persistence here
    // persistence. An empty array means 'don't store any reducers' -> infinitered/ignite#409
    transforms: [immutablePersistenceTransform]
  }
}

export default REDUX_PERSIST

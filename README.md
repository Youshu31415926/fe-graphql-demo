#  fe-graphql-demo

有数派在前端中使用的 GraphQL 实践 Demo
由于 react 和 react-native 类似，所以 Demo 的示例使用的是 react-native

## ErrorLink / AuthLink Example

### AuthLink

AuthLink 的使用场景在你想为你的 GraphQL 请求增加 header ，那么就需要添加 AuthLink ，根据不同的业务场景选择合适的你自己的方式


``` javascript

const authLink = setContext(async (req, { headers }) => {
  // get token from your store
  const token = await AsyncStorage.getItem('token');
  // header 中带上 token 信息，及设定的 APP DeviceUuid
  return {
    ...headers,
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
});

```

#### [AuthLink 官方文档](https://www.apollographql.com/docs/react/recipes/authentication.html#Header)


### ErrorLink

ErrorLink 的使用场景在于全局捕获 GraphQL 请求抛出的错误，用来弹出相应的提示或者跳转相应的页面，例如：

* token 失效，跳转至登录
* 请求失败， 弹出 Toast (App) 或者 Tip (Web)

具体场景示例代码：

``` javascript

const errorLink = onError(({ networkError, graphQLErrors }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path, code }) => {
      console.tron.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
      // 假定 401 为 token 失效 code
      if (code === 401) {
        // 跳转至登录页面
        // const index = R.path(['nav', 'index'])(store.getState());
        // const routeName = R.path(['nav', 'routes', index, 'routeName'])(store.getState());
        // routeName !== 'Login' && routeName !== 'LoginForm' && store.dispatch(logoutNavigationAction);
      }

      // Toast.show(`请求错误：${message}`)
    })
  };
  if (networkError) {
    console.tron.log(`[Network error]: ${networkError}`);
    // Toast.show('与服务器断开连接，请检查您的网络状态')
  };
});

```

#### [错误处理官方文档](https://www.apollographql.com/docs/react/features/error-handling.html#network) 

### 使用多个 Link

使用 `concat` 就可以：

` a.concat(b.concat(c))`

``` javascript

const link = authLink.concat(errorLink.concat(httpLink))

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
  // defaultOptions
})


```


## Fragment Example

Q：为什么要使用 Fragment ？

A：Write once use everywhere

使用 Fragment 就是为了复用， 这里的 Fragment 和 Android 的 Fragment 当然是有区别的。

例子：

``` javascript

export const fetchPickingShipments = graphql(gql`
    query ($page: Int, $perPage: Int, $customerId: ID, $productVariantId: ID, $startDate: Date,  $endDate: Date, $creatorId: ID, $status: ShipmentStatus, $orderId: ID, $orderBy: ShipmentOrder, $rawClothNameCont: String, $patternCodeCont: String, $productNameCont: String, $colorCodeCont: String ) {
        shipments (page: $page, perPage: $perPage, customerId: $customerId, productVariantId: $productVariantId, startDate: $startDate, endDate: $endDate, creatorId: $creatorId, status: $status orderId: $orderId, orderBy: $orderBy, rawClothNameCont: $rawClothNameCont, patternCodeCont: $patternCodeCont, productNameCont: $productNameCont, colorCodeCont: $colorCodeCont) {
            nodes{
                ...shipmentInList
            }
            pageInfo {
                ...pageInfo
            }
        }
    }
    ${shipmentInListFragment}
    ${pageInfoFragment}
`, {
  name: 'pickingShipments'})


```

这里的 `shipmentInListFragment` 和 `pageInfoFragment` 就是两个 fragment ，接下来看一下这两个 fragment 是怎么写的 ：

``` javascript
export const shipmentInListFragment = gql`
  fragment shipmentInList on Shipment {
    id
    statusLabel {
      ...label
    }
    
  }
  ${labelFragment}
`

```


``` javascript
export const pageInfoFragment = gql`
  fragment pageInfo on PageInfo {
    totalPages
    perPage
    currentPage
    totalCount
  }
`

```

PS: 在 `Fragment` 中也是可以嵌套使用 `Fragment` 的

### [Fragment 文档](https://graphql.org/learn/queries/#fragments)


## 文件上传

这里需要使用到 [apollo-upload-client](https://github.com/jaydenseric/apollo-upload-client) 

对于 `react-native` File 我们用了 [extract-files](https://github.com/jaydenseric/extract-files/)

也可以使用 formData ， 这里 Demo 用 File 对象进行演示


``` javascript

... 
import { createUploadLink } from 'apollo-upload-client'
...

const httpLink = new createUploadLink({
  uri: 'https://xxxx/graphql'
});

...

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

```

PS： 如果安装 `apollo-upload-client` 报错无法解决，可以使用 [uploadNetworkInterface](/App/Services/uploadNetworkInterface.js)
这个文件

## WebSocket with GraphQL

我们使用了 [graphql-ruby-client](http://graphql-ruby.org/javascript_client/overview) 中的 `ActionCableLink` 


``` javascript

...

import ActionCableAdaper from './App/Services/actioncable-adapter';
import ActionCableLink from 'graphql-ruby-client/subscriptions/ActionCableLink';

...
const cable = ActionCableAdaper.createConsumer('wss://xxxxx/cable?');
...

const link = split(
  // split based on operation type
  ...
  new ActionCableLink({ cable }),
  ...
);

var subs2 = gql`
  subscription {
      ping
  }
`;

export default class App extends Component {
  componentDidMount() {
    const queryObservable = client.subscribe({
      query: subs2,
    });

    console.tron.log(queryObservable.subscribe);


    queryObservable.subscribe({
      next: data => console.tron.log(data),
      error: error => console.tron.log(error)
    });
  }

  render() {

    return (
      <ApolloProvider client={client}>
        <RootStack />
      </ApolloProvider>
    );
  }
}


```

[ActioncableAdapter](/App/Services/actioncable-adapter.js)



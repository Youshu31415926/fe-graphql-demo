/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import Main from './App/Containers/Main';
import { split } from 'apollo-link';
import { ApolloProvider } from 'react-apollo';
import { setContext } from 'apollo-link-context';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import ActionCableAdaper from './App/Services/actioncable-adapter';
import ActionCableLink from 'graphql-ruby-client/subscriptions/ActionCableLink';
import { onError } from 'apollo-link-error';
import { createStackNavigator } from 'react-navigation';
import UploadFile from './App/Containers/UploadFile';
import Home from './App/Containers/Home';
import { createUploadLink } from 'apollo-upload-client'

const token = 'your token';
const cable = ActionCableAdaper.createConsumer('wss://xxxxx/cable?');

const httpLink = new createUploadLink({
  uri: 'https://xxxx/graphql'
});

const authLink = setContext(async (req, { headers }) => {
  // const token = await AsyncStorage.getItem('token');
  // header 中带上 token 信息，及设定的 APP DeviceUuid
  return {
    ...headers,
    headers: {
      Authorization: `your token`
    }
  };
});

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

const concatLink = authLink.concat(errorLink.concat(httpLink));

const hasSubscriptionOperation = ({ query: { definitions } }) => {
  return definitions.some(
    ({ kind, operation }) => kind === 'OperationDefinition' && operation === 'subscription'
  );
};

const link = split(
  // split based on operation type
  hasSubscriptionOperation,
  new ActionCableLink({ cable }),
  concatLink,
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
  // defaultOptions
});

var subs2 = gql`
  subscription {
      ping
  }
`;

type Props = {};

const RootStack = createStackNavigator(
    {
      Home: Home,
      UploadFile: UploadFile,
    },
    {
      initialRouteName: 'Home',
    }
);


export default class App extends Component<Props> {
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


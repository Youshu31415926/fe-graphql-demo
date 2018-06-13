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
import { createUploadLink } from './App/Services/uploadNetworkInterface';
import gql from 'graphql-tag';
// import ActionCableAdaper from './App/Services/actioncable-adapter';
// import ActionCableLink from 'graphql-ruby-client/subscriptions/ActionCableLink';
import { WebSocketLink } from 'apollo-link-ws';

const token = 'your token';
const wsLink = new WebSocketLink({
  uri: `wss://xxxx/cable?jwt=${token}`,
  options: {
    reconnect: true
  }
});

const httpLink = new createUploadLink({
  uri: 'https://xxxx/graphql'
});

const authLink = setContext(async (req, { headers }) => {
  // const token = await AsyncStorage.getItem('token');
  // header 中带上 token 信息，及设定的 APP DeviceUuid
  return {
    ...headers,
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
});

const concatLink = authLink.concat(httpLink);

const hasSubscriptionOperation = ({ query: { definitions } }) => {
  return definitions.some(
    ({ kind, operation }) => kind === 'OperationDefinition' && operation === 'subscription'
  );
};

const link = split(
  // split based on operation type
  hasSubscriptionOperation,
  wsLink,
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

export default class App extends Component<Props> {
  componentDidMount() {
    const queryObservable = client.subscribe({
      query: subs2,
    });

    console.tron.log(queryObservable.subscribe);


    queryObservable.subscribe({
      next: data => console.warn(data),
      error: error => console.warn(error)
    });
  }

  render() {

    return (
      <ApolloProvider client={client}>
        <Main />
      </ApolloProvider>
    );
  }
}


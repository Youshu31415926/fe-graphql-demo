import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import R from 'ramda'
import { shipmentFragment, shipmentInListFragment } from '../Fragments/shipment'
import { labelFragment, pageInfoFragment } from '../Fragments/label'
import { fetchMoreProps } from '../../Services/helpers'

export const fetchShipments = graphql(gql`
  query ($page: Int, $perPage: Int) {
    shipments (page: $page, perPage: $perPage) {
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
  name: 'shipments',
  options: (props) => ({
    fetchPolicy: 'cache-and-network',
    variables: {
      page: 1,
      perPage: 10
    }
  }),
})

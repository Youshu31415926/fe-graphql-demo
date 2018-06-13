import gql from 'graphql-tag'
import { labelFragment } from './label'


export const shipmentInListFragment = gql`
  fragment shipmentInList on Shipment {
    id
    statusLabel {
      ...label
    }
  }
  ${labelFragment}
`

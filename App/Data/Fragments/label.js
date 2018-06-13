import gql from 'graphql-tag'

export const addressFragment = gql`
  fragment address on Address {
    id
    province
    city
    area
    street
    category
  }
`

export const labelFragment = gql`
  fragment label on EnumLabel {
    name
    zh_CN
  }
`

export const pageInfoFragment = gql`
  fragment pageInfo on PageInfo {
    totalPages
    perPage
    currentPage
    totalCount
  }
`

export const attachmentFragment = gql`
  fragment attachment on Attachment {
    id
    url
    byteSize
    contentType
    createdAt
    filename
  }
`

export const optionalInputFragment = gql`
  fragment optionalInput on OptionalInput {
    column {
      id
      type
      name
      label
    }
    value
    values
    valueForEmployee {
      id
      name
    }
    valueForEmployees {
      id
      name
    }
  }
`
export const optionalColumnFragment = gql`
  fragment optionalColumn on OptionalColumn {
    id
    label
    name
    type
    hint
    defaultVal
    collection
    collectionForUi {
      label
      value
    }
    validations {
      acceptance
      presence
      length {
        is
        maximum
        minimum
      }
    }
  }
`

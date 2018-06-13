import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { labelFragment } from '../Fragments/label'
import R from 'ramda'
import moment from 'moment'

export const fetchCurrentStaff = graphql(gql`
  query {
    viewer {
      id
      mobile
      name
      position
      positionLabel{
        ...label
      }
      avatar
      role {
        id
        name
        appMenu
      }
      company {
        id
        name
      }
      department {
        id
        name
      }
    }
  }
  ${labelFragment}
`, {name: 'viewer'})

export const fetchCurrentStaffNoticationSetting = graphql(gql`
  query {
    viewer {
      id
      setting {
        id
        notification {
          name
          value
        }
      }
    }
  }
`, {
  name: 'viewer',
  options: {
    fetchPolicy: 'network-only'
  }})

export const fetchAllStaffs = graphql(gql`
  query ($page: Int, $perPage: Int){
    employees (page: $page, perPage: $perPage) {
      nodes{
        id
        name
        department {
          id
        }
        mobile
        name
        position
        pyName  
      }
    }
  }
`, {
  name: 'staffs',
  options: {variables: {page: 1, perPage: Number.MAX_SAFE_INTEGER}}
})

export const fetchEmployeeById = graphql(gql`
  query ($id: ID!){
    employee (id: $id) {
      id
      name
      department {
        id
        name
      }
      gender
      mobile
      confirmedAt
      avatar
      role {
        id
        builtInNameLabel{
          ...label
        }  
      }
      leftAt
    } 
    
  }
  ${labelFragment}
`, {
  name: 'employee',
  options: (props) => ({
    fetchPolicy: 'cache-and-network',
    variables: {id: R.path(['navigation', 'state', 'params', 'id'])(props) || ''}})
})

export const myBusinessStats = graphql(gql`
  query ($employeeId: ID!, $startDate: Date!, $endDate: Date!){
    myBusinessStats (employeeId: $employeeId, startDate: $startDate, endDate: $endDate) {
      ordersQuantities
      ordersSumPrice
      shipmentsQuantities
      shipmentsSumPrice
      patternsDesignerOrdersQuantities
      patternsDesignerOrdersCount
      patternsDrafterOrdersQuantities
      patternsDrafterOrdersCount
      patternsColorerOrdersQuantities
      patternsColorerOrdersCount
      productionsAssigneeCount
      productionsAssigneeQuantities
      productionsProducerCount
      productionsProducerQuantities
      batchClothsCount
      batchClothsQuantities
      defectsCount
    }

  }
`, {
  name: 'myBusinessStats',
  options: (props) => ({
    fetchPolicy: 'cache-and-network',
    variables: {
      employeeId: R.path(['navigation', 'state', 'params', 'id'])(props) || '',
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD')
    }})
})

export const updateEmployee = graphql(gql`
  mutation ($input: UpdateEmployeeInput!) {
    updateEmployee(input: $input) {
      employee {
        id
      }
    }
  }
`, {
  name: 'updateEmployee'
})

export const roleTypeQuery = graphql(gql`
query {
  __type(name: "BuiltInRole"){
    enumValues{
      name
      description
    }
  }
}
`, {name: 'roleTypeQuery'})

export const createAttachment = graphql(gql`
    mutation ($input:  CreateAttachmentInput!) {
        createAttachment(input: $input) {
            attachment {
                id
                url
                filename
            }
        }
    }
`, {
  name: 'createAttachment'
})

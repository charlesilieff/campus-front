import React, { useEffect, useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Badge, Button, Col, Row, Table } from 'reactstrap'

import { useAppDispatch, useAppSelector } from 'app/config/store'
import { getSystemHealth } from '../administration.reducer'
import HealthModal from './health-modal'

export const HealthPage = () => {
  const [healthObject, setHealthObject] = useState({})
  const [showModal, setShowModal] = useState(false)
  const dispatch = useAppDispatch()

  const health = useAppSelector(state => state.administration.health)
  const isFetching = useAppSelector(state => state.administration.loading)

  useEffect(() => {
    dispatch(getSystemHealth())
  }, [])

  const fetchSystemHealth = () => {
    if (!isFetching) {
      dispatch(getSystemHealth())
    }
  }

  const getSystemHealthInfo = (name, healthObj) => () => {
    setShowModal(true)
    setHealthObject({ ...healthObj, name })
  }

  const handleClose = () => setShowModal(false)

  const renderModal = () => (
    <HealthModal healthObject={healthObject} handleClose={handleClose} showModal={showModal} />
  )

  const data = (health || {}).components || {}

  return (
    <div>
      <h2 id="health-page-heading" data-cy="healthPageHeading">
        Health Checks
      </h2>
      <p>
        <Button
          onClick={fetchSystemHealth}
          color={isFetching ? 'btn btn-danger' : 'btn btn-primary'}
          disabled={isFetching}
        >
          <FontAwesomeIcon icon="sync" />
          &nbsp; Refresh
        </Button>
      </p>
      <Row>
        <Col md="12">
          <Table bordered aria-describedby="health-page-heading">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(data).map((configPropKey, configPropIndex) =>
                configPropKey !== 'status' ?
                  (
                    <tr key={configPropIndex}>
                      <td>{configPropKey}</td>
                      <td>
                        <Badge color={data[configPropKey].status !== 'UP' ? 'danger' : 'success'}>
                          {data[configPropKey].status}
                        </Badge>
                      </td>
                      <td>
                        {data[configPropKey].details ?
                          (
                            <a onClick={getSystemHealthInfo(configPropKey, data[configPropKey])}>
                              <FontAwesomeIcon icon="eye" />
                            </a>
                          ) :
                          null}
                      </td>
                    </tr>
                  ) :
                  null
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
      {renderModal()}
    </div>
  )
}

export default HealthPage

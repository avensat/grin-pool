import React, { Component } from 'react'
import { Col, Row, Table, Alert } from 'reactstrap'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { C29_COLOR, C30_COLOR } from '../../constants/styleConstants.js'

export class MinerDataComponent extends Component {
  UNSAFE_componentWillMount () {
    this.fetchMinerData()
  }

  componentDidUpdate (prevProps) {
    const { latestBlockHeight } = this.props
    if (prevProps.latestBlockHeight !== latestBlockHeight) {
      this.fetchMinerData()
    }
  }

  fetchMinerData = () => {
    const { fetchMinerData } = this.props
    fetchMinerData()
  }

  render () {
    const { minerData } = this.props
    const numberOfRecordedBlocks = minerData.length
    const noBlocksAlertSyntax = 'Mining data may take a few minutes to show up after you start mining'
    const graphRateData = []
    let maxC29Gps = 0
    let minC29Gps = 0
    let maxC30Gps = 0
    let minC30Gps = 0
    minerData.forEach((block) => {
      if (block.gps[0]) {
        if (block.gps[0].gps > maxC29Gps || !maxC29Gps) maxC29Gps = block.gps[0].gps
        if (block.gps[0].gps < minC29Gps || !minC29Gps) minC29Gps = block.gps[0].gps
      }
      if (block.gps[1]) {
        if (block.gps[1].gps > maxC30Gps || !maxC30Gps) maxC30Gps = block.gps[1].gps
        if (block.gps[1].gps < minC30Gps || !minC30Gps) minC30Gps = block.gps[1].gps
      }

      graphRateData.push({
        height: block.height,
        gps: block.gps,
        difficulty: block.difficulty
      })
    })
    let c29LatestGraphRate = 'C29 = 0 gps'
    let c30LatestGraphRate = 'C30 = 0 gps'
    if (minerData.length > 0) {
      const lastBlock = minerData[minerData.length - 1]
      if (lastBlock.gps[0]) {
        c29LatestGraphRate = `C${lastBlock.gps[0].edge_bits} = ${lastBlock.gps[0].gps.toFixed(4)} gps`
      }
      if (lastBlock.gps[1]) {
        c30LatestGraphRate = `C${lastBlock.gps[1].edge_bits} = ${lastBlock.gps[1].gps.toFixed(4)} gps`
      }
    } else {
      c29LatestGraphRate = '0 gps'
      c30LatestGraphRate = '0 gps'
    }
    return (
      <Row xs={12} md={12} lg={12} xl={12}>
        <Col xs={12} md={12} lg={5} xl={3}>
          <h4 className='page-title' style={{ marginBottom: 36 }}>Miner Stats</h4>
          <Table size='sm'>
            <tbody>
              <tr>
                <td>Graph Rate</td>
                <td><span style={{ color: C29_COLOR }}>{c29LatestGraphRate}</span><br /><span style={{ color: C30_COLOR }}>{c30LatestGraphRate}</span></td>
              </tr>
              <tr>
                <td>Block Found</td>
                <td>Test</td>
              </tr>
              <tr>
                <td>Blocks Found</td>
                <td>Test</td>
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col xs={12} md={12} lg={7} xl={9}>
          <h4 className='page-title'>Graph Rate</h4>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>{(numberOfRecordedBlocks === 0) && <Alert color='warning' style={{ textAlign: 'center', display: 'inline' }}>{noBlocksAlertSyntax}</Alert>}</div>
          <ResponsiveContainer width='100%' height={270}>
            <LineChart isAnimationActive={false} data={graphRateData} >
              <XAxis interval={19} dataKey='height'/>
              <Tooltip />
              <Legend verticalAlign='top' height={36}/>
              <YAxis tickFormatter={(value) => parseFloat(value).toFixed(4)} connectNulls={true} yAxisId='left' orientation='left' stroke={C29_COLOR} domain={[minC29Gps, maxC29Gps]} allowDecimals={true} />
              <Line dot={false} yAxisId='left' name='C29 Graph Rate' dataKey='gps[0].gps' stroke={C29_COLOR} />
              <YAxis connectNulls={true} yAxisId='right' orientation='right' stroke={C30_COLOR} domain={[minC30Gps, maxC30Gps]} allowDecimals={true} />
              <Line dot={false} yAxisId='right' name='C30 Graph Rate' dataKey='gps[1].gps' stroke={C30_COLOR} />
            </LineChart>
          </ResponsiveContainer>
        </Col>
      </Row>
    )
  }
}

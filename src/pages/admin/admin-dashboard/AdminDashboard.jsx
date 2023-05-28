import React from 'react'
import './AdminDashboard.scss'
import { CWidgetStatsA, CCol, CDropdownToggle, CDropdown, CDropdownMenu, CDropdownItem, CWidgetStatsE, CWidgetStatsF } from '@coreui/react'
import { cilArrowTop, cilBook, cilOptions } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CChartLine, CChartBar } from '@coreui/react-chartjs'

export default function AdminDashboard() {
  return (
    <div className="cardLayout">

      <h2 className="dashboardTitle">Perpustakaan Digital SMA Yuppentek 1 Kota Tangerang</h2>
      <div className="dashboardContainer">
        {/* <div className="jumlahBukuContainer"> */}
        <CCol xs={6}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cilBook} height={24} />}
            padding={false}
            title="Jumlah Buku"
            value="200" />
        </CCol>
        {/* </div> */}
        <div className="inventarisContainer">
          {/* <div className="peminjaman">Jumlah Peminjaman di Bulan Agustus : 5</div> */}
          <CCol xs={6} className="peminjaman">
            <CWidgetStatsE
              className="mb-3"
              chart={
                <CChartBar
                  className="mx-auto"
                  style={{ height: '120px', width: '175px' }}
                  data={{
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sept', 'Okt', 'Nov', 'Des', 'Jan', 'Feb', 'Mar'],
                    datasets: [
                      {
                        backgroundColor: '#321fdb',
                        borderColor: 'transparent',
                        borderWidth: 1,
                        data: [41, 78, 51, 66, 74, 42, 89, 97, 87, 84, 78, 88, 67, 45, 47],
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      x: {
                        display: false,
                      },
                      y: {
                        display: false,
                      },
                    },
                  }}
                />
              }
              title="Jumlah Peminjaman / Bulan"
              value="52"
            />
          </CCol>
          <CCol sm={5} className="pengembalian">
            <CWidgetStatsA
              style={{ textAlign: 'left' }}
              className="mb-4"
              color="primary"
              value={
                <>
                  120{' '}
                  <span className="fs-6 fw-normal">
                    (40% <CIcon icon={cilArrowTop} />)
                  </span>
                </>
              }
              title="Jumlah Anggota / Bulan"
              action={
                <CDropdown alignment="end">
                  <CDropdownToggle color="transparent" caret={false} className="p-0">
                    <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem>Action</CDropdownItem>
                    <CDropdownItem>Another action</CDropdownItem>
                    <CDropdownItem>Something else here...</CDropdownItem>
                    <CDropdownItem disabled>Disabled action</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              }
              chart={
                <CChartLine
                  className="mt-3 mx-3"
                  style={{ height: '90px' }}
                  data={{
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    datasets: [
                      {
                        label: 'My First dataset',
                        backgroundColor: 'transparent',
                        borderColor: 'rgba(255,255,255,.55)',
                        pointBackgroundColor: '#321fdb',
                        data: [65, 59, 84, 84, 51, 55, 40],
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        grid: {
                          display: false,
                          drawBorder: false,
                        },
                        ticks: {
                          display: false,
                        },
                      },
                      y: {
                        min: 30,
                        max: 89,
                        display: false,
                        grid: {
                          display: false,
                        },
                        ticks: {
                          display: false,
                        },
                      },
                    },
                    elements: {
                      line: {
                        borderWidth: 1,
                        tension: 0.4,
                      },
                      point: {
                        radius: 4,
                        hitRadius: 10,
                        hoverRadius: 4,
                      },
                    },
                  }}
                />
              }
            />
          </CCol>
          {/* <div className="pengembalian">Kategori Buku : 8</div> */}
        </div>

      </div>
    </div>
  )
}

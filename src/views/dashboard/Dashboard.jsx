import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import moment from 'moment'
import {
  CAvatar,
  CButton,
  CCard,
  CCardBody,
  CCardSubtitle,
  CCardTitle,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CWidgetStatsA,
} from '@coreui/react-pro'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import {
  // cibGoogle,
  // cibFacebook,
  // cibLinkedin,
  // cibTwitter,
  // cilUser,
  // cilUserFemale,
  cilPeople,
  cilArrowBottom,
  cilBook,
  cilArrowTop,
  cilUserPlus,
  cilOptions,
} from '@coreui/icons'

const Dashboard = () => {
  const [totalBooks, setTotalBooks] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [peminjaman, setPeminjaman] = useState([])
  const [siswa, setSiswa] = useState([])

  useEffect(() => {
    // Fetch total number of books
    axios
      .get('http://localhost:3005/book')
      .then((response) => {
        setTotalBooks(response.data.data.length)
      })
      .catch((error) => {
        console.error('Error fetching total number of books:', error)
      })

    // Fetch total number of users
    axios
      .get('http://localhost:3005/siswa')
      .then((response) => {
        setTotalUsers(response.data.data.length)
        setSiswa(response.data.data)
        console.log(response.data.data)
      })
      .catch((error) => {
        console.error('Error fetching Siswa data::', error)
      })

    // Fetch chartData from peminjaman
    axios
      .get('http://localhost:3005/peminjaman')
      .then((response) => {
        setPeminjaman(response.data.data)
        console.log(response.data.chartData)
      })
      .catch((error) => {
        console.error('Error fetching Siswa data::', error)
      })
  }, [])

  const sortedData = siswa.sort((a, b) => b.jumlahPinjam - a.jumlahPinjam)
  const filteredData = sortedData.slice(0, 6)

  const formatWaktuPinjam = (waktuPinjam) => {
    if (waktuPinjam === null) {
      return 'Belum Pinjam'
    }
    const now = moment() // Get the current time
    const pinjamTime = moment(waktuPinjam) // Convert the waktuPinjam to a Moment object

    // Calculate the difference in minutes between now and pinjamTime
    const diffInMinutes = now.diff(pinjamTime, 'minutes')

    if (diffInMinutes < 1) {
      return 'Just now'
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`
    } else if (diffInMinutes < 1440) {
      const diffInHours = Math.floor(diffInMinutes / 60)
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`
    } else {
      const diffInDays = Math.floor(diffInMinutes / 1440)
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`
    }
  }

  const calculateTotalDenda = (peminjaman) => {
    let totalDenda = 0
    peminjaman.forEach((item) => {
      const dendaValue = item.denda
        ? parseFloat(item.denda.replace('Rp. ', '').replace(',', ''))
        : 0
      totalDenda += dendaValue
    })
    const formattedDenda = 'Rp ' + totalDenda.toFixed(2)
    return formattedDenda
  }

  const chartBartRef = useRef(null)
  const chartLineRef = useRef(null)

  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (chartBartRef.current) {
        setTimeout(() => {
          chartBartRef.current.options.scales.x.grid.color = getStyle(
            '--cui-border-color-translucent',
          )
          chartBartRef.current.options.scales.x.ticks.color = getStyle('--cui-body-color')
          chartBartRef.current.options.scales.y.grid.color = getStyle(
            '--cui-border-color-translucent',
          )
          chartBartRef.current.options.scales.y.ticks.color = getStyle('--cui-body-color')
          chartBartRef.current.update()
        })
      }

      if (chartLineRef.current) {
        setTimeout(() => {
          chartLineRef.current.datasets[0].pointBackgroundColor = getStyle('--cui-primary')
          chartLineRef.current.update()
        })
      }
    })
  }, [chartBartRef, chartLineRef])

  // const progressGroupExample1 = [
  //   { title: 'Monday', value1: 34, value2: 78 },
  //   { title: 'Tuesday', value1: 56, value2: 94 },
  //   { title: 'Wednesday', value1: 12, value2: 67 },
  //   { title: 'Thursday', value1: 43, value2: 91 },
  //   { title: 'Friday', value1: 22, value2: 73 },
  //   { title: 'Saturday', value1: 53, value2: 82 },
  //   { title: 'Sunday', value1: 9, value2: 69 },
  // ]

  // const progressGroupExample2 = [
  //   { title: 'Male', icon: cilUser, value: 53 },
  //   { title: 'Female', icon: cilUserFemale, value: 43 },
  // ]

  // const progressGroupExample3 = [
  //   { title: 'Organic Search', icon: cibGoogle, percent: 56, value: '191,235' },
  //   { title: 'Facebook', icon: cibFacebook, percent: 15, value: '51,223' },
  //   { title: 'Twitter', icon: cibTwitter, percent: 11, value: '37,564' },
  //   { title: 'LinkedIn', icon: cibLinkedin, percent: 8, value: '27,319' },
  // ]

  return (
    <>
      <CRow>
        <CCol xl={4}>
          <CRow>
            <CCol lg={12}>
              <CCard className="mb-4">
                <CCardBody className="p-4">
                  <CRow>
                    <CCol>
                      <CCardTitle className="fs-4 fw-semibold">Denda</CCardTitle>
                      <CCardSubtitle className="fw-normal text-disabled">
                        January - July 2023
                      </CCardSubtitle>
                    </CCol>
                    <CCol className="text-end text-primary fs-4 fw-semibold">
                      {calculateTotalDenda(peminjaman)}
                    </CCol>
                  </CRow>
                </CCardBody>
                <CChartLine
                  className="mt-3"
                  style={{ height: '150px' }}
                  data={{
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    datasets: [
                      {
                        label: 'My First dataset',
                        backgroundColor: `rgba(${getStyle('--cui-primary-rgb')}, .1)`,
                        borderColor: getStyle('--cui-primary'),
                        borderWidth: 3,
                        data: [78, 81, 80, 45, 34, 22, 40],
                        fill: true,
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
                        display: false,
                      },
                      y: {
                        beginAtZero: true,
                        display: false,
                      },
                    },
                    elements: {
                      line: {
                        borderWidth: 2,
                        tension: 0.4,
                      },
                      point: {
                        radius: 0,
                        hitRadius: 10,
                        hoverRadius: 4,
                      },
                    },
                  }}
                />
              </CCard>
            </CCol>
            <CCol lg={6}>
              <CCard className="mb-4">
                <CCardBody>
                  <div className="d-flex justify-content-between">
                    <CCardTitle className="text-disabled">Anggota</CCardTitle>
                    <div className="bg-primary bg-opacity-25 text-primary p-2 rounded">
                      <CIcon icon={cilPeople} size="xl" />
                    </div>
                  </div>
                  <div className="fs-4 fw-semibold pb-3">{totalUsers}</div>
                  {/* <small className="text-danger">
                    (-12.4% <CIcon icon={cilArrowBottom} />)
                  </small> */}
                </CCardBody>
              </CCard>
            </CCol>
            <CCol lg={6}>
              <CCard className="mb-4">
                <CCardBody>
                  <div className="d-flex justify-content-between">
                    <CCardTitle className="text-disabled">Jumlah Buku</CCardTitle>
                    <div className="bg-primary bg-opacity-25 text-primary p-2 rounded">
                      <CIcon icon={cilBook} size="xl" />
                    </div>
                  </div>
                  <div className="fs-4 fw-semibold pb-3">{totalBooks}</div>
                  {/* <small className="text-success">
                    (17.2% <CIcon icon={cilArrowTop} />)
                  </small> */}
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCol>
        <CCol xl={8}>
          <CCard className="mb-4">
            <CCardBody className="p-4">
              <CCardTitle className="fs-4 fw-semibold">Traffic</CCardTitle>
              <CCardSubtitle className="fw-normal text-disabled">
                January 01, 2021 - December 31, 2021
              </CCardSubtitle>
              <CChartBar
                ref={chartBartRef}
                data={{
                  labels: [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                  ],
                  datasets: [
                    {
                      label: 'Users',
                      backgroundColor: getStyle('--cui-primary'),
                      borderRadius: 6,
                      borderSkipped: false,
                      data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
                      barPercentage: 0.6,
                      categoryPercentage: 0.5,
                    },
                    {
                      label: 'New users',
                      backgroundColor: getStyle('--cui-gray-200'),
                      borderRadius: 6,
                      borderSkipped: false,
                      data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
                      barPercentage: 0.6,
                      categoryPercentage: 0.5,
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
                      grid: {
                        color: getStyle('--cui-border-color-translucent'),
                        display: false,
                        drawBorder: false,
                        drawTicks: false,
                      },
                      ticks: {
                        color: getStyle('--cui-body-color'),
                        font: {
                          size: 14,
                        },
                        padding: 16,
                      },
                    },
                    y: {
                      grid: {
                        color: getStyle('--cui-border-color-translucent'),
                        drawBorder: false,
                        borderDash: [2, 4],
                      },
                      gridLines: {
                        borderDash: [8, 4],
                        color: '#348632',
                      },
                      ticks: {
                        beginAtZero: true,
                        color: getStyle('--cui-body-color'),
                        font: {
                          size: 14,
                        },
                        maxTicksLimit: 5,
                        padding: 16,
                        stepSize: Math.ceil(100 / 4),
                      },
                    },
                  },
                }}
                style={{ height: '300px', marginTop: '40px' }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol xl={9}>
          <CCard className="mb-4">
            <CCardBody className="p-4">
              <CRow>
                <CCol>
                  <CCardTitle className="fs-4 fw-semibold">Peminjam Terbanyak</CCardTitle>
                  <CCardSubtitle className="fw-normal text-disabled mb-4">
                    dari {siswa.length} anggota terdaftar
                  </CCardSubtitle>
                </CCol>
                <CCol xs="auto" className="ms-auto">
                  <CButton color="secondary" href="/dataPeminjaman">
                    <CIcon icon={cilUserPlus} className="me-2" />
                    Tambah Data Peminjaman
                  </CButton>
                </CCol>
              </CRow>
              <CTable align="middle" className="mb-0" hover responsive>
                <CTableHead className="fw-semibold text-disabled">
                  <CTableRow>
                    <CTableHeaderCell className="text-center">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell>Nama</CTableHeaderCell>
                    <CTableHeaderCell /*className="text-center"*/>Kelas</CTableHeaderCell>
                    <CTableHeaderCell>Jumlah Pinjam</CTableHeaderCell>
                    <CTableHeaderCell>Activity</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredData.map((item) => (
                    <CTableRow key={item.NIS}>
                      <CTableDataCell className="text-center">
                        <CAvatar
                          size="md"
                          // eslint-disable-next-line prettier/prettier
                          src={`https://ui-avatars.com/api/?name=${item.Nama ? item.Nama : undefined
                            // eslint-disable-next-line prettier/prettier
                            }&background=random`}
                          status="success"
                        />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.Nama}</div>
                        <div className="small text-disabled text-nowrap"> NIS: {item.NIS}</div>
                      </CTableDataCell>
                      <CTableDataCell /*className="text-center"*/>
                        <div>
                          {item.Kelas} {item.Jurusan}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex justify-content-between mb-1">
                          <div className="fw-semibold">{item.jumlahPinjam}</div>
                          <div className="small text-disabled ms-1 text-nowrap">
                            {/* {item.usage.period} */}
                          </div>
                        </div>
                        <CProgress thin color="#29266a" value={item.jumlahPinjam} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="small text-disabled">Terakhir Pinjam</div>
                        <div className="fw-semibold text-nowrap">
                          {formatWaktuPinjam(item.waktuPinjam)}
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xl={3}>
          <CRow>
            <CCol md={4} xl={12}>
              <CWidgetStatsA
                className="mb-4"
                color="primary-gradient"
                value={
                  <>
                    26K{' '}
                    <span className="fs-6 fw-normal">
                      (-12.4% <CIcon icon={cilArrowBottom} />)
                    </span>
                  </>
                }
                title="Users"
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
                    style={{ height: '85px' }}
                    data={{
                      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'transparent',
                          borderColor: 'rgba(255,255,255,.55)',
                          pointBackgroundColor: getStyle('--cui-primary'),
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
            <CCol md={4} xl={12}>
              <CWidgetStatsA
                className="mb-4"
                color="warning-gradient"
                value={
                  <>
                    2.49{' '}
                    <span className="fs-6 fw-normal">
                      (84.7% <CIcon icon={cilArrowTop} />)
                    </span>
                  </>
                }
                title="Conversion Rate"
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
                    className="mt-3"
                    style={{ height: '85px' }}
                    data={{
                      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'rgba(255,255,255,.2)',
                          borderColor: 'rgba(255,255,255,.55)',
                          data: [78, 81, 80, 45, 34, 12, 40],
                          fill: true,
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
                          display: false,
                        },
                        y: {
                          display: false,
                        },
                      },
                      elements: {
                        line: {
                          borderWidth: 2,
                          tension: 0.4,
                        },
                        point: {
                          radius: 0,
                          hitRadius: 10,
                          hoverRadius: 4,
                        },
                      },
                    }}
                  />
                }
              />
            </CCol>
            <CCol md={4} xl={12}>
              <CWidgetStatsA
                className="mb-4"
                color="danger-gradient"
                value={
                  <>
                    44K{' '}
                    <span className="fs-6 fw-normal">
                      (-23.6% <CIcon icon={cilArrowBottom} />)
                    </span>
                  </>
                }
                title="Sessions"
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
                  <CChartBar
                    className="mt-3 mx-3"
                    style={{ height: '85px' }}
                    data={{
                      labels: [
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                        'July',
                        'August',
                        'September',
                        'October',
                        'November',
                        'December',
                        'January',
                        'February',
                        'March',
                        'April',
                      ],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'rgba(255,255,255,.2)',
                          borderColor: 'rgba(255,255,255,.55)',
                          data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
                          barPercentage: 0.6,
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
                          grid: {
                            display: false,
                            drawTicks: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                        y: {
                          grid: {
                            display: false,
                            drawBorder: false,
                            drawTicks: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                      },
                    }}
                  />
                }
              />
            </CCol>
          </CRow>
        </CCol>
      </CRow>
      {/* <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardBody className="p-4">
              <CCardTitle className="fs-4 fw-semibold">Traffic</CCardTitle>
              <CCardSubtitle className="fw-normal text-disabled border-bottom mb-3 pb-4">
                Last Week
              </CCardSubtitle>
              <CRow>
                <CCol xs={12} md={6} xl={6}>
                  <CRow>
                    <CCol sm={6}>
                      <div className="border-start border-start-4 border-start-info py-1 px-3 mb-3">
                        <div className="text-disabled small">New Clients</div>
                        <div className="fs-5 fw-semibold">9,123</div>
                      </div>
                    </CCol>
                    <CCol sm={6}>
                      <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3">
                        <div className="text-disabled small">Recurring Clients</div>
                        <div className="fs-5 fw-semibold">22,643</div>
                      </div>
                    </CCol>
                  </CRow>
                  <div className="border-top mb-4" />
                  {progressGroupExample1.map((item, index) => (
                    <div className="progress-group mb-4" key={index}>
                      <div className="progress-group-prepend">
                        <span className="text-disabled small">{item.title}</span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="info-gradient" value={item.value1} />
                        <CProgress thin color="danger-gradient" value={item.value2} />
                      </div>
                    </div>
                  ))}
                </CCol>
                <CCol xs={12} md={6} xl={6}>
                  <CRow>
                    <CCol sm={6}>
                      <div className="border-start border-start-4 border-start-warning py-1 px-3 mb-3">
                        <div className="text-disabled small">Pageviews</div>
                        <div className="fs-5 fw-semibold">78,623</div>
                      </div>
                    </CCol>
                    <CCol sm={6}>
                      <div className="border-start border-start-4 border-start-success py-1 px-3 mb-3">
                        <div className="text-disabled small">Organic</div>
                        <div className="fs-5 fw-semibold">49,123</div>
                      </div>
                    </CCol>
                  </CRow>
                  <div className="border-top mb-4" />
                  {progressGroupExample2.map((item, index) => (
                    <div className="progress-group mb-4" key={index}>
                      <div className="progress-group-header">
                        <CIcon className="me-2" icon={item.icon} size="lg" />
                        <span>{item.title}</span>
                        <span className="ms-auto fw-semibold">{item.value}%</span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="warning-gradient" value={item.value} />
                      </div>
                    </div>
                  ))}

                  <div className="mb-5"></div>

                  {progressGroupExample3.map((item, index) => (
                    <div className="progress-group" key={index}>
                      <div className="progress-group-header">
                        <CIcon className="me-2" icon={item.icon} size="lg" />
                        <span>{item.title}</span>
                        <span className="ms-auto fw-semibold">
                          {item.value}{' '}
                          <span className="text-disabled small">({item.percent}%)</span>
                        </span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="success-gradient" value={item.percent} />
                      </div>
                    </div>
                  ))}
                </CCol>
              </CRow>

              <br />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow> */}
    </>
  )
}

export default Dashboard

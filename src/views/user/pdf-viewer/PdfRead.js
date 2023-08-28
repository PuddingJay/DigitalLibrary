/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
// import { Document, Page, pdfjs } from 'react-pdf'
import { Document, Page, pdfjs } from 'react-pdf'
import pdfjsWorker from 'react-pdf/node_modules/pdfjs-dist/build/pdf.worker.entry'

import { useParams } from 'react-router-dom'
import axios from 'axios'
import NavbarComponent from '../../../component/navbar/NavbarComponent'
import './PdfViewer.scss'
import { CFooter, CLink } from '@coreui/react-pro'
import { CImage } from '@coreui/react'

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker
function PdfRead() {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [pdfBlob, setPdfBlob] = useState(null)
  const [jumpToPage, setJumpToPage] = useState(1)
  const [showContextMenuWarning, setShowContextMenuWarning] = useState(false)

  const linkUper = 'https://universitaspertamina.ac.id/'

  const params = useParams()

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
  }

  const loadPdf = async () => {
    console.log(params.id)
    try {
      const url = `http://localhost:3005/book/pdf/${params.id}`

      const response = await axios.get(url, {
        responseType: 'blob',
      })
      setPdfBlob(URL.createObjectURL(response.data))
    } catch (error) {
      console.error('Error loading PDF:', error)
    }
  }

  useEffect(() => {
    loadPdf()
    document.addEventListener('contextmenu', handleContextMenu)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [])

  const handleContextMenu = (event) => {
    event.preventDefault()
    setShowContextMenuWarning(true)
  }

  const hideContextMenuWarning = () => {
    setShowContextMenuWarning(false)
  }

  const handleNextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1)
    }
  }

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1)
    }
  }

  const handleJumpToPage = () => {
    if (jumpToPage >= 1 && jumpToPage <= numPages) {
      setPageNumber(parseInt(jumpToPage, 10))
    }
  }

  const onPageLoadSuccess = () => {
    const canvasElement = document.querySelector('.react-pdf__Page canvas')
    canvasElement.addEventListener('click', handleNextPage)
    canvasElement.addEventListener('click', handlePreviousPage)
  }

  return (
    <div>
      <div className="App">
        <NavbarComponent />
        <div className="container">
          <br />
          {pdfBlob && (
            <div className="pdf-container">
              <Document
                file={pdfBlob}
                onLoadSuccess={onDocumentLoadSuccess}
                onContextMenu={handleContextMenu}
                className="pdf-document"
              >
                <Page
                  pageNumber={pageNumber}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  renderInteractiveForms={false}
                  onLoadSuccess={onPageLoadSuccess}
                  className="pdf-page"
                />
                <div className="pdf-jump-container">
                  <input
                    type="number"
                    value={jumpToPage}
                    onChange={(e) => setJumpToPage(e.target.value)}
                    min={1}
                    max={numPages}
                  />
                  <button onClick={handleJumpToPage}>Menuju ke halaman</button>
                </div>
              </Document>
              {showContextMenuWarning && (
                <div className="context-menu-warning" onClick={hideContextMenuWarning}>
                  Right-clicking is disabled on this page.
                </div>
              )}
              <div className="pdf-controls">
                <button
                  className="pdf-control-button"
                  onClick={handlePreviousPage}
                  disabled={pageNumber <= 1}
                >
                  Previous
                </button>
                <button
                  className="pdf-control-button"
                  onClick={handleNextPage}
                  disabled={pageNumber >= numPages}
                >
                  Next
                </button>
              </div>
              <p>
                Page {pageNumber} of {numPages}
              </p>
            </div>
          )}
        </div>
        <CFooter>
          <CImage href={linkUper} className="logo" rounded src="/images/logouper.png" />
          <div style={{ fontFamily: 'Poppins' }}>
            <span className="ms-1"> Copyright &copy; 2023 Pengabdian Kepada Masyarakat</span>
            <CLink href={linkUper} target="_blank" rel="noreferrer">
              Universitas Pertamina
            </CLink>
          </div>
        </CFooter>
      </div>
    </div>
  )
}

export default PdfRead

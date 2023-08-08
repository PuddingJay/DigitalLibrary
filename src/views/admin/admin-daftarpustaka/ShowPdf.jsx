/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
// import { Document, Page, pdfjs } from 'react-pdf'
import { Document, Page, pdfjs } from 'react-pdf'
import pdfjsWorker from 'react-pdf/node_modules/pdfjs-dist/build/pdf.worker.entry'

import { useParams } from 'react-router-dom'
import axios from 'axios'
// import NavbarComponent from '../../component/NavbarComponent'
import '../../user/pdf-viewer/PdfViewer.scss'

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker
function ShowPdf() {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [pdfBlob, setPdfBlob] = useState(null)
  const [jumpToPage, setJumpToPage] = useState(1)

  const params = useParams()

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
  }

  const loadPdf = async () => {
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
    // const script = document.createElement('script')
    // script.src = 'http://localhost:3000/static/js/src_views_user_PdfRead_js.chunk.worker.js'
    // script.async = true
    // document.body.appendChild(script)
    loadPdf()
    // Panggil fungsi disableScreenshot setelah komponen dirender
    disableScreenshot()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleContextMenu = (event) => {
    event.preventDefault() // Mencegah munculnya menu konteks
  }

  const disableScreenshot = () => {
    document.body.style.setProperty('user-select', 'none')
    document.addEventListener('keydown', preventKeydown)
  }

  const preventKeydown = (event) => {
    if (event.key === 'PrintScreen' || event.key === 'F12') {
      event.preventDefault()
      event.stopPropagation()
    }
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
      setPageNumber(parseInt(jumpToPage, 10)) // Convert to integer before setting
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
        {/* <NavbarComponent /> */}
        <div className="container">
          <br />
          <h4>View PDF</h4>
          {pdfBlob && (
            <div className="pdf-container">
              <Document
                file={pdfBlob}
                onLoadSuccess={onDocumentLoadSuccess}
                onContextMenu={handleContextMenu}
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
      </div>
    </div>
  )
}

export default ShowPdf
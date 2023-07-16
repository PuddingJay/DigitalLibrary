/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
// import { Document, Page, pdfjs } from 'react-pdf'
import { Document, Page, pdfjs } from 'react-pdf'
import pdfjsWorker from 'react-pdf/node_modules/pdfjs-dist/build/pdf.worker.entry'

import { useParams } from 'react-router-dom'
import axios from 'axios'
// import NavbarComponent from '../../component/NavbarComponent'
import '../../user/pdf-viewer/pdfViewer.css'

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker
function ShowPdf() {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [pdfBlob, setPdfBlob] = useState(null)

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

  const handleClickNext = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1)
    }
  }

  const handleClickPrevious = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1)
    }
  }

  const handleTouchNext = (event) => {
    event.preventDefault()
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1)
    }
  }

  const handleTouchPrevious = (event) => {
    event.preventDefault()
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1)
    }
  }

  const onPageLoadSuccess = () => {
    const canvasElement = document.querySelector('.react-pdf__Page canvas')
    canvasElement.addEventListener('click', handleClickNext)
    canvasElement.addEventListener('contextmenu', handleClickPrevious)
    canvasElement.addEventListener('touchstart', handleTouchNext)
    canvasElement.addEventListener('touchend', handleTouchPrevious)
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
                onContextMenu={handleContextMenu} // Tambahkan prop onContextMenu di sini
              >
                <Page
                  pageNumber={pageNumber}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  onLoadSuccess={onPageLoadSuccess} // Tambahkan prop onLoadSuccess di sini
                  className="pdf-page"
                />
              </Document>
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

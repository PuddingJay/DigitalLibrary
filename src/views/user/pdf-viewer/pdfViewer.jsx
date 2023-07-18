import React, { useState, useEffect } from 'react'
import { Document, Page } from 'react-pdf'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import NavbarComponent from '../../../component/NavbarComponent'
import './pdfViewer.css'

function PdfViewer() {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [pdfBlob, setPdfBlob] = useState(null)

  const params = useParams()

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
  }

  const onPageLoadSuccess = () => {
    const prevButton = document.querySelector('.prev-button')
    const nextButton = document.querySelector('.next-button')
    prevButton.addEventListener('click', () => {
      setPageNumber(pageNumber - 1)
    })
    nextButton.addEventListener('click', () => {
      setPageNumber(pageNumber + 1)
    })

    // Hapus listener yang ada sebelumnya
    const canvasElements = document.querySelectorAll('.react-pdf__Page canvas')
    canvasElements.forEach((canvas) => {
      canvas.removeEventListener('click', onPageLoadSuccess)
    })
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
    loadPdf()

    // Panggil fungsi disableScreenshot setelah komponen dirender
    // disableScreenshot()
  }, [])

  const handleContextMenu = (event) => {
    event.preventDefault() // Mencegah munculnya menu konteks
  }

  // const disableScreenshot = () => {
  //   document.body.style.setProperty('user-select', 'none')
  //   document.addEventListener('keydown', preventKeydown)
  // }

  // const preventKeydown = (event) => {
  //   if (event.key === 'PrintScreen' || event.key === 'F12') {
  //     event.preventDefault()
  //     event.stopPropagation()
  //   }
  // }

  return (
    <div>
      <div className="App">
        <NavbarComponent />
        <div className="container">
          <br></br>
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
                  onLoadSuccess={onPageLoadSuccess} // Tambahkan prop onLoadSuccess di sini
                />
              </Document>
              <p>
                Page {pageNumber} of {numPages}
              </p>
              <button className="prev-button">Previous</button>
              <button className="next-button">Next</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PdfViewer

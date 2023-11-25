/* eslint-disable prettier/prettier */
import React, { createContext, useContext, useReducer } from 'react'
import axios from 'axios'
const BookContext = createContext()
// eslint-disable-next-line import/first
import PropTypes from 'prop-types'

const initialState = {
  books: [],
  searchKeyword: '',
  searchResult: [],
}

const bookReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_BOOKS':
      return { ...state, books: action.payload }
    case 'SEARCH_BOOKS':
      const keyword = action.payload.toLowerCase()
      const filteredBooks = state.books.filter(
        (book) =>
          book.judul.toLowerCase().includes(keyword) ||
          book.penulis.toLowerCase().includes(keyword) ||
          book.Kategori.toLowerCase().includes(keyword) ||
          book.tahun_terbit.toLowerCase().includes(keyword) ||
          book.keterangan.toLowerCase().includes(keyword),
      )
      return {
        ...state,
        searchKeyword: keyword,
        searchResult: filteredBooks,
      }
    default:
      return state
  }
}
export const BookProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookReducer, initialState)
  const fetchData = async () => {
    try {
      const response = await axios.get('https://api2.librarysmayuppentek.sch.id/ApprovedBook')
      dispatch({ type: 'FETCH_BOOKS', payload: response.data.data })
    } catch (error) {
      console.error(error)
    }
  }
  const searchBooks = (keyword) => {
    dispatch({ type: 'SEARCH_BOOKS', payload: keyword })
  }
  return (
    <BookContext.Provider value={{ ...state, fetchData, searchBooks }}>
      {children}
    </BookContext.Provider>
  )
}

BookProvider.propTypes = {
  children: PropTypes.node.isRequired, // Add prop validation for children
}
export const useBookContext = () => useContext(BookContext)

import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {SelectOptionProps} from "./Types/SelectTypes";
import Select from "./Select";
import useIntersectionObserver from "./Hooks/useIntersectionObserver";

const LIMIT = 10;


function App() {
  const [selectedOption, setSelectedOption] = useState<SelectOptionProps>({ label: '', value: '' })
  const [productOptions, setProductOptions] = useState<SelectOptionProps[]>([])
  const [isFetchingProducts, setIsFetchingProducts] = useState(true)
  const [totalItems, setTotalItems] = useState(0)
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearchInput, setDebouncedSearchInput] = useState('')

  const handleSelect = (option: SelectOptionProps) => {
    setSearchInput(option?.label)
    setSelectedOption(option)
  }

  const transformProductToSelectOptions = (products: { title: string; id: string }[]) => {
    if (!products) return []

    return products?.map((product) => {
      return {
        label: `${product?.title}`,
        value:product.id.toString(),
      }
    })
  }

  const { lastEntryRef, setHasMore, setPage, page } = useIntersectionObserver(isFetchingProducts)

  useEffect(() => {
    if (totalItems === 0) return
    if (!isFetchingProducts) {
      setHasMore(productOptions?.length < totalItems)
    }
  }, [productOptions, totalItems])

  const getSkipValue = () => {
    return (page - 1) * LIMIT
  }

  const getApiUrl = () => {
    if (debouncedSearchInput) {
      return `https://yts.mx/api/v2/list_movies.json?query_term=${debouncedSearchInput}&limit=${LIMIT}&page=${page}`
    } else {
      return `https://yts.mx/api/v2/list_movies.json?limit=${LIMIT}&page=${page}`
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setProductOptions([])
      setPage(1)
      setDebouncedSearchInput(searchInput)
    }, 500) // delay fetching by 500ms

    return () => {
      clearTimeout(timeoutId)
    }
  }, [searchInput])

  const fetchAndSetProducts = async () => {
    try {
      setIsFetchingProducts(true)
      const response = await fetch(getApiUrl())
      const data = await response.json()

      if (page === 1) setProductOptions([])

      setProductOptions((prev) => [...prev, ...transformProductToSelectOptions(data?.data.movies)])
      setTotalItems(data?.data.movie_count)
    } catch (error) {
      alert('Something went wrong')
      console.log({ error })
    } finally {
      setIsFetchingProducts(false)
    }
  }

  useEffect(() => {
    fetchAndSetProducts()
  }, [page, debouncedSearchInput])


  return (
      <div className='p-20'>
        <div className='block w-52'>
          <span className='block mb-2 text-sm'>Select product</span>
          <Select
              options={productOptions}
              selected={selectedOption}
              placeholder='Select product'
              handleSelect={handleSelect}
              isFetchingOptions={isFetchingProducts}
              lastOptionRef={lastEntryRef}
              isSearchable={true}
              setSearchInput={setSearchInput}
              searchInput={searchInput}
          />
        </div>
      </div>
  )
}

export default App;

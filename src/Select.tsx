import { FC, useState } from 'react'

import GreaterThan from './GreaterThan';
import {SelectOptionProps, SelectProps} from "./Types/SelectTypes";
import useListenForOutsideClicks from "./Hooks/useListenForOutsideClicks";
import Loader from "./Loader";

const Select: FC<SelectProps> = ({
                                     options,
                                     isFetchingOptions,
                                     lastOptionRef,
                                     isSearchable,
                                     searchInput,
                                     selected = { label: '', value: '' },
                                     placeholder = 'Select',
                                     handleSelect,
                                     setSearchInput,
                                 }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const openDropdown = () => {
        setIsDropdownOpen(true)
    }

    const closeDropdown = () => {
        setIsDropdownOpen(false)
    }

    const labelClassName = () => {
        return `block max-w-full capitalize truncate ${selected?.label ? 'text-text-tertiary' : 'text-neutral/400'}`
    }

    const optionClassName = (option: SelectOptionProps, index: number, isSelected: boolean) => {
        isSelected ||= selected?.value === option.value

        return `active:bg-background-selected-option relative cursor-default select-none py-2 px-4 ${
            options.length - 1 === index ? 'rounded-b-md' : ''
        } ${isSelected ? 'bg-secondary/blue/50' : ''} hover:bg-secondary/blue/50 mb-1 last-of-type:mb-[0] block text-left w-full`
    }

    const containerClassName = () => `
    ${
        isDropdownOpen ? '!border-grey/900' : ''
    } px-4 py-2 flex justify-between items-center rounded w-full font-normal border border-solid border-neutral/200 bg-transparent leading-[20px] text-xs text-grey/900
    `

    const { elementRef } = useListenForOutsideClicks(closeDropdown)

    const renderNoOptions = () => {
        if (isFetchingOptions) return <Loader />

        return (
            <div className='relative cursor-default select-none py-2 pl-3 pr-9'>
                <span className='font-normal block truncate text-sm text-text-tertiary'>No options here</span>
            </div>
        )
    }

    const renderOptions = (options: SelectOptionProps[]) => {
        return options?.length > 0
            ? options?.map((option, index) => {
                const isSelected = selected?.value === option.value

                return (
                    <button
                        type='button'
                        key={String(option.value) + String(index)}
                        className={optionClassName(option, index, selected?.value === option.value)}
                        onClick={() => {
                            handleSelect(option)
                            closeDropdown()
                        }}
                        ref={options?.length - 1 === index ? lastOptionRef : null}
                    >
              <span
                  title={option.label}
                  className={`${
                      isSelected ? 'font-semibold ' : 'font-normal'
                  } block truncate text-text-tertiary text-[0.625rem] cursor-pointer leading-[0.8rem] text-shades/black font-normal`}
              >
                {option.label}
              </span>
                    </button>
                )
            })
            : renderNoOptions()
    }

    return (
        <div className='relative grow'>
            <button onClick={openDropdown} className={containerClassName()}>
                {isSearchable ? (
                    <input
                        type='text'
                        className='block text-text-tertiary w-full outline-none'
                        onChange={(ev) => {
                            setSearchInput?.(ev.target.value)
                        }}
                        placeholder={placeholder}
                        value={searchInput}
                    />
                ) : (
                    <span title={selected?.label} className={labelClassName()}>
            {selected?.label || placeholder}
          </span>
                )}
                <span className='pointer-events-none ml-3 flex items-center'>
          <GreaterThan className='rotate-90 text-[#96989A]' />
        </span>
            </button>

            {isDropdownOpen && (
                <div
                    className={
                        'absolute z-[500] w-full overflow-auto rounded-b-md bg-shades/white py-[14px] text-base ring-opacity-5 focus:outline-none mt-1 max-h-40 '
                    }
                    style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.08)' }}
                    ref={elementRef}
                >
                    {renderOptions(options)}

                    {isFetchingOptions && options?.length > 0 && <Loader />}
                </div>
            )}
        </div>
    )
}

export default Select

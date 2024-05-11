export type SelectOptionProps = {
    label: string // displayed label
    value: string // value used in computation
}

export type SelectProps = {
    options: SelectOptionProps[] // an array of the options.
    selected?: SelectOptionProps // the selected option.
    handleSelect: (option: SelectOptionProps) => void // function that is called when an option is selected.
    placeholder?: string
    isFetchingOptions?: boolean
    isSearchable?: boolean
    searchInput?: string
    lastOptionRef?: (node: Element | null) => void
    setSearchInput?: React.Dispatch<React.SetStateAction<string>>
}

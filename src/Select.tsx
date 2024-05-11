import { FC, useState } from 'react'

import GreaterThan from './GreaterThan';
import {SelectOptionProps, SelectProps} from "./Types/SelectTypes";
import useListenForOutsideClicks from "./Hooks/useListenForOutsideClicks";
import Loader from "./Loader";
import {
    Box,
    FormControl,
    IconButton,
    Input,
    MenuItem,
    Popper,
    styled,
    Typography,
    Checkbox,
    ListItemIcon
} from "@mui/material";
import {ExpandMore} from "@mui/icons-material";

const CustomFormControl = styled(FormControl)({
    width: '100%',
    backgroundColor: 'transparent',
    '& .MuiInput-underline:before': {
        borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
    },
});

const Select: FC<SelectProps> = ({
                                     options,
                                     isFetchingOptions,
                                     lastOptionRef,
                                     isSearchable,
                                     searchInput,
                                     selected = [],
                                     placeholder = 'Select',
                                     handleSelect,
                                     setSearchInput,
                                 }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);


    const openDropdown = (event: React.MouseEvent<HTMLElement>) => {
        setIsDropdownOpen(true);
        setAnchorEl(anchorEl ? null : event.currentTarget);

    }

    const closeDropdown = () => {
        setIsDropdownOpen(false);
        setAnchorEl(null)
    }


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
                const isSelected = selected.map(i => i.value).includes(option.value);


                return (
                    <MenuItem
                        key={String(option.value) + String(index)}
                        selected={isSelected}
                        onClick={() => {
                            handleSelect(option);
                        }}
                        sx={{ fontWeight: isSelected ? 'bold' : 'normal' }}
                        ref={options.length - 1 === index ? lastOptionRef : null}
                    >
                        <ListItemIcon>
                            <Checkbox size='small' checked={isSelected} />
                        </ListItemIcon>
                        {option.label}
                    </MenuItem>
                )
            })
            : renderNoOptions()
    }

    return (
        <Box sx={{ position: 'relative', width: '300px' }}>
            <CustomFormControl variant="standard">
                {isSearchable ? (
                    <Input
                        fullWidth
                        disableUnderline
                        placeholder={placeholder}
                        value={searchInput}
                        onClick={openDropdown}
                        onChange={(ev) => setSearchInput?.(ev.target.value)}
                        endAdornment={
                            <IconButton onClick={openDropdown}>
                                <ExpandMore />
                            </IconButton>
                        }
                    />
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography sx={{ flexGrow: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} title={selected.map(i => i.label).join(', ')}>
                            {selected.map(i => i.label).join(', ') || placeholder}
                        </Typography>
                        <IconButton onClick={openDropdown}>
                            <ExpandMore />
                        </IconButton>
                    </Box>
                )}
            </CustomFormControl>

            <Popper open={isDropdownOpen} anchorEl={anchorEl} ref={elementRef} placement='bottom-start'>
                <Box sx={{ width: '100%',
                    maxHeight: 160,
                    overflow: 'auto',
                    mt: 1,
                    bgcolor: 'background.paper',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.08)',
                    zIndex: 1}}>
                    {renderOptions(options)}

                    {isFetchingOptions && options?.length > 0 && <Loader />}
                </Box>
            </Popper>
        </Box>
    )
}

export default Select

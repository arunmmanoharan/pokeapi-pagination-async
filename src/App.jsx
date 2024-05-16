import React, {useState} from 'react';
import CreatableSelect from 'react-select/creatable';
import {withAsyncPaginate} from 'react-select-async-paginate';
import {  components } from "react-select";
import {Checkbox, emphasize} from "@mui/material";

const CreatableSelectWrapper = withAsyncPaginate(CreatableSelect);

const customStyles = {
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? 'rgba(25, 118, 210, 0.12)' : provided.backgroundColor, // Change this to your desired color
        color: state.isSelected ? 'rgba(0, 0, 0, 0.87)' : provided.color, // Ensure text is readable
        padding: 10,
        ':hover': {
            backgroundColor: emphasize('rgba(0, 0, 0, 0.08)', 0.3), // Darker on hover
            color: 'rgba(0, 0, 0, 0.87)',
        },
    }),
    multiValue: (provided, state) => {
        const backgroundColor = emphasize('rgba(0, 0, 0, 0.08)', 0.08); // Material-UI primary color with slight emphasis
        return {
            ...provided,
            backgroundColor,
            color:'rgba(0, 0, 0, 0.87)', // Ensure text is readable
            borderRadius: '16px', // Material-UI Chip border radius
            display: 'flex',
            alignItems: 'center',
            padding: '0 6px',
            margin: '2px',
            height: '32px', // Material-UI Chip default height
        };
    },
    multiValueLabel: (provided) => ({
        ...provided,
        color: 'rgba(0, 0, 0, 0.87)', // Text color inside the chip
        padding: '0 6px',
    }),
    multiValueRemove: (provided, state) => ({
        ...provided,
        color: 'rgba(0, 0, 0, 0.87)',
        cursor: 'pointer',
        ':hover': {
            backgroundColor: emphasize('rgba(0, 0, 0, 0.08)', 0.3), // Darker on hover
            color: 'rgba(0, 0, 0, 0.87)',
        },
    }),
};


const Option = (props) => (
    <components.Option {...props}>
        <Checkbox
                key={props.value}
                checked={props.isSelected}
                onChange={() => {}}
            />
        <label style={{ marginLeft: "5px" }}>{props.label}</label>
    </components.Option>
);

function App() {

  const [value, setValue] = useState(null);

  console.log('value', value)

  return (
      <div className="App">
        <div className="dropdown">
            <CreatableSelectWrapper
                value={value}
                isMulti
                menuIsOpen
                removeSelected={false}
                components={{
                    Option: Option,
                }}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                styles={customStyles}
                loadOptions={async (search, loadedOptions, { page }) => {
                    const response = await fetch(`https://yts.mx/api/v2/list_movies.json?query_term=${search}&page=${page}`);
                    const responseJSON = await response.json();
                    return {
                        options: responseJSON.data.movie_count === 0  ? [] : responseJSON.data.movies.map(i => {
                            return {
                                label: i.title,
                                value: i.id,
                            };
                        }),
                        hasMore: responseJSON.data.movie_count > (responseJSON.data.page_number * responseJSON.data.limit),
                        additional: {
                            page: page + 1,
                        },
                    };
                }}
                onChange={setValue}
                additional={{
                    page: 1,
                }}
            />

        </div>
      </div>
  );
}

export default App;

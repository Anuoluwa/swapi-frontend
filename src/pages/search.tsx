import { FunctionComponent } from 'react'
import styled from 'styled-components';
import { useCombobox, UseComboboxStateChange } from 'downshift'
import { useFilters } from '../hooks/use-get-people';
import debounce from 'lodash.debounce';
import { useNavigate } from 'react-router';
import { Person } from '../@types'

const InputContainer = styled.input`
    border-radius: 5px;
    border: none;
    height: 3rem;
    padding-left: 1.5rem;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
    background-color: white;
    width: 100%;
`;

const SearchContainer = styled.div`
    max-width: 22rem;
    margin 0 auto;
    margin-top: 2rem;
    display: flex;
    justify-content: center;
`;

const DropDown = styled.ul`
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
    background-color: white;
    margin: 0;
    position: absolute;
    width: 22rem;
    z-index: 9;
    padding: 0;
    margin-top: 3rem
`;

const DropDownItem = styled.li`
    list-style: none;
    font-size: 16px;
    padding: 0.5rem 0;
    color: black;
    cursor: pointer;
    border-bottom: 5px solid #F5F5F5;
    border-left: 14px solid
`;


const Search: FunctionComponent = () => {
    const { isSearching, searchResult, setFilters }  = useFilters();
    const delaySearch = debounce(setFilters, 500);
    const result = searchResult?.getPeople.data || [];
    let navigate = useNavigate();

    const {
    isOpen,
    inputValue,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    getItemProps,
    highlightedIndex,
  } = useCombobox({
      items: result,
      onInputValueChange() {
        delaySearch({
            name: inputValue,
            page: 1
        });
    },
    onSelectedItemChange({ selectedItem }: UseComboboxStateChange<Person>) {
      navigate(`/?name=${selectedItem?.name}`);
    },
    itemToString: (item: Person | null) => item?.name || '',
    });
    
    return (
        <SearchContainer {...getComboboxProps()}>
            <InputContainer {...getInputProps()} placeholder="Search by name"/>
            <DropDown {...getMenuProps()}>
                {isOpen
                    ? result.map((item: any, index: any) => (
                        <DropDownItem
                            {...getItemProps({ index, item })}
                            key={item.id}
                            highlighted={index === highlightedIndex}
                        >
                            {item.name}
                        </DropDownItem>
                    ))
                    : null
                }
                { isSearching && <p>Loading...</p>}
            </DropDown>
        </SearchContainer>
    )
}

export default Search;
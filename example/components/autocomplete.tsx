import { useId } from 'react'

import { useAutocomplete } from '../../lib'
import { cn } from '../helpers/utils'

function AutocompleteItem({ value, onRemove }: { value: string; onRemove: (item: string) => void }) {
  return (
    <div className="flex items-center justify-center gap-2 p-2 rounded-md bg-gray-200">
      {value}
      <span
        onClick={() => onRemove(value)}
        role="button"
        className="flex items-center justify-center rounded-full h-4 w-4 bg-gray-300 text-black hover:bg-gray-400 transition-colors"
      >
        x
      </span>
    </div>
  )
}

export function Autocomplete({ data, multiValue }: { data: string[]; multiValue?: boolean }) {
  const id = useId()

  const { listRef, suggestions, displayValue, showOptions, inputProps, userInput, activeSuggestion, onRemove, onAdd } =
    useAutocomplete({
      data,
      multiValue
    })

  const handleOnRemoveItem = (item: string) => {
    onRemove(item)
  }

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div
        id={`container-autocomplete-${id}`}
        className="flex flex-row flex-wrap justify-start items-stretch w-full gap-2 p-4 pr-8 border-2 border-gray-300 rounded-md relative"
      >
        {Array.isArray(displayValue)
          ? displayValue.map((option) => (
              <AutocompleteItem
                key={option.value}
                value={option.value}
                onRemove={() => handleOnRemoveItem(option.value)}
              />
            ))
          : null}

        <input
          {...inputProps}
          value={userInput}
          aria-invalid="false"
          autoComplete="off"
          id={`autocomplete-input-${id}`}
          placeholder="Type an option"
          type="text"
          aria-autocomplete="list"
          autoCapitalize="none"
          spellCheck="false"
          role="combobox"
          aria-label="Choose an option"
          aria-haspopup="listbox"
          aria-expanded={showOptions}
          aria-controls={`autocomplete-listbox-${id}`}
          className="flex-1 border-none bg-none focus:outline-none outline-none box-content focus:ring-0"
        />
      </div>
      {showOptions ? (
        <ul
          role="listbox"
          tabIndex={-1}
          ref={listRef}
          id={`autocomplete-listbox-${id}`}
          className="flex flex-col mt-2 gap-2 w-full bg-white border-2 border-gray-300 rounded-md max-h-[400px] overflow-auto animate-in fade-in slide-in-from-bottom-0 ease-in-out duration-500"
        >
          {suggestions.length === 0 ? (
            <li className="bg-white p-4 rounded-md" aria-selected="false" role="option" tabIndex={-1}>
              No items
            </li>
          ) : (
            suggestions.map((option, index) => (
              <li
                className={cn(
                  option.selected ? 'bg-gray-200' : 'bg-white',
                  activeSuggestion === index ? 'bg-gray-300 active' : '',
                  'px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors rounded-md focus:ring-1'
                )}
                id={`autocomplete_item_${option.value}`}
                aria-selected={option.selected}
                role="option"
                tabIndex={-1}
                key={option.value}
                onClick={() => onAdd(option.value)}
              >
                {option.value}
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  )
}

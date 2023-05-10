import { useAutocomplete } from '../../lib'
import colors from '../lib/colors'
import { cn } from '../lib/utils'

export function Autocomplete() {
  const {
    options,
    selectedOptions,
    shouldDisplayOptions,
    newOption,
    onRemoveItem,
    onAddItem,
    onChangeNewOption,
    onKeyDownNewOption
  } = useAutocomplete({
    data: colors
  })

  const onSuggestionClick = (suggestion: string) => {
    onAddItem(suggestion)
  }

  const handleOnRemoveItem = (item: string) => {
    onRemoveItem(item)
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-row flex-wrap justify-start items-stretch w-full gap-2 p-4 border-2 border-gray-300 rounded-md">
        {selectedOptions.map((option) => (
          <div key={option.value} className="flex items-center justify-center gap-2 p-2 rounded-md bg-gray-200">
            {option.value}
            <span
              onClick={() => handleOnRemoveItem(option.value)}
              role="button"
              className="flex items-center justify-center rounded-full h-4 w-4 bg-gray-300 text-black hover:bg-gray-400 transition-colors"
            >
              x
            </span>
          </div>
        ))}

        <input
          onChange={onChangeNewOption}
          onKeyDown={onKeyDownNewOption}
          value={newOption}
          aria-invalid="false"
          autoComplete="off"
          id="tags-standard"
          placeholder="New option"
          type="text"
          className="border-none bg-none focus:outline-none outline-none box-content min-h-full min-w-min w-auto flex-grow-1 shrink-0 basis-0 text-ellipsis"
          aria-autocomplete="list"
          aria-expanded="false"
          autoCapitalize="none"
          spellCheck="false"
          role="combobox"
        />
      </div>

      {shouldDisplayOptions ? (
        <ul className="flex flex-col flex-wrap mt-2 w-full gap-1 p-4 border-2 border-gray-300 rounded-md">
          {options.map((option) => (
            <li
              className={cn(
                option.selected ? 'bg-gray-200' : 'bg-white',
                'p-4 cursor-pointer hover:bg-gray-100 transition-colors rounded-md'
              )}
              key={option.value}
              onClick={() => onSuggestionClick(option.value)}
            >
              {option.value}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

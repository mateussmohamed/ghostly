import { useCallback, useMemo, useReducer, useRef } from 'react'

type ActionType =
  | {
      type: 'ADD' | 'REMOVE' | 'UPDATE_INPUT'
      payload: string
    }
  | {
      type: 'ADD_BY_INDEX'
      payload?: number
    }
  | {
      type: 'TOGGLE_OPTIONS'
      payload?: boolean
    }
  | {
      type: 'ACTIVE_SUGGESTION'
      payload: number
    }

type Option = {
  value: string
  selected: boolean
}

interface State {
  options: Option[]
  suggestions: Option[]
  activeSuggestion: number
  userInput: string
  multiValue?: boolean
  showOptions?: boolean
}

const KEY_CODES = {
  DOWN: 'ArrowDown',
  UP: 'ArrowUp',
  ESCAPE: 'Escape',
  ENTER: 'Enter'
}

function formatSearchString(searchString: string) {
  return searchString.toLowerCase().replace(/\s+/g, '')
}

function mapOptions(options: string[]) {
  return options.map((option) => ({ value: option, selected: false }))
}

function findOption(options: Option[], searchValue: string) {
  return options.find((option) => formatSearchString(option.value) === formatSearchString(searchValue))
}

function filterSuggestions(options: Option[], searchValue: string) {
  return options
    .filter((option) => formatSearchString(option.value).includes(formatSearchString(searchValue)))
    .map((opt) => ({ ...opt, selected: formatSearchString(searchValue) === formatSearchString(opt.value) }))
}

function reducer(state: State, action: ActionType) {
  switch (action.type) {
    case 'ADD': {
      if (state.multiValue) {
        return {
          ...state,
          userInput: '',
          activeSuggestion: 0,
          options: state.options.map((option) => {
            if (formatSearchString(option.value) === formatSearchString(action.payload)) {
              return { ...option, selected: option.selected ? false : true }
            }
            return option
          })
        }
      }

      return {
        ...state,
        userInput: findOption(state.options, action.payload)?.value || action.payload,
        options: state.options.map((option) => {
          return { ...option, selected: option.value === action.payload }
        })
      }
    }
    case 'ADD_BY_INDEX': {
      const itemToAdd = state.suggestions[state.activeSuggestion]
      const newOptions = state.options.map((option) => {
        return option.value === itemToAdd?.value ? { ...option, selected: true } : option
      })

      return {
        ...state,
        userInput: state.multiValue ? '' : itemToAdd?.value || '',
        activeSuggestion: 0,
        suggestions: newOptions,
        options: newOptions,
        showOptions: false
      }
    }
    case 'REMOVE': {
      return {
        ...state,
        options: state.options.map((option) => {
          if (option.value === action.payload) {
            return { ...option, selected: option.selected ? false : true }
          }
          return option
        })
      }
    }
    case 'UPDATE_INPUT': {
      return {
        ...state,
        userInput: action.payload,
        suggestions: action.payload.length >= 3 ? filterSuggestions(state.options, action.payload) : state.options,
        activeSuggestion: 0
      }
    }
    case 'TOGGLE_OPTIONS': {
      return {
        ...state,
        showOptions: action.payload !== undefined ? action.payload : !state.showOptions
      }
    }
    case 'ACTIVE_SUGGESTION': {
      return {
        ...state,
        activeSuggestion: action.payload
      }
    }
    default:
      throw Error('Unknown action.')
  }
}

interface UseAutocompleteProps {
  data: string[]
  multiValue?: boolean
}

export function useAutocomplete({ data, multiValue = false }: UseAutocompleteProps) {
  const mappedData = useMemo(() => mapOptions(data), [data])
  const [state, dispatch] = useReducer(reducer, {
    multiValue,
    options: mappedData,
    suggestions: mappedData,
    activeSuggestion: 0,
    userInput: '',
    showOptions: false
  })

  const listRef = useRef<HTMLUListElement>(null)

  const onAdd = (option?: string) => {
    dispatch({ type: 'ADD', payload: option || '' })
    dispatch({ type: 'TOGGLE_OPTIONS' })
  }
  const onRemove = useCallback((item: string) => {
    dispatch({ type: 'REMOVE', payload: item })
  }, [])
  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'UPDATE_INPUT', payload: event.target.value || '' })

    if (event.target.value.length === 0) {
      dispatch({ type: 'TOGGLE_OPTIONS', payload: false })
    }

    if (event.target.value.length >= 3) {
      dispatch({ type: 'TOGGLE_OPTIONS', payload: true })
    }
  }, [])
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === KEY_CODES.ENTER) {
        dispatch({ type: 'ADD_BY_INDEX' })
        return
      }
      if (event.key === KEY_CODES.ESCAPE) {
        dispatch({ type: 'TOGGLE_OPTIONS', payload: false })
        return
      }
      if ([KEY_CODES.UP, KEY_CODES.DOWN].includes(event.key)) {
        const selected = listRef?.current?.querySelector('.active')
        if (selected) {
          selected?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }

        if (event.key === KEY_CODES.UP) {
          if (state.activeSuggestion === 0) return
          return dispatch({ type: 'ACTIVE_SUGGESTION', payload: state.activeSuggestion - 1 })
        }

        if (event.key === KEY_CODES.DOWN) {
          if (state.activeSuggestion - 1 === state.suggestions.length) return
          return dispatch({ type: 'ACTIVE_SUGGESTION', payload: state.activeSuggestion + 1 })
        }
      }
    },
    [state.activeSuggestion, state.suggestions.length]
  )
  const onToggleOptions = useCallback(() => {
    dispatch({ type: 'TOGGLE_OPTIONS' })
  }, [])
  const onMouseDown = useCallback(() => {
    dispatch({ type: 'TOGGLE_OPTIONS' })
  }, [])

  /*
   *   Open options
   */

  const displayValue = useMemo(() => {
    if (multiValue) {
      return state.options.filter((option) => option.selected)
    }
    return state.options.find((option) => option.selected)?.value
  }, [multiValue, state.options])

  const inputProps = {
    onChange,
    onKeyDown,
    onMouseDown
  }

  return {
    /*
     * Handlers
     */
    onAdd,
    onRemove,
    onChange,
    onKeyDown,
    onToggleOptions,

    inputProps,

    /*
     * Misc
     */
    displayValue,
    listRef,
    /*
     * State props
     */
    ...state
  }
}

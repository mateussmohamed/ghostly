import { useCallback, useMemo, useReducer, useState } from 'react'

type ActionType = {
  type: 'ADD' | 'REMOVE'
  payload: string
}

type Option = {
  value: string
  selected: boolean
}

interface State {
  options: Option[]
}

function mapOptions(options: string[]) {
  return options.map((option) => ({ value: option, selected: false }))
}

function existsOptions(options: Option[], item: string) {
  return options.find((option) => option.value === item)
}

function reducer(state: State, action: ActionType) {
  switch (action.type) {
    case 'ADD': {
      if (!existsOptions(state.options, action.payload)) {
        return state
      }

      return {
        ...state,
        options: state.options.map((option) => {
          if (option.value === action.payload) {
            return { ...option, selected: true }
          }
          return option
        })
      }
    }
    case 'REMOVE': {
      return {
        ...state,
        options: state.options.filter((option) => option.value !== action.payload)
      }
    }
    default:
      throw Error('Unknown action.')
  }
}

export function useAutocomplete({ data }: { data: string[] }) {
  const [state, dispatch] = useReducer(reducer, { options: mapOptions(data) })
  const [newOption, setNewOption] = useState('')

  const onAddItem = (item: string) => {
    dispatch({ type: 'ADD', payload: item })
    setNewOption('')
  }

  const onRemoveItem = (item: string) => {
    dispatch({ type: 'REMOVE', payload: item })
  }

  const onChangeNewOption = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewOption(event.target.value)
  }

  const onKeyDownNewOption = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        onAddItem(newOption)
      }
    },
    [newOption]
  )

  const selectedOptions = useMemo(() => state.options.filter((option) => option.selected), [state.options])

  const options = useMemo(() => {
    if (newOption.length >= 1) {
      return state.options.filter((option) => option.value.toUpperCase().includes(newOption.toUpperCase()))
    }
    return state.options
  }, [newOption, state.options])

  const shouldDisplayOptions = useMemo(() => Boolean(newOption.length), [newOption])

  return {
    onAddItem,
    onRemoveItem,
    onChangeNewOption,
    onKeyDownNewOption,
    shouldDisplayOptions,
    newOption,
    selectedOptions,
    options
  }
}

import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { BaseTextFieldProps } from '@mui/material/TextField/TextField'

const testers = [
  { id: 1, label: 'one' },
  { id: 2, label: 'two' },
  { id: 3, label: 'three' },
  { id: 4, label: 'four' },
  { id: 5, label: 'five' },
]

export function TestersSelect() {
  return (
    <Autocomplete
      multiple
      sx={{ pt: 2, pb: 2 }}
      options={testers}
      defaultValue={[testers[1]]}
      isOptionEqualToValue={(a, b) => a?.id === b?.id}
      onChange={(_e, value) => console.log(value)}
      filterSelectedOptions
      renderInput={(params) => {
        const { size, InputProps, InputLabelProps, ...rest } = params
        const p: BaseTextFieldProps = {}
        if (size !== undefined) {
          p.size = size
        }
        return (
          <TextField
            {...rest}
            {...p}
            slotProps={{ input: InputProps, inputLabel: InputLabelProps }}
            label="Testers"
            placeholder="Testers"
          />
        )
      }}
    />
  )
}

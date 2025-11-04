import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { BaseTextFieldProps } from '@mui/material'
import { Tester } from '../../core/ReleaseTasks'

export type TestersSelectProperties = {
  assignedTesters: Tester[]
  availableTesters: Tester[]
  onChange?: (assignedTesters: Tester[]) => void
}

export function TestersSelect(props: TestersSelectProperties) {
  return (
    <Autocomplete
      multiple
      sx={{ pt: 2, pb: 2 }}
      options={props.availableTesters}
      defaultValue={props.assignedTesters}
      isOptionEqualToValue={(a, b) => a?.full === b?.full}
      onChange={(_e, value) => props.onChange?.(value)}
      getOptionLabel={(item) => item.full}
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

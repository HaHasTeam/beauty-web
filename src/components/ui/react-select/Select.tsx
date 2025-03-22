import * as React from 'react'
import type { Props } from 'react-select'
import SelectComponent from 'react-select'

import { defaultClassNames, defaultStyles } from './helper'
import {
  ClearIndicator,
  DropdownIndicator,
  Menu,
  MenuList,
  MultiValueRemove,
  Option} from './ReactSelectCustomComponents'

const Select = React.forwardRef<
  React.ElementRef<typeof SelectComponent>,
  React.ComponentPropsWithoutRef<typeof SelectComponent>
>((props: Props, ref) => {
  const {
    value,
    onChange,
    options = [],
    styles = defaultStyles,
    classNames = defaultClassNames,
    components = {},
    ...rest
  } = props

  const id = React.useId()

  return (
    <SelectComponent
      instanceId={id}
      ref={ref}
      value={value}
      onChange={onChange}
      options={options}
      unstyled
      components={{
        DropdownIndicator,
        ClearIndicator,
        MultiValueRemove,
        Option,
        Menu,
        MenuList,
        ...components
      }}
      styles={styles}
      classNames={classNames}
      {...rest}
    />
  )
})
Select.displayName = 'Select'
export default Select

import * as React from 'react'
import type { Props } from 'react-select'
import CreatableSelect from 'react-select/creatable'

import { defaultClassNames, defaultStyles } from './helper'
import {
  ClearIndicator,
  DropdownIndicator,
  Menu,
  MenuList,
  MultiValueRemove,
  Option,
} from './ReactSelectCustomComponents'

const Creatable = React.forwardRef<
  React.ElementRef<typeof CreatableSelect>,
  React.ComponentPropsWithoutRef<typeof CreatableSelect>
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
    <CreatableSelect
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
        ...components,
      }}
      styles={styles}
      classNames={classNames}
      {...rest}
    />
  )
})
Creatable.displayName = 'Creatable'
export default Creatable

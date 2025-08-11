import React from 'react'
import { useLinguiInternal } from './next-lingui-provider'
import { TransNoContext } from './trans-no-context'
import type { TransProps } from './trans-no-context'

export function Trans(props: TransProps): React.ReactElement<any, any> | null {
  let errMessage
  // eslint-disable-next-line n/prefer-global/process
  if (process.env.NODE_ENV !== 'production') {
    errMessage = `Trans component was rendered without I18nProvider.
Attempted to render message: ${props.message} id: ${props.id}. Make sure this component is rendered inside a I18nProvider.`
  }
  const lingui = useLinguiInternal(errMessage)
  return React.createElement(TransNoContext, { ...props, lingui })
}

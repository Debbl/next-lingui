import { describe, expect, it } from 'vitest'
import macro from '~/macro'

describe('react-macro', () => {
  it('should re-export Macro', () => {
    expect((macro as any).isBabelMacro).toBeTruthy()
  })
})

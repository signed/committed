import { describe, expect, it } from 'vitest'
import { deriveProjectFrom } from './path'

describe('derive project from', () => {
  it('return undefined in case there is no ticket reference', async () => {
    expect(deriveProjectFrom('/example/name')).toEqual('name')
  })
})

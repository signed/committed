import { describe, expect, it } from 'vitest'
import { extractTicketReferencesFrom } from './project'

describe('extract ticket references from subject', () => {
  it('return undefined in case there is no ticket reference', async () => {
    expect(extractTicketReferencesFrom('bad developer', 'PR')).toEqual([])
  })
  it('return single ticket reference', async () => {
    expect(extractTicketReferencesFrom('[PR-1] awesome new feature', 'PR')).toEqual(['PR-1'])
  })
  it('return all ticket references if there are multiple', async () => {
    expect(extractTicketReferencesFrom('[PR-1] awesome new feature [PR-34]', 'PR')).toEqual(['PR-1', 'PR-34'])
  })
})

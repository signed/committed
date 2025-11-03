import { describe, expect, it, test } from 'vitest'
import { extractSummaryFrom, extractTicketReferencesFrom } from './project'
import { anyCommit } from './Commit.mother'

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

describe('extractSummaryFrom', () => {
  test('return plain subject if it does not contain the project key', () => {
    expect(extractSummaryFrom(anyCommit({ subject: 'hello' }), 'PK')).toEqual('hello')
  })
  test('remove the project key', () => {
    expect(extractSummaryFrom(anyCommit({ subject: 'PK-12 summary' }), 'PK')).toEqual('summary')
  })
  test('remove multiple project keys', () => {
    expect(extractSummaryFrom(anyCommit({ subject: 'PK-12 summary PK-13' }), 'PK')).toEqual('summary')
  })
})

import 'dotenv/config'
import { loadConfigurationFrom } from '../server/configuration'
import { appendFileSync, lstatSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { simpleGit, type SimpleGitOptions } from 'simple-git'
import { generate } from 'random-words'

function directoryExists(filePath: string) {
  try {
    return lstatSync(filePath).isDirectory()
  } catch (err) {
    return false
  }
}

async function setup() {
  const configuration = loadConfigurationFrom(process.env)
  if (configuration === 'failed') {
    console.error('missing configuration')
    process.exit(1)
  }
  const directory = configuration.repository.baseDirectory
  // comment out after testing is done
  // rmSync(directory, { recursive: true })

  if (directoryExists(directory)) {
    console.log(`directory already exists at ${directory}`)
    process.exit(1)
  }
  mkdirSync(directory, { recursive: true })

  const options = { baseDir: directory } satisfies Partial<SimpleGitOptions>
  const git = simpleGit(options)
  await git.init()
  const fileName = 'content.md'
  const project = configuration.ticketing.project
  const absolutePath = resolve(directory, fileName)
  writeFileSync(absolutePath, '# The Content\n\n')

  async function commit(author: string, ticket: string) {
    appendFileSync(absolutePath, '- ' + author + '\n')
    const commitMessage = generate({ min: 2, max: 7, join: ' ' })
    const commitResult = await git.add('./*').commit(`${project}-${ticket} ${commitMessage}`, {
      '--author': `"${author} Person <${author.toLowerCase()}@example.org>"`,
    })
    return commitResult.commit
  }

  const initial = await commit('One', '5')
  await git.branch(['release', initial])
  await commit('Two', '5')
  await commit('Three', '7')
  await commit('Four', '1')

  console.log(`done at ${directory}`)
  console.log([`FROM=${initial}`, 'TO=main'].join('\n'))
}

//@ts-expect-error running on node 20 where this is supported but still have to figure out tsconfig setup
await setup()

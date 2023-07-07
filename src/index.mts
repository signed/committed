import 'dotenv/config'
import {simpleGit} from 'simple-git'

console.log(process.env)
const from = process.env['FROM']
const to = process.env['TO']
const project = process.env['PROJECT']

console.log(from)
console.log(to)
console.log(project)

const git = simpleGit();
const out = await git.log({format: {subject: '%s'}});
console.log(out)
const subjects = out.all.map(l => l.subject);
console.log(subjects)
const out2 = await git.log();
console.log(out2)

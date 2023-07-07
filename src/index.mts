import 'dotenv/config'
import {simpleGit} from 'simple-git'
import {absolutePathFor} from "./path.mjs";

const baseDirectory = absolutePathFor(process.env['BASE_DIRECTORY'] ?? process.cwd())
const from = process.env['FROM']
const to = process.env['TO']
const project = process.env['PROJECT']

if (from === undefined || to === undefined) {
    console.log('from and to are mandatory')
    process.exit(1)
}

const git = simpleGit(baseDirectory);
const out = await git.log({
    format: {subject: '%s'},
    '--ancestry-path': null,
    from: from,
    to: to

});
const subjects = out.all.map(l => l.subject);
console.log(subjects)
console.log(project)
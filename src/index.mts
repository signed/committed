import 'dotenv/config'
import {simpleGit} from 'simple-git'
import {absolutePathFor} from "./path.mjs";
import {extractTicketReferencesFrom} from "./project.mjs";

const baseDirectory = absolutePathFor(process.env['BASE_DIRECTORY'] ?? process.cwd())
const from = process.env['FROM']
const to = process.env['TO']
const project = process.env['PROJECT']

if (from === undefined || to === undefined || project === undefined) {
    console.log('project, from and to are mandatory')
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

const ticketReferences = subjects.flatMap(subject => extractTicketReferencesFrom(subject, project));
const uniqueTicketReferences = [...new Set(ticketReferences)];
console.log(uniqueTicketReferences)
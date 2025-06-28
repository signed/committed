import json from '../http/http-client.private.env.json'

const jira = json.prod.jira
const base = Buffer.from(`${jira.login}:${jira.token}`).toString('base64')

console.log(base)

import json from '../http/http-client.private.env.json'

const jira = json.prod.jira
const classic = Buffer.from(`${jira.login}:${jira.classic_token}`).toString('base64')
const scoped = Buffer.from(`${jira.login}:${jira.scoped_token}`).toString('base64')

console.log({ classic, scoped })

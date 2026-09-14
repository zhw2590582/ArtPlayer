import process from 'node:process'
import { runCorpus } from './documentation/cli.ts'

runCorpus(process.argv.slice(2))

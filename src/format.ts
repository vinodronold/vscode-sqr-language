'use strict'
import { EOL } from 'os'
import SyntaxTree from './SQRSyntaxTree'

const format = (doc: string): string => {
  console.log(SyntaxTree(doc))
  return doc
    .split(EOL)
    .map(l => `${l.trim()}  ! FORMATTED`)
    .join(EOL)
}

export default format

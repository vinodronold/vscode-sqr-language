'use strict'
import { EOL } from 'os'

// CONSTANTS
const SPACE = ' '
const NULL = ''
const SINGLE_LINE_COMMENT = '!'
const SINGLE_QUOTE = "'"

const _round = (r: string): number => {
  return Number(r.split('=')[1])
}

const _variableDeclaration = id => {
  let type = ''
  switch (true) {
    case id.startsWith('$'):
      type = 'string'
      break
    case id.startsWith('#'):
      type = 'number'
      break
    case id.startsWith('&'):
      type = 'column'
      break
    default:
      type = 'literal'
  }
  console.log('type', type)
  return {
    type,
    identifier: type === 'literal' ? id : id.slice(1, id.length)
  }
}

const _add = ({ command, comment = '' }) => ({
  type: 'expression',
  command: 'add',
  source: _variableDeclaration(command[1]),
  dist: _variableDeclaration(command[3]),
  round: _round(command.slice(4, command.length).join('')),
  comment
})

const mapSyntax = statementParsed => ({
  add: _add(statementParsed)
})

const parseStatement = statement => {
  let word = ''
  let isVar: boolean = false
  let isComment: boolean = false

  statement = `${statement} `
  const statementParsed = statement.split(NULL).reduce(
    (res, curChar) => {
      if (!isVar && !isComment && curChar === SINGLE_LINE_COMMENT) {
        isComment = true
      }
      if (!isComment && curChar === SINGLE_QUOTE) {
        isVar = !isVar
      }

      if (isComment) {
        if (word.length > 0) {
          res.command.push(word)
          word = ''
        }
        res.comment = `${res.comment}${curChar}`
      } else {
        if (isVar || curChar !== ' ') {
          word = `${word}${curChar}`
        } else {
          if (word.length > 0) {
            res.command.push(word)
            word = ''
          }
        }
      }

      return res
    },
    { command: [], comment: '' }
  )
  console.log(statementParsed)
  return mapSyntax(statementParsed)[statementParsed.command[0].toLowerCase()]
}

export default (program: string): object => ({
  program: program
    .split(EOL)
    .map(x => x.trim())
    .filter(x => x.length > 0)
    .map(parseStatement)
})

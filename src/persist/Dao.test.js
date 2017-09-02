//@flow
import type { Dao } from './Dao'
import {
  answerTypeFromDBId,
  answerTypeToDBId,
  Format,
  formatTypeFromDBId,
  formatTypeToDBId,
  Templates,
  templateTypeFromDBId,
  templateTypeToDBId
} from './Dao'
import { Answer } from '../services/APIDomain'

describe('Dao', () => {

  it('should map template types to and from db id correctly ', () => {
    const templateToDbId = new Map()
    templateToDbId.set(Templates.FRONT_BACK, 1)

    for (let template of templateToDbId.keys()) {
      const expected = templateToDbId.get(template)

      if (!expected) {
        throw new Error(`No db value for ${template}`)
      }

      expect(templateTypeToDBId(template)).toEqual(expected)
      expect(templateTypeFromDBId(expected)).toEqual(template)
    }

    expect(() => templateTypeToDBId(('BLARG': any))).toThrowError('Unrecognized type: BLARG')
    expect(() => templateTypeFromDBId(0)).toThrowError('Unrecognized Template DB id: 0')
  })

  it('should map format types to and from db id correctly ', () => {
    const formatToDbId = new Map()
    formatToDbId.set(Format.PLAIN, 1)
    formatToDbId.set(Format.HTML, 2)

    for (let format of formatToDbId.keys()) {
      const expected = formatToDbId.get(format)

      if (!expected) {
        throw new Error(`No db value for ${format}`)
      }

      expect(formatTypeToDBId(format)).toEqual(expected)
      expect(formatTypeFromDBId(expected)).toEqual(format)
    }

    expect(() => formatTypeToDBId(('BLARG': any))).toThrowError('Unrecognized type: BLARG')
    expect(() => formatTypeFromDBId(0)).toThrowError('Unrecognized Format DB id: 0')
  })

  it('should map answer types to and from db id correctly ', () => {
    const answerToDbId = new Map()
    answerToDbId.set(Answer.FAIL, 1)
    answerToDbId.set(Answer.HARD, 2)
    answerToDbId.set(Answer.GOOD, 3)
    answerToDbId.set(Answer.EASY, 4)

    for (let answer of answerToDbId.keys()) {
      const expected = answerToDbId.get(answer)

      if (!expected) {
        throw new Error(`No db value for ${answer}`)
      }

      expect(answerTypeToDBId(answer)).toEqual(expected)
      expect(answerTypeFromDBId(expected)).toEqual(answer)
    }

    expect(() => answerTypeToDBId(('BLARG': any))).toThrowError('Unrecognized type: BLARG')
    expect(() => answerTypeFromDBId(0)).toThrowError('Unrecognized Answer DB id: 0')
  })
})
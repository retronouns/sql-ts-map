import { Alpha, Whitespace, Digit, TrimLeft } from './util'

const INPUT = `lorem ipsum 'here\\'s a string' dolor sit amet`

const S = `'here\\'s a string' and some stuff`

type ParseString<T extends string> = T extends `'${infer B}`
    ? `'${ParseStringRec<B, ''>}'`
    : never
type ParseStringRec<
    T extends string,
    Acc extends string,
> = T extends `'${infer B}`
    ? Acc
    : T extends `\\${infer A}${infer B}`
    ? ParseStringRec<B, `${Acc}\\${A}`>
    : T extends `${infer A}${infer B}`
    ? ParseStringRec<B, `${Acc}${A}`>
    : never

type test1 = ParseString<typeof S>

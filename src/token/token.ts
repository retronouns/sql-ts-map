import { Alpha, Whitespace, Digit, Comparator, TrimLeft } from './../util'

type Trim<T extends string> = TrimLeft<T, Whitespace>
type Special = Comparator | `,`
type TrimSpecial<T extends string> = TrimLeft<T, Special>

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
export type ParseString<T extends string> = T extends `${
    | Whitespace
    | Special}${infer Anything}`
    ? never
    : T extends `'${infer B}`
    ? `'${ParseStringRec<B, ''>}'`
    : never

type WordChars = Alpha | Digit | `.`

type ParseWordRec<
    T extends string,
    Acc extends string,
> = T extends `${infer A extends WordChars}${infer B}`
    ? ParseWordRec<B, `${Acc}${A}`>
    : Acc
export type ParseWord<T extends string> = T extends `${
    | Whitespace
    | Special}${infer Anything}`
    ? never
    : ParseWordRec<T, ``>

export type ParseToken<T extends string> = `` extends Trim<T>
    ? never
    : Trim<T> extends `${infer Trimmed extends string}`
    ? Trimmed extends `'${infer Tail extends string}`
        ? ParseString<Trimmed>
        : Trimmed extends `${Special}${infer Tail extends string}`
        ? Trimmed extends `${infer A}${TrimSpecial<Trimmed>}`
            ? A
            : never
        : ParseWord<Trimmed>
    : never

type ParseTokensRec<T extends string, Acc extends string[]> = `` extends T
    ? Acc
    : ParseToken<T> extends `${infer A extends string}`
    ? T extends `${A}${infer B extends string}`
        ? ParseTokensRec<Trim<B>, [...Acc, A]>
        : Acc
    : never

export type ParseTokens<T extends string> = ParseTokensRec<Trim<T>, []>

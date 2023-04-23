type StringToUnion<
    T extends string,
    Acc = never,
> = T extends `${infer L}${infer R}` ? StringToUnion<R, L | Acc> : Acc

export type Alpha =
    StringToUnion<'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_'>
export type Digit = StringToUnion<'0123456789'>
export type Comparator = `>=` | `<=` | `!=` | `=` | `>` | `<`
export type Whitespace = StringToUnion<' \n\t'>

export type TrimLeft<
    T extends string,
    X extends string = Whitespace,
> = T extends `${X}${X}${infer R}` | `${X}${infer R}` ? TrimLeft<R, X> : T

type TryConsumeNextMatchingIRec<
    Text extends string,
    Matcher extends string,
> = Matcher extends ``
    ? Text
    : Text extends `${infer Left extends string}${infer Right extends string}`
    ? Lowercase<Matcher> extends `${Lowercase<Left>}${infer MatcherRight extends string}`
        ? TryConsumeNextMatchingIRec<Right, MatcherRight>
        : never
    : never
export type TryConsumeNextMatchingI<
    Text extends string,
    Matcher extends string,
> = TryConsumeNextMatchingIRec<
    TrimLeft<Text>,
    Matcher
> extends infer Rest extends string
    ? Lowercase<
          TrimLeft<Text>
      > extends `${Lowercase<Matcher>}${Lowercase<Rest>}`
        ? TrimLeft<Rest>
        : never
    : never

type TryConsumeNextWordRec<
    Text extends string,
    Acc extends [string, string] = ['', ''],
    Chars extends string = Alpha | Digit | '.',
> = Text extends `${infer Left}${infer Right}`
    ? Left extends Chars
        ? TryConsumeNextWordRec<Right, [`${Acc[0]}${Left}`, Right], Chars>
        : Acc
    : Acc

export type TryConsumeNextWord<Text extends string> = TryConsumeNextWordRec<
    TrimLeft<Text>
> extends [infer Word extends string, infer Rest extends string]
    ? [Word, TrimLeft<Rest>]
    : never

type NextAlphaWordRec<
    T extends string,
    S extends string = '',
> = T extends `${infer L}${infer R}`
    ? L extends Alpha
        ? NextAlphaWordRec<R, `${S}${L}`>
        : S extends ''
        ? never
        : S
    : S
export type NextAlphaWord<T extends string> = NextAlphaWordRec<T>

export type Collapse<T extends { [K in keyof T]: any }> = {
    [K in keyof T]: T[K]
}

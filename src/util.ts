type StringToUnion<
    T extends string,
    Acc = never,
> = T extends `${infer L}${infer R}` ? StringToUnion<R, L | Acc> : Acc

export type Alpha =
    StringToUnion<'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_'>
export type Digit = StringToUnion<'0123456789'>
export type Whitespace = StringToUnion<' \n\t'>

export type TrimLeft<T extends string> = T extends `${Whitespace}${infer R}`
    ? TrimLeft<R>
    : T

type TryConsumeNextMatchingIRec<
    Text extends string,
    Matcher extends string,
    FullMatch extends string,
    Acc extends [string, string],
> = Text extends `${infer TextLeft}${infer TextRight}`
    ? Lowercase<Matcher> extends `${Lowercase<TextLeft>}${infer MatchRight}`
        ? TryConsumeNextMatchingIRec<
              TextRight,
              MatchRight,
              FullMatch,
              [`${Acc[0]}${TextLeft}`, TextRight]
          >
        : Lowercase<Acc[0]> extends Lowercase<FullMatch>
        ? [Lowercase<Acc[0]>, TrimLeft<Acc[1]>]
        : never
    : never

export type TryConsumeNextMatchingI<
    Text extends string,
    Matcher extends string,
> = TryConsumeNextMatchingIRec<TrimLeft<Text>, Matcher, Matcher, ['', '']>

type TryConsumeNextWordRec<
    Text extends string,
    Acc extends [string, string] = ['', ''],
    Chars extends string = Alpha | Digit | '.',
> = Text extends `${infer Left}${infer Right}`
    ? Left extends Chars
        ? TryConsumeNextWordRec<Right, [`${Acc[0]}${Left}`, Right], Chars>
        : [Acc[0], TrimLeft<Acc[1]>]
    : Acc

export type TryConsumeNextWord<Text extends string> = TryConsumeNextWordRec<
    TrimLeft<Text>
>

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

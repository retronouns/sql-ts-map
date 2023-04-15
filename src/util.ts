type StringToUnion<
    T extends string,
    Acc = never,
> = T extends `${infer L}${infer R}` ? StringToUnion<R, L | Acc> : Acc

export type Alpha = StringToUnion<'abcdefghijklmnopqrstuvwxyz_'>
export type Digit = StringToUnion<'0123456789'>
export type Whitespace = StringToUnion<' \n\t'>

export type TrimLeft<T extends string> = T extends `${Whitespace}${infer R}`
    ? TrimLeft<R>
    : T

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

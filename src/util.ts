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

export type AnyCase<T extends string> = string extends T
    ? string
    : T extends `${infer F1}${infer F2}${infer R}`
    ? `${Uppercase<F1> | Lowercase<F1>}${
          | Uppercase<F2>
          | Lowercase<F2>}${AnyCase<R>}`
    : T extends `${infer F}${infer R}`
    ? `${Uppercase<F> | Lowercase<F>}${AnyCase<R>}`
    : ''

export type Flat<T extends { [K in keyof T]: any }> = {
    [K in keyof T]: T[K]
}

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

export type Collapse<T extends { [K in keyof T]: any }> = {
    [K in keyof T]: T[K]
}

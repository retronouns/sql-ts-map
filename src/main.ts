type tables = {
    users: {
        id: number
        name: string
    }
}

type l =
    `select u.id, u.name from users u where u.id = 1`

type Alpha<T extends string = 'abcdefghijklmnopqrstuvwxyz_'> = T extends `${infer L}${infer R}` ? L | Alpha<R> : never
type NextAlphaWord<T extends string, S extends string = ''> = T extends `${infer L}${infer R}` ? L extends Alpha ? NextAlphaWord<R, `${S}${L}`> : S extends '' ? never : S : S

type Whitespace<T extends string = ' \n\t'> = T extends `${infer L}${infer R}` ? L | Whitespace<R> : never
type LeftTrim<T extends string> = T extends `${Whitespace}${infer R}` ? LeftTrim<R> : T

type Digit<T extends string = '0123456789'> = T extends `${infer L}${infer R}` ? L | Digit<R> : never

type Select<T extends string> = Lowercase<NextAlphaWord<T>> extends 'select' ? T extends `${NextAlphaWord<T>}${infer R}` ? SelectReturn<LeftTrim<R>> : never : never

type SelectReturn<T extends string, R extends { columns: { [k in string]: any }, tail: string } = { columns: {}, tail: '' }> = 
    T extends `${NextAlphaWord<T>}.${infer A}` ? 
        T extends `${NextAlphaWord<T>}.${NextAlphaWord<A>}${infer B}` ? 
            LeftTrim<B> extends `,${infer C}` ? 
                [`${NextAlphaWord<T>}.${NextAlphaWord<A>}`, ...SelectReturn<LeftTrim<C>>] : 
                [`${NextAlphaWord<T>}.${NextAlphaWord<A>}`] : 
            never : 
        never

type z = Select<l>
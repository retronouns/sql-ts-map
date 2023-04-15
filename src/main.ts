import {
    Alpha,
    Digit,
    Whitespace,
    NextAlphaWord,
    TrimLeft,
    AnyCase,
} from './util'

type SelectReturn<
    T extends string,
    R extends [string[], string] = [[], ''],
> = T extends `${NextAlphaWord<T>}.${infer A}`
    ? T extends `${NextAlphaWord<T>}.${NextAlphaWord<A>}${infer B}`
        ? TrimLeft<B> extends `,${infer C}`
            ? SelectReturn<
                  TrimLeft<C>,
                  [[...R[0], `${NextAlphaWord<T>}.${NextAlphaWord<A>}`], '']
              >
            : [
                  [...R[0], `${NextAlphaWord<T>}.${NextAlphaWord<A>}`],
                  TrimLeft<B>,
              ]
        : R
    : R

type SelectFrom<T extends string, R extends string[][] = []> = Lowercase<
    NextAlphaWord<T>
> extends 'from'
    ? T extends `${NextAlphaWord<T>}${infer A}`
        ? TrimLeft<A> extends `${NextAlphaWord<TrimLeft<A>>}${infer B}`
            ? TrimLeft<B> extends `${NextAlphaWord<TrimLeft<B>>}${infer C}`
                ? Lowercase<NextAlphaWord<TrimLeft<C>>> extends 'join'
                    ? SelectFrom<
                          TrimLeft<C>,
                          [
                              ...R,
                              [
                                  NextAlphaWord<TrimLeft<A>>,
                                  NextAlphaWord<TrimLeft<B>>,
                              ],
                          ]
                      >
                    : never
                : never
            : never
        : never
    : Lowercase<NextAlphaWord<T>> extends 'join'
    ? T extends `${NextAlphaWord<T>}${infer A}`
        ? TrimLeft<A> extends `${NextAlphaWord<TrimLeft<A>>}${infer B}`
            ? TrimLeft<B> extends `${NextAlphaWord<TrimLeft<B>>}${infer C}`
                ? Lowercase<NextAlphaWord<TrimLeft<C>>> extends 'on'
                    ? TrimLeft<C> extends `${NextAlphaWord<
                          TrimLeft<C>
                      >}${infer D}`
                        ? TrimLeft<D> extends `${infer E}.${infer F}${Whitespace}${infer G}`
                            ? TrimLeft<G> extends `=${infer H}`
                                ? TrimLeft<H> extends `${infer I}.${infer J}${infer K}`
                                    ? SelectFrom<
                                          TrimLeft<K>,
                                          [
                                              ...R,
                                              [
                                                  NextAlphaWord<TrimLeft<A>>,
                                                  NextAlphaWord<TrimLeft<B>>,
                                              ],
                                          ]
                                      >
                                    : never
                                : never
                            : never
                        : never
                    : never
                : never
            : never
        : never
    : R

type Select<T extends string> = Lowercase<NextAlphaWord<T>> extends 'select'
    ? T extends `${NextAlphaWord<T>}${infer R}`
        ? SelectReturn<TrimLeft<R>> extends [
              infer SRColumns extends string[],
              infer SRTail extends string,
          ]
            ? Lowercase<NextAlphaWord<SRTail>> extends 'from'
                ? [SRColumns, SelectFrom<TrimLeft<SRTail>>]
                : never
            : never
        : never
    : never

type z = Select<l>

type tables = {
    users: {
        id: number
        name: string
    }
    posts: {
        id: number
        user_id: number
        title: string | null
        body: string | null
    }
}

type l =
    `select u.id, u.name, p.title, p.body from users u join posts p on p.user_id = u.id where u.id = 1`

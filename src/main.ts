import { Alpha, Digit, Whitespace, NextAlphaWord, TrimLeft, Flat } from './util'
import { Tables } from './tables'

type SelectReturn<
    T extends string,
    R extends [string[][], string] = [[], ''],
> = T extends `${NextAlphaWord<T>}.${infer A}`
    ? T extends `${NextAlphaWord<T>}.${NextAlphaWord<A>}${infer B}`
        ? TrimLeft<B> extends `,${infer C}`
            ? SelectReturn<
                  TrimLeft<C>,
                  [[...R[0], [NextAlphaWord<T>, NextAlphaWord<A>]], '']
              >
            : [[...R[0], [NextAlphaWord<T>, NextAlphaWord<A>]], TrimLeft<B>]
        : R
    : R

type SelectFrom<
    T extends string,
    R extends [string, keyof Tables][] = [],
> = Lowercase<NextAlphaWord<T>> extends 'from'
    ? T extends `${NextAlphaWord<T>}${infer A}`
        ? TrimLeft<A> extends `${keyof Tables}${infer B}`
            ? TrimLeft<B> extends `${NextAlphaWord<TrimLeft<B>>}${infer C}`
                ? Lowercase<NextAlphaWord<TrimLeft<C>>> extends 'join'
                    ? SelectFrom<
                          TrimLeft<C>,
                          [
                              ...R,
                              [
                                  NextAlphaWord<TrimLeft<B>>,
                                  NextAlphaWord<TrimLeft<A>>,
                              ],
                          ]
                      >
                    : never
                : never
            : never
        : never
    : Lowercase<NextAlphaWord<T>> extends 'join'
    ? T extends `${NextAlphaWord<T>}${infer A}`
        ? TrimLeft<A> extends `${keyof Tables}${infer B}`
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
                                                  NextAlphaWord<TrimLeft<B>>,
                                                  NextAlphaWord<TrimLeft<A>>,
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

type FromMap<T extends [string, keyof Tables][]> = T extends [
    infer H extends [string, keyof Tables],
    ...infer R extends [string, keyof Tables][],
]
    ? { [K in H[0]]: H[1] } & FromMap<R>
    : {}

type MapSelect<
    T extends [[string, string][], { [K in string]: keyof Tables }],
    Acc = {},
> = T extends [
    infer Selects,
    infer TableMap extends { [K in string]: keyof Tables },
]
    ? Selects extends [infer First, ...infer Rest extends [string, string][]]
        ? First extends [infer Key extends keyof TableMap, infer Anything]
            ? First extends [
                  infer Anything,
                  infer Column extends keyof Tables[TableMap[Key]],
              ]
                ? MapSelect<
                      [Rest, TableMap],
                      { [K in Column]: Tables[TableMap[Key]][Column] } & Acc
                  >
                : Acc
            : Acc
        : Acc
    : Acc

type Select<T extends string> = Lowercase<NextAlphaWord<T>> extends 'select'
    ? T extends `${NextAlphaWord<T>}${infer R}`
        ? SelectReturn<TrimLeft<R>> extends [
              infer SRColumns extends [string, string][],
              infer SRTail extends string,
          ]
            ? Lowercase<NextAlphaWord<SRTail>> extends 'from'
                ? Flat<
                      MapSelect<
                          [SRColumns, FromMap<SelectFrom<TrimLeft<SRTail>>>]
                      >
                  >
                : never
            : never
        : never
    : never

type SelectTest =
    Select<`select u.id, u.name, p.title, p.body from users u join posts p on p.user_id = u.id where u.id = 1`>

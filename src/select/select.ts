import { DbTables } from './../tables'
import { ParseTokens } from './../token'

export type Select<T extends string> = ConsumeSelect<DbTables, T>

export type AliasedTables<
    Tables extends { [J: string]: { [K: string]: any } },
    Aliases extends [keyof Tables, string][],
> = Tables & {
    [L in Aliases[number] as L[1]]: Tables[L[0]]
}

export type MapColumnsToTables<
    Columns extends [string, string, string][],
    Tables extends {
        [K: string]: {
            [L: string]: any
        }
    },
> = {
    [L in Columns[number] as L[2]]: Tables[L[0]][L[1]]
}

export type ConsumeSelect<
    Tables extends { [J: string]: { [K: string]: any } },
    T extends string,
> = ParseTokens<T> extends infer Parsed extends string[]
    ? ConsumeSelectColumns<Parsed> extends infer ConsumedColumns extends [
          [string, string, string][],
          string[],
      ]
        ? [[], []] extends ConsumedColumns // [[], []] indicates parse failure
            ? never
            : Parsed extends [
                  ...ConsumedColumns[1],
                  ...infer FromTokens extends string[],
              ]
            ? ConsumeSelectFrom<
                  Tables,
                  FromTokens
              > extends infer ConsumedTables extends [
                  [keyof Tables, string][],
                  string[],
              ]
                ? MapColumnsToTables<
                      ConsumedColumns[0],
                      AliasedTables<Tables, ConsumedTables[0]>
                  >
                : never
            : never
        : never
    : never

type JOIN_END = `WHERE` | `JOIN` | `LEFT` | `FULL` | `OUTER` | `RIGHT` | `INNER`
export type ConsumeSelectFrom<
    Tables extends { [J: string]: { [K: string]: any } },
    T extends string[],
> = T extends [
    `FROM`,
    infer Table extends string,
    infer Alias extends string,
    infer FromEnd extends JOIN_END,
    ...infer Rest extends string[],
]
    ? ConsumeSelectJoinsRec<
          Tables,
          [FromEnd, ...Rest],
          [[[Table, Alias]], [`FROM`, Table, Alias, FromEnd]]
      >
    : T extends [
          `FROM`,
          infer Table extends string,
          infer FromEnd extends JOIN_END,
          ...infer Rest extends string[],
      ]
    ? ConsumeSelectJoinsRec<
          Tables,
          [FromEnd, ...Rest],
          [[[Table, Table]], [`FROM`, Table, FromEnd]]
      >
    : never

export type ConsumeSelectJoinsRec<
    Tables extends { [J: string]: { [K: string]: any } },
    T extends string[],
    Acc extends [[keyof Tables, string][], string[]], // [[table, alias][], [...consumed]]
> = T extends [...ConsumeUntilJoin<T>, `JOIN`, ...infer A]
    ? A extends [
          infer Table extends string,
          infer Alias extends string,
          `ON`,
          ...infer Rest extends string[],
      ]
        ? ConsumeSelectJoinsRec<
              Tables,
              Rest,
              [
                  [...Acc[0], [Table, Alias]],
                  [
                      ...Acc[1],
                      ...ConsumeUntilJoin<T>,
                      `JOIN`,
                      Table,
                      Alias,
                      `ON`,
                  ],
              ]
          >
        : A extends [
              infer Table extends string,
              `ON`,
              ...infer Rest extends string[],
          ]
        ? ConsumeSelectJoinsRec<
              Tables,
              Rest,
              [
                  [...Acc[0], [Table, Table]],
                  [...Acc[1], ...ConsumeUntilJoin<T>, `JOIN`, Table, `ON`],
              ]
          >
        : Acc
    : Acc

export type ConsumeUntilJoin<T extends string[]> = ConsumeUntilJoinRec<T, []>
type ConsumeUntilJoinRec<T extends string[], Acc extends string[]> = T extends [
    `JOIN` | `WHERE`,
    ...infer _,
]
    ? Acc
    : T extends [infer Token extends string, ...infer Rest extends string[]]
    ? ConsumeUntilJoinRec<Rest, [...Acc, Token]>
    : never

type COL_START = `SELECT` | `,`
type COL_END = `FROM` | `,`
type AS = `AS`
export type ConsumeSelectColumns<T extends string[]> = ConsumeSelectColumnsRec<
    T,
    [[], []]
>
export type ConsumeSelectColumnsRec<
    T extends string[],
    Acc extends [[string, string, string][], string[]], // [[table, column, alias][], [...consumed]]
> = T extends [
    // parses with a table identifier
    infer Start extends COL_START,
    `${infer Table}.${infer Column}`,
    infer End extends COL_END,
    ...infer Rest extends string[],
]
    ? ConsumeSelectColumnsRec<
          [End, ...Rest],
          [
              [...Acc[0], [Table, Column, Column]],
              [...Acc[1], Start, `${Table}.${Column}`],
          ]
      >
    : T extends [
          // parses with a table identifier & an explicit alias
          infer Start extends COL_START,
          `${infer Table}.${infer Column}`,
          AS,
          infer Alias extends string,
          infer End extends COL_END,
          ...infer Rest extends string[],
      ]
    ? ConsumeSelectColumnsRec<
          [End, ...Rest],
          [
              [...Acc[0], [Table, Column, Alias]],
              [...Acc[1], Start, `${Table}.${Column}`, AS, Alias],
          ]
      >
    : T extends [
          // parses with a table identifier & an implicit alias
          infer Start extends COL_START,
          `${infer Table}.${infer Column}`,
          infer Alias extends string,
          infer End extends COL_END,
          ...infer Rest extends string[],
      ]
    ? ConsumeSelectColumnsRec<
          [End, ...Rest],
          [
              [...Acc[0], [Table, Column, Alias]],
              [...Acc[1], Start, `${Table}.${Column}`, Alias],
          ]
      >
    : T extends [
          // parses naive case
          infer Start extends COL_START,
          infer Column extends string,
          infer End extends COL_END,
          ...infer Rest extends string[],
      ]
    ? ConsumeSelectColumnsRec<
          [End, ...Rest],
          [[...Acc[0], [``, Column, Column]], [...Acc[1], Start, Column]]
      >
    : T extends [
          // parses naive case with an explicit alias
          infer Start extends COL_START,
          infer Column extends string,
          AS,
          infer Alias extends string,
          infer End extends COL_END,
          ...infer Rest extends string[],
      ]
    ? ConsumeSelectColumnsRec<
          [End, ...Rest],
          [
              [...Acc[0], [``, Column, Alias]],
              [...Acc[1], Start, Column, AS, Alias],
          ]
      >
    : T extends [
          // parses naive case with an implicit alias
          infer Start extends COL_START,
          infer Column extends string,
          infer Alias extends string,
          infer End extends COL_END,
          ...infer Rest extends string[],
      ]
    ? ConsumeSelectColumnsRec<
          [End, ...Rest],
          [[...Acc[0], [``, Column, Alias]], [...Acc[1], Start, Column, Alias]]
      >
    : Acc

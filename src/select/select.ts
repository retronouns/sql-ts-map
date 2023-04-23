import { Whitespace, TrimLeft, Collapse } from './../util'
import { Tables } from './../tables'
import { ParseTokens } from './../token'

const SQL = `
SELECT 
    u.id,
    u.name,
    p.title,
    p.body
FROM users u
JOIN posts p ON p.user_id = u.id
WHERE u.id = 1`

type SelectParts<T extends string> = ParseTokens<T> extends [
    'select',
    ...infer A,
]
    ? A extends [...infer SelectColumns extends string[], 'from', ...infer Rest]
        ? SelectColumns
        : `A`
    : never

export type Select<T extends string> = ParseTokens<T>

type test = SelectParts<typeof SQL>
type test2 = ConsumeSelectColumns<[`SELECT`, `id`, `,`]>
type test3 = ConsumeSelectColumns<ParseTokens<typeof SQL>>
type COL_START = `SELECT` | `,`
type COL_END = `FROM` | `,`
type AS = `AS`
export type ConsumeSelectColumns<T extends string[]> = ConsumeSelectColumnsRec<
    T,
    [[], []]
>
export type ConsumeSelectColumnsRec<
    T extends string[],
    Acc extends [[string, string, string][], string[]], // [[table, column, alias], [...tail]]
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
// type ConsumeSelectColumns<
//     T extends string[],
//     Acc extends [string, string][],
// > = T extends ['FROM', ...infer Tail]
//     ? Acc
//     :

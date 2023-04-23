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
type test2 = ConsumeSelectColumn<[`SELECT`, `id`, `,`]>
type test3 = ConsumeSelectColumn<ParseTokens<typeof SQL>>
type COL_START = `SELECT` | `,`
type COL_END = `FROM` | `,`
type AS = `AS`
export type ConsumeSelectColumn<T extends string[]> = ConsumeSelectColumnRec<
    T,
    []
>
export type ConsumeSelectColumnRec<
    T extends string[],
    Acc extends [string, string, string][], // [table, column, alias]
> = T extends [
    // parses with a table identifier
    COL_START,
    `${infer Table}.${infer Column}`,
    infer End extends COL_END,
    ...infer Rest extends string[],
]
    ? ConsumeSelectColumnRec<[End, ...Rest], [...Acc, [Table, Column, Column]]>
    : T extends [
          // parses with a table identifier & an explicit alias
          COL_START,
          `${infer Table}.${infer Column}`,
          AS,
          infer Alias extends string,
          infer End extends COL_END,
          ...infer Rest extends string[],
      ]
    ? ConsumeSelectColumnRec<[End, ...Rest], [...Acc, [Table, Column, Alias]]>
    : T extends [
          // parses with a table identifier & an implicit alias
          COL_START,
          `${infer Table}.${infer Column}`,
          infer Alias extends string,
          infer End extends COL_END,
          ...infer Rest extends string[],
      ]
    ? ConsumeSelectColumnRec<[End, ...Rest], [...Acc, [Table, Column, Alias]]>
    : T extends [
          // parses naive case
          COL_START,
          infer Column extends string,
          infer End extends COL_END,
          ...infer Rest extends string[],
      ]
    ? ConsumeSelectColumnRec<[End, ...Rest], [...Acc, [``, Column, Column]]>
    : T extends [
          // parses naive case with an explicit alias
          COL_START,
          infer Column extends string,
          AS,
          infer Alias extends string,
          infer End extends COL_END,
          ...infer Rest extends string[],
      ]
    ? ConsumeSelectColumnRec<[End, ...Rest], [...Acc, [``, Column, Alias]]>
    : T extends [
          // parses naive case with an implicit alias
          COL_START,
          infer Column extends string,
          infer Alias extends string,
          infer End extends COL_END,
          ...infer Rest extends string[],
      ]
    ? ConsumeSelectColumnRec<[End, ...Rest], [...Acc, [``, Column, Alias]]>
    : Acc
// type ConsumeSelectColumns<
//     T extends string[],
//     Acc extends [string, string][],
// > = T extends ['FROM', ...infer Tail]
//     ? Acc
//     :

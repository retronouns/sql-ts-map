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

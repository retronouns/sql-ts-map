import {
    NextAlphaWord,
    TryConsumeNextMatchingI,
    TryConsumeNextWord,
    Alpha,
    Digit,
    Whitespace,
    TrimLeft,
    Collapse,
} from './util'

const SQL = `
SELECT 
    u.id,
    u.name,
    p.title,
    p.body
FROM users u
JOIN posts p ON p.user_id = u.id
WHERE u.id = 1`

type TryConsumeSelect<Text extends string> = TryConsumeNextMatchingI<
    Text,
    'SELECT'
> extends [infer _, infer Rest extends string]
    ? TryConsumeSelectReturn<Rest> extends [infer Columns, infer Rest]
        ? Columns
        : never
    : never

type TryConsumeSelectFrom<Text extends string> = TryConsumeNextMatchingI<
    Text,
    'FROM'
> extends infer Text extends string
    ? TryConsumeNextWord<Text> extends [
          infer Column extends string,
          infer Tail extends string,
      ]
        ? Column
        : never
    : never

type test = TryConsumeSelectFrom<`FROM users u
JOIN posts p ON p.user_id = u.id
WHERE u.id = 1`>
// : TryConsumeNextMatchingI<Text, 'JOIN'> extends [infer _, infer Rest]
// ? TryConsumeSelectFrom<Rest, Acc>
// : Acc

type TryConsumeSelectReturn<
    Text extends string,
    Acc extends [[string, string][], string] = [[], ''],
> = TryConsumeNextWord<Text> extends [infer Column extends string, infer Rest]
    ? Rest extends `,${infer Tail}`
        ? TryConsumeSelectReturn<Tail, [[...Acc[0], ParseColumn<Column>], Rest]>
        : [[...Acc[0], ParseColumn<Column>], Rest]
    : never

type ParseColumn<Text extends string> =
    Text extends `${infer Alias}.${infer Value}` ? [Alias, Value] : never

type SelectTest = TryConsumeSelect<typeof SQL>

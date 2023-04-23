import { ParseString, ParseToken, ParseWord, ParseTokens } from './token'

const expectToBe = <T>(a: T): T => {
    return a
}
const expectNever = <T extends never>() => {}

// parses naive case
expectToBe<ParseString<`'stringy string!'`>>(`'stringy string!'`)
// parses naive case with an escape
expectToBe<ParseString<`'i\\'m a string!'`>>(`'i\\'m a string!'`)
// doesn't parse past end of string
expectToBe<ParseString<`'i\\'m a string!' extra stuff`>>(`'i\\'m a string!'`)
// skips leading whitespace
expectToBe<ParseString<` 'i\\'m a string!'`>>(`'i\\'m a string!'`)
expectToBe<ParseString<`     'i\\'m a string!'`>>(`'i\\'m a string!'`)
// parses as never if given non-string
expectNever<ParseString<`extra 'i\\'m a string!' extra stuff`>>()

type test = ParseToken<`tokenA=tokenB`>

// parses naive case
expectToBe<ParseToken<`token`>>(`token`)
// only parses 1 token
expectToBe<ParseToken<`tokenA tokenB`>>(`tokenA`)
// skips leading whitespace
expectToBe<ParseToken<` tokenA tokenB`>>(`tokenA`)
expectToBe<ParseToken<`     tokenA tokenB`>>(`tokenA`)
// comparator chars indicate end of token
expectToBe<ParseToken<`tokenA=tokenB`>>(`tokenA`)
expectToBe<ParseToken<`tokenA>tokenB`>>(`tokenA`)
expectToBe<ParseToken<`tokenA<tokenB`>>(`tokenA`)
expectToBe<ParseToken<`tokenA = tokenB`>>(`tokenA`)
expectToBe<ParseToken<`tokenA > tokenB`>>(`tokenA`)
expectToBe<ParseToken<`tokenA < tokenB`>>(`tokenA`)

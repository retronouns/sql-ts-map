import { expectToBe, expectNever } from './../test'
import { ParseString, ParseWord, ParseToken, ParseTokens } from './token'

const VERY_LONG_STRING = `'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'`
const VERY_LONG_WORDS = `Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum has been the industrys standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book It has survived not only five centuries but also the leap into electronic typesetting remaining essentially unchanged It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum`
const VERY_LONG_TOKENS = `Lorem  Ipsum   1 is 12 simply 123 dummy \n text\n\n\n of the printing and typesetting industry Lorem Ipsum has been the industrys standard dummy text ever since the 1500s when an unknown 'i\\'m a string' took a galley of type and scrambled it to make a type specimen book It has survived not only five centuries but also the leap into electronic typesetting remaining essentially unchanged It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum 'i\\'m a string'`

/**
 * ParseString Tests
 */

// parses naive case
expectToBe<ParseString<`'stringy string!'`>>(`'stringy string!'`)
// parses naive case with an escape
expectToBe<ParseString<`'i\\'m a string!'`>>(`'i\\'m a string!'`)
// parses naive case with a newline
expectToBe<ParseString<`'stringy \nstring!'`>>(`'stringy \nstring!'`)
// parses naive case with a tab
expectToBe<ParseString<`'stringy \tstring!'`>>(`'stringy \tstring!'`)
// parses an empty string
expectToBe<ParseString<`''`>>(`''`)
// parses a string with just whitespace
expectToBe<ParseString<`' '`>>(`' '`)
// doesn't parse past end of string
expectToBe<ParseString<`'i\\'m a string!' extra stuff`>>(`'i\\'m a string!'`)
// leading whitespace fails
expectNever<ParseString<` 'i\\'m a string!'`>>()
expectNever<ParseString<`     'i\\'m a string!'`>>()
// parses as never if given non-string
expectNever<ParseString<`extra 'i\\'m a string!' extra stuff`>>()
// doesn't hit recursion limit
expectToBe<ParseString<typeof VERY_LONG_STRING>>(VERY_LONG_STRING)
// doesn't hit recursion limit with extra
expectToBe<ParseString<`${typeof VERY_LONG_STRING} extra`>>(VERY_LONG_STRING)

/**
 * ParseWord Tests
 */

// parses naive case
expectToBe<ParseWord<`token`>>(`token`)
// only parses 1 word
expectToBe<ParseWord<`tokenA tokenB`>>(`tokenA`)
// parses digits
expectToBe<ParseWord<`123 tokenB`>>(`123`)
// leading whitespace fails
expectNever<ParseWord<` tokenA tokenB`>>()
expectNever<ParseWord<`     tokenA tokenB`>>()
// comparator chars indicate end of token
expectToBe<ParseWord<`tokenA=tokenB`>>(`tokenA`)
expectToBe<ParseWord<`tokenA>tokenB`>>(`tokenA`)
expectToBe<ParseWord<`tokenA<tokenB`>>(`tokenA`)
expectToBe<ParseWord<`tokenA<=tokenB`>>(`tokenA`)
expectToBe<ParseWord<`tokenA<=tokenB`>>(`tokenA`)
expectToBe<ParseWord<`tokenA!=tokenB`>>(`tokenA`)
expectToBe<ParseWord<`tokenA = tokenB`>>(`tokenA`)
expectToBe<ParseWord<`tokenA > tokenB`>>(`tokenA`)
expectToBe<ParseWord<`tokenA < tokenB`>>(`tokenA`)
expectToBe<ParseWord<`tokenA <= tokenB`>>(`tokenA`)
expectToBe<ParseWord<`tokenA <= tokenB`>>(`tokenA`)
expectToBe<ParseWord<`tokenA != tokenB`>>(`tokenA`)
expectToBe<ParseWord<`123=tokenB`>>(`123`)
expectToBe<ParseWord<`123>tokenB`>>(`123`)
expectToBe<ParseWord<`123<tokenB`>>(`123`)
expectToBe<ParseWord<`123<=tokenB`>>(`123`)
expectToBe<ParseWord<`123<=tokenB`>>(`123`)
expectToBe<ParseWord<`123!=tokenB`>>(`123`)
expectToBe<ParseWord<`123 = tokenB`>>(`123`)
expectToBe<ParseWord<`123 > tokenB`>>(`123`)
expectToBe<ParseWord<`123 < tokenB`>>(`123`)
expectToBe<ParseWord<`123 <= tokenB`>>(`123`)
expectToBe<ParseWord<`123 <= tokenB`>>(`123`)
expectToBe<ParseWord<`123 != tokenB`>>(`123`)
// alias and accessor are one token
expectToBe<ParseWord<`u.id`>>(`u.id`)
// table and accessor are one token
expectToBe<ParseWord<`users.id`>>(`users.id`)
// column separator indicates end of token
expectToBe<ParseWord<`id,`>>(`id`)
// doesn't hit recursion limit
expectToBe<ParseWord<typeof VERY_LONG_WORDS>>(`Lorem`)

/**
 * ParseToken Tests
 */
// parses an identifier
expectToBe<ParseToken<`tokenA tokenB`>>(`tokenA`)
// parses a 1-char identifier
expectToBe<ParseToken<`a tokenB`>>(`a`)
// parses a string
expectToBe<ParseToken<`'tokenA tokenB' tokenC`>>(`'tokenA tokenB'`)
// parses a string with an escape
expectToBe<ParseToken<`'tokenA\\'s tokenB' tokenC`>>(`'tokenA\\'s tokenB'`)
// parses special characters
expectToBe<ParseToken<`=u.id`>>(`=`)
expectToBe<ParseToken<`= u.id`>>(`=`)
expectToBe<ParseToken<` =u.id`>>(`=`)
expectToBe<ParseToken<` = u.id`>>(`=`)
expectToBe<ParseToken<`,u.id`>>(`,`)
expectToBe<ParseToken<`, u.id`>>(`,`)
expectToBe<ParseToken<` ,u.id`>>(`,`)
expectToBe<ParseToken<` , u.id`>>(`,`)
expectToBe<ParseToken<`>u.id`>>(`>`)
expectToBe<ParseToken<`> u.id`>>(`>`)
expectToBe<ParseToken<` >u.id`>>(`>`)
expectToBe<ParseToken<` > u.id`>>(`>`)
expectToBe<ParseToken<`<u.id`>>(`<`)
expectToBe<ParseToken<`< u.id`>>(`<`)
expectToBe<ParseToken<` <u.id`>>(`<`)
expectToBe<ParseToken<` < u.id`>>(`<`)
expectToBe<ParseToken<`<=u.id`>>(`<=`)
expectToBe<ParseToken<`<= u.id`>>(`<=`)
expectToBe<ParseToken<` <=u.id`>>(`<=`)
expectToBe<ParseToken<` <= u.id`>>(`<=`)
expectToBe<ParseToken<`>=u.id`>>(`>=`)
expectToBe<ParseToken<`>= u.id`>>(`>=`)
expectToBe<ParseToken<` >=u.id`>>(`>=`)
expectToBe<ParseToken<` >= u.id`>>(`>=`)
expectToBe<ParseToken<`!=u.id`>>(`!=`)
expectToBe<ParseToken<`!= u.id`>>(`!=`)
expectToBe<ParseToken<` !=u.id`>>(`!=`)
expectToBe<ParseToken<` != u.id`>>(`!=`)
// special chars indicate end of token
expectToBe<ParseToken<`tokenA=tokenB`>>(`tokenA`)
expectToBe<ParseToken<`tokenA>tokenB`>>(`tokenA`)
expectToBe<ParseToken<`tokenA<tokenB`>>(`tokenA`)
expectToBe<ParseToken<`tokenA = tokenB`>>(`tokenA`)
expectToBe<ParseToken<`tokenA > tokenB`>>(`tokenA`)
expectToBe<ParseToken<`tokenA < tokenB`>>(`tokenA`)
expectToBe<ParseToken<`tokenA, tokenB`>>(`tokenA`)
expectToBe<ParseToken<`tokenA , tokenB`>>(`tokenA`)
expectToBe<ParseToken<`123=tokenB`>>(`123`)
expectToBe<ParseToken<`123>tokenB`>>(`123`)
expectToBe<ParseToken<`123<tokenB`>>(`123`)
expectToBe<ParseToken<`123 = tokenB`>>(`123`)
expectToBe<ParseToken<`123 > tokenB`>>(`123`)
expectToBe<ParseToken<`123 < tokenB`>>(`123`)
expectToBe<ParseToken<`123, tokenB`>>(`123`)
expectToBe<ParseToken<`123 , tokenB`>>(`123`)
// trims leading whitespace
expectToBe<ParseToken<` tokenA tokenB`>>(`tokenA`)
expectToBe<ParseToken<`   tokenA tokenB`>>(`tokenA`)
expectToBe<ParseToken<`\ntokenA tokenB`>>(`tokenA`)
expectToBe<ParseToken<`\n\n\ntokenA tokenB`>>(`tokenA`)
expectToBe<ParseToken<` a tokenB`>>(`a`)
expectToBe<ParseToken<`   a tokenB`>>(`a`)
expectToBe<ParseToken<`\na tokenB`>>(`a`)
expectToBe<ParseToken<`\n\n\na tokenB`>>(`a`)
expectToBe<ParseToken<` 'tokenA tokenB' tokenC`>>(`'tokenA tokenB'`)
expectToBe<ParseToken<`   'tokenA tokenB' tokenC`>>(`'tokenA tokenB'`)
expectToBe<ParseToken<`\n'tokenA tokenB' tokenC`>>(`'tokenA tokenB'`)
expectToBe<ParseToken<`\n\n\n'tokenA tokenB' tokenC`>>(`'tokenA tokenB'`)
expectToBe<ParseToken<` 'tokenA\\'s tokenB' tokenC`>>(`'tokenA\\'s tokenB'`)
expectToBe<ParseToken<`   'tokenA\\'s tokenB' tokenC`>>(`'tokenA\\'s tokenB'`)
expectToBe<ParseToken<`\n'tokenA\\'s tokenB' tokenC`>>(`'tokenA\\'s tokenB'`)
expectToBe<ParseToken<`\n\n\n'tokenA\\'s tokenB' tokenC`>>(
    `'tokenA\\'s tokenB'`,
)
// doesn't hit recursion limit
expectToBe<ParseToken<typeof VERY_LONG_WORDS>>(`Lorem`)

/**
 * ParseTokens Test
 */

// parses multiple tokens into an array
expectToBe<ParseTokens<`tokenA tokenB tokenC`>>([`tokenA`, `tokenB`, `tokenC`])
expectToBe<ParseTokens<`tokenA 'tokenB still tokenB' tokenC`>>([
    `tokenA`,
    `'tokenB still tokenB'`,
    `tokenC`,
])
// parses reserved words to uppercase but not others
expectToBe<
    ParseTokens<`tokenA select AS From tokenB jOiN WHEre 'I\\'m a string!' tokenC`>
>([
    `tokenA`,
    `SELECT`,
    `AS`,
    `FROM`,
    `tokenB`,
    `JOIN`,
    `WHERE`,
    `'I\\'m a string!'`,
    `tokenC`,
])
// parses special characters
expectToBe<ParseTokens<`=u.id`>>([`=`, `u.id`])
expectToBe<ParseTokens<`= u.id`>>([`=`, `u.id`])
expectToBe<ParseTokens<` =u.id`>>([`=`, `u.id`])
expectToBe<ParseTokens<` = u.id`>>([`=`, `u.id`])
expectToBe<ParseTokens<`,u.id`>>([`,`, `u.id`])
expectToBe<ParseTokens<`, u.id`>>([`,`, `u.id`])
expectToBe<ParseTokens<` ,u.id`>>([`,`, `u.id`])
expectToBe<ParseTokens<` , u.id`>>([`,`, `u.id`])
expectToBe<ParseTokens<`>u.id`>>([`>`, `u.id`])
expectToBe<ParseTokens<`> u.id`>>([`>`, `u.id`])
expectToBe<ParseTokens<` >u.id`>>([`>`, `u.id`])
expectToBe<ParseTokens<` > u.id`>>([`>`, `u.id`])
expectToBe<ParseTokens<`<u.id`>>([`<`, `u.id`])
expectToBe<ParseTokens<`< u.id`>>([`<`, `u.id`])
expectToBe<ParseTokens<` <u.id`>>([`<`, `u.id`])
expectToBe<ParseTokens<` < u.id`>>([`<`, `u.id`])
expectToBe<ParseTokens<`<=u.id`>>([`<=`, `u.id`])
expectToBe<ParseTokens<`<= u.id`>>([`<=`, `u.id`])
expectToBe<ParseTokens<` <=u.id`>>([`<=`, `u.id`])
expectToBe<ParseTokens<` <= u.id`>>([`<=`, `u.id`])
expectToBe<ParseTokens<`>=u.id`>>([`>=`, `u.id`])
expectToBe<ParseTokens<`>= u.id`>>([`>=`, `u.id`])
expectToBe<ParseTokens<` >=u.id`>>([`>=`, `u.id`])
expectToBe<ParseTokens<` >= u.id`>>([`>=`, `u.id`])
expectToBe<ParseTokens<`!=u.id`>>([`!=`, `u.id`])
expectToBe<ParseTokens<`!= u.id`>>([`!=`, `u.id`])
expectToBe<ParseTokens<` !=u.id`>>([`!=`, `u.id`])
expectToBe<ParseTokens<` != u.id`>>([`!=`, `u.id`])
// special chars indicate end of token
expectToBe<ParseTokens<`tokenA=tokenB`>>([`tokenA`, `=`, `tokenB`])
expectToBe<ParseTokens<`tokenA>tokenB`>>([`tokenA`, `>`, `tokenB`])
expectToBe<ParseTokens<`tokenA<tokenB`>>([`tokenA`, `<`, `tokenB`])
expectToBe<ParseTokens<`tokenA>=tokenB`>>([`tokenA`, `>=`, `tokenB`])
expectToBe<ParseTokens<`tokenA<=tokenB`>>([`tokenA`, `<=`, `tokenB`])
expectToBe<ParseTokens<`tokenA!=tokenB`>>([`tokenA`, `!=`, `tokenB`])
expectToBe<ParseTokens<`tokenA = tokenB`>>([`tokenA`, `=`, `tokenB`])
expectToBe<ParseTokens<`tokenA > tokenB`>>([`tokenA`, `>`, `tokenB`])
expectToBe<ParseTokens<`tokenA < tokenB`>>([`tokenA`, `<`, `tokenB`])
expectToBe<ParseTokens<`tokenA >= tokenB`>>([`tokenA`, `>=`, `tokenB`])
expectToBe<ParseTokens<`tokenA <= tokenB`>>([`tokenA`, `<=`, `tokenB`])
expectToBe<ParseTokens<`tokenA != tokenB`>>([`tokenA`, `!=`, `tokenB`])
expectToBe<ParseTokens<`tokenA, tokenB`>>([`tokenA`, `,`, `tokenB`])
expectToBe<ParseTokens<`tokenA , tokenB`>>([`tokenA`, `,`, `tokenB`])
// trims leading whitespace
expectToBe<ParseTokens<` tokenA tokenB tokenC`>>([`tokenA`, `tokenB`, `tokenC`])
expectToBe<ParseTokens<`     tokenA tokenB tokenC`>>([
    `tokenA`,
    `tokenB`,
    `tokenC`,
])
expectToBe<ParseTokens<`\ntokenA tokenB tokenC`>>([
    `tokenA`,
    `tokenB`,
    `tokenC`,
])
expectToBe<ParseTokens<`\n\n\ntokenA tokenB tokenC`>>([
    `tokenA`,
    `tokenB`,
    `tokenC`,
])
// doesn't hit recursion limit
expectToBe<
    ParseTokens<`${typeof VERY_LONG_TOKENS}, ${typeof VERY_LONG_TOKENS}`>
>([
    `Lorem`,
    `Ipsum`,
    `1`,
    `is`,
    `12`,
    `simply`,
    `123`,
    `dummy`,
    `text`,
    `of`,
    `the`,
    `printing`,
    `and`,
    `typesetting`,
    `industry`,
    `Lorem`,
    `Ipsum`,
    `has`,
    `been`,
    `the`,
    `industrys`,
    `standard`,
    `dummy`,
    `text`,
    `ever`,
    `since`,
    `the`,
    `1500s`,
    `when`,
    `an`,
    `unknown`,
    `'i\\'m a string'`,
    `took`,
    `a`,
    `galley`,
    `of`,
    `type`,
    `and`,
    `scrambled`,
    `it`,
    `to`,
    `make`,
    `a`,
    `type`,
    `specimen`,
    `book`,
    `It`,
    `has`,
    `survived`,
    `not`,
    `only`,
    `five`,
    `centuries`,
    `but`,
    `also`,
    `the`,
    `leap`,
    `into`,
    `electronic`,
    `typesetting`,
    `remaining`,
    `essentially`,
    `unchanged`,
    `It`,
    `was`,
    `popularised`,
    `in`,
    `the`,
    `1960s`,
    `with`,
    `the`,
    `release`,
    `of`,
    `Letraset`,
    `sheets`,
    `containing`,
    `Lorem`,
    `Ipsum`,
    `passages`,
    `and`,
    `more`,
    `recently`,
    `with`,
    `desktop`,
    `publishing`,
    `software`,
    `like`,
    `Aldus`,
    `PageMaker`,
    `including`,
    `versions`,
    `of`,
    `Lorem`,
    `Ipsum`,
    `'i\\'m a string'`,
    `,`,
    `Lorem`,
    `Ipsum`,
    `1`,
    `is`,
    `12`,
    `simply`,
    `123`,
    `dummy`,
    `text`,
    `of`,
    `the`,
    `printing`,
    `and`,
    `typesetting`,
    `industry`,
    `Lorem`,
    `Ipsum`,
    `has`,
    `been`,
    `the`,
    `industrys`,
    `standard`,
    `dummy`,
    `text`,
    `ever`,
    `since`,
    `the`,
    `1500s`,
    `when`,
    `an`,
    `unknown`,
    `'i\\'m a string'`,
    `took`,
    `a`,
    `galley`,
    `of`,
    `type`,
    `and`,
    `scrambled`,
    `it`,
    `to`,
    `make`,
    `a`,
    `type`,
    `specimen`,
    `book`,
    `It`,
    `has`,
    `survived`,
    `not`,
    `only`,
    `five`,
    `centuries`,
    `but`,
    `also`,
    `the`,
    `leap`,
    `into`,
    `electronic`,
    `typesetting`,
    `remaining`,
    `essentially`,
    `unchanged`,
    `It`,
    `was`,
    `popularised`,
    `in`,
    `the`,
    `1960s`,
    `with`,
    `the`,
    `release`,
    `of`,
    `Letraset`,
    `sheets`,
    `containing`,
    `Lorem`,
    `Ipsum`,
    `passages`,
    `and`,
    `more`,
    `recently`,
    `with`,
    `desktop`,
    `publishing`,
    `software`,
    `like`,
    `Aldus`,
    `PageMaker`,
    `including`,
    `versions`,
    `of`,
    `Lorem`,
    `Ipsum`,
    `'i\\'m a string'`,
])

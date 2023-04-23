import { expectToBe, expectNever } from '../test'
import { ConsumeSelectColumn } from './select'

// prettier-ignore
const test = () => {

    // parses with a table identifier
    expectToBe<ConsumeSelectColumn<[`SELECT`, `u.id`, `,`]>>([[`u`, `id`, `id`]])
    expectToBe<ConsumeSelectColumn<[`,`, `u.id`, `,`]>>([[`u`, `id`, `id`]])
    expectToBe<ConsumeSelectColumn<[`SELECT`, `u.id`, `FROM`]>>([[`u`, `id`, `id`]])
    expectToBe<ConsumeSelectColumn<[`,`, `u.id`, `FROM`]>>([[`u`, `id`, `id`]])
    // parses with a table identifier & an explicit alias
    expectToBe<ConsumeSelectColumn<[`SELECT`, `u.id`, `AS`, `userId`, `,`]>>([[`u`, `id`, `userId`]])
    expectToBe<ConsumeSelectColumn<[`,`, `u.id`, `AS`, `userId`, `,`]>>([[`u`, `id`, `userId`]])
    expectToBe<ConsumeSelectColumn<[`SELECT`, `u.id`, `AS`, `userId`, `FROM`]>>([[`u`, `id`, `userId`]])
    expectToBe<ConsumeSelectColumn<[`,`, `u.id`, `AS`, `userId`, `FROM`]>>([[`u`, `id`, `userId`]])
    // parses with a table identifier & an implicit alias
    expectToBe<ConsumeSelectColumn<[`SELECT`, `u.id`, `userId`, `,`]>>([[`u`, `id`, `userId`]])
    expectToBe<ConsumeSelectColumn<[`,`, `u.id`, `userId`, `,`]>>([[`u`, `id`, `userId`]])
    expectToBe<ConsumeSelectColumn<[`SELECT`, `u.id`, `userId`, `FROM`]>>([[`u`, `id`, `userId`]])
    expectToBe<ConsumeSelectColumn<[`,`, `u.id`, `userId`, `FROM`]>>([[`u`, `id`, `userId`]])

    // parses naive case
    expectToBe<ConsumeSelectColumn<[`SELECT`, `id`, `,`]>>([[``, `id`, `id`]])
    expectToBe<ConsumeSelectColumn<[`,`, `id`, `,`]>>([[``, `id`, `id`]])
    expectToBe<ConsumeSelectColumn<[`SELECT`, `id`, `FROM`]>>([[``, `id`, `id`]])
    expectToBe<ConsumeSelectColumn<[`,`, `id`, `FROM`]>>([[``, `id`, `id`]])
    // parses with an explicit alias
    expectToBe<ConsumeSelectColumn<[`SELECT`, `id`, `AS`, `userId`, `,`]>>([[``, `id`, `userId`]])
    expectToBe<ConsumeSelectColumn<[`,`, `id`, `AS`, `userId`, `,`]>>([[``, `id`, `userId`]])
    expectToBe<ConsumeSelectColumn<[`SELECT`, `id`, `AS`, `userId`, `FROM`]>>([[``, `id`, `userId`]])
    expectToBe<ConsumeSelectColumn<[`,`, `id`, `AS`, `userId`, `FROM`]>>([[``, `id`, `userId`]])
    // parses with an implicit alias
    expectToBe<ConsumeSelectColumn<[`SELECT`, `id`, `userId`, `,`]>>([[``, `id`, `userId`]])
    expectToBe<ConsumeSelectColumn<[`,`, `id`, `userId`, `,`]>>([[``, `id`, `userId`]])
    expectToBe<ConsumeSelectColumn<[`SELECT`, `id`, `userId`, `FROM`]>>([[``, `id`, `userId`]])
    expectToBe<ConsumeSelectColumn<[`,`, `id`, `userId`, `FROM`]>>([[``, `id`, `userId`]])

    // parses a string
    expectToBe<ConsumeSelectColumn<[`SELECT`, `'stringy string'`, `,`]>>([[``, `'stringy string'`, `'stringy string'`]])
    expectToBe<ConsumeSelectColumn<[`,`, `'stringy string'`, `,`]>>([[``, `'stringy string'`, `'stringy string'`]])
    expectToBe<ConsumeSelectColumn<[`SELECT`, `'stringy string'`, `FROM`]>>([[``, `'stringy string'`, `'stringy string'`]])
    expectToBe<ConsumeSelectColumn<[`,`, `'stringy string'`, `FROM`]>>([[``, `'stringy string'`, `'stringy string'`]])
    // parses a string with an explicit alias
    expectToBe<ConsumeSelectColumn<[`SELECT`, `'stringy string'`, `AS`, `text`, `,`]>>([[``, `'stringy string'`, `text`]])
    expectToBe<ConsumeSelectColumn<[`,`, `'stringy string'`, `AS`, `text`, `,`]>>([[``, `'stringy string'`, `text`]])
    expectToBe<ConsumeSelectColumn<[`SELECT`, `'stringy string'`, `AS`, `text`, `FROM`]>>([[``, `'stringy string'`, `text`]])
    expectToBe<ConsumeSelectColumn<[`,`, `'stringy string'`, `AS`, `text`, `FROM`]>>([[``, `'stringy string'`, `text`]])
    // parses a string with an implicit alias
    expectToBe<ConsumeSelectColumn<[`SELECT`, `'stringy string'`, `text`, `,`]>>([[``, `'stringy string'`, `text`]])
    expectToBe<ConsumeSelectColumn<[`,`, `'stringy string'`, `text`, `,`]>>([[``, `'stringy string'`, `text`]])
    expectToBe<ConsumeSelectColumn<[`SELECT`, `'stringy string'`, `text`, `FROM`]>>([[``, `'stringy string'`, `text`]])
    expectToBe<ConsumeSelectColumn<[`,`, `'stringy string'`, `text`, `FROM`]>>([[``, `'stringy string'`, `text`]])
    
    // Returns empty if bad format
    expectToBe<ConsumeSelectColumn<[`id`, `,`]>>([])
    expectToBe<ConsumeSelectColumn<[`SELECT`, `id`]>>([])
    expectToBe<ConsumeSelectColumn<[`,`, `id`]>>([])
    expectToBe<ConsumeSelectColumn<[`SELECT`, `u.id`, `AS`, `userId`, `extraneous`, `tokens`, `,`]>>([])
    // terminates correctly
    expectToBe<ConsumeSelectColumn<[`FROM`, `users`, `u`]>>([])

}

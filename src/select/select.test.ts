import { expectToBe, expectNever } from '../test'
import { ConsumeSelectColumns } from './select'

// prettier-ignore
const test = () => {
    // parses with a table identifier
    expectToBe<ConsumeSelectColumns<[`SELECT`, `u.id`, `,`]>>([[[`u`, `id`, `id`]], [`SELECT`, `u.id`]])
    expectToBe<ConsumeSelectColumns<[`,`, `u.id`, `,`]>>([[[`u`, `id`, `id`]], [`,`, `u.id`]])
    expectToBe<ConsumeSelectColumns<[`SELECT`, `u.id`, `FROM`]>>([[[`u`, `id`, `id`]], [`SELECT`, `u.id`]])
    expectToBe<ConsumeSelectColumns<[`,`, `u.id`, `FROM`]>>([[[`u`, `id`, `id`]], [`,`, `u.id`]])
    // parses with a table identifier & an explicit alias
    expectToBe<ConsumeSelectColumns<[`SELECT`, `u.id`, `AS`, `userId`, `,`]>>([[[`u`, `id`, `userId`]], [`SELECT`, `u.id`, `AS`, `userId`]])
    expectToBe<ConsumeSelectColumns<[`,`, `u.id`, `AS`, `userId`, `,`]>>([[[`u`, `id`, `userId`]], [`,`, `u.id`, `AS`, `userId`]])
    expectToBe<ConsumeSelectColumns<[`SELECT`, `u.id`, `AS`, `userId`, `FROM`]>>([[[`u`, `id`, `userId`]], [`SELECT`, `u.id`, `AS`, `userId`]])
    expectToBe<ConsumeSelectColumns<[`,`, `u.id`, `AS`, `userId`, `FROM`]>>([[[`u`, `id`, `userId`]], [`,`, `u.id`, `AS`, `userId`]])
    // parses with a table identifier & an implicit alias
    expectToBe<ConsumeSelectColumns<[`SELECT`, `u.id`, `userId`, `,`]>>([[[`u`, `id`, `userId`]], [`SELECT`, `u.id`, `userId`]])
    expectToBe<ConsumeSelectColumns<[`,`, `u.id`, `userId`, `,`]>>([[[`u`, `id`, `userId`]], [`,`, `u.id`, `userId`]])
    expectToBe<ConsumeSelectColumns<[`SELECT`, `u.id`, `userId`, `FROM`]>>([[[`u`, `id`, `userId`]], [`SELECT`, `u.id`, `userId`]])
    expectToBe<ConsumeSelectColumns<[`,`, `u.id`, `userId`, `FROM`]>>([[[`u`, `id`, `userId`]], [`,`, `u.id`, `userId`]])

    // parses naive case
    expectToBe<ConsumeSelectColumns<[`SELECT`, `id`, `,`]>>([[[``, `id`, `id`]], [`SELECT`, `id`]])
    expectToBe<ConsumeSelectColumns<[`,`, `id`, `,`]>>([[[``, `id`, `id`]], [`,`, `id`]])
    expectToBe<ConsumeSelectColumns<[`SELECT`, `id`, `FROM`]>>([[[``, `id`, `id`]], [`SELECT`, `id`]])
    expectToBe<ConsumeSelectColumns<[`,`, `id`, `FROM`]>>([[[``, `id`, `id`]], [`,`, `id`]])
    // parses with an explicit alias
    expectToBe<ConsumeSelectColumns<[`SELECT`, `id`, `AS`, `userId`, `,`]>>([[[``, `id`, `userId`]], [`SELECT`, `id`, `AS`, `userId`]])
    expectToBe<ConsumeSelectColumns<[`,`, `id`, `AS`, `userId`, `,`]>>([[[``, `id`, `userId`]], [`,`, `id`, `AS`, `userId`]])
    expectToBe<ConsumeSelectColumns<[`SELECT`, `id`, `AS`, `userId`, `FROM`]>>([[[``, `id`, `userId`]], [`SELECT`, `id`, `AS`, `userId`]])
    expectToBe<ConsumeSelectColumns<[`,`, `id`, `AS`, `userId`, `FROM`]>>([[[``, `id`, `userId`]], [`,`, `id`, `AS`, `userId`]])
    // parses with an implicit alias
    expectToBe<ConsumeSelectColumns<[`SELECT`, `id`, `userId`, `,`]>>([[[``, `id`, `userId`]], [`SELECT`, `id`, `userId`]])
    expectToBe<ConsumeSelectColumns<[`,`, `id`, `userId`, `,`]>>([[[``, `id`, `userId`]], [`,`, `id`, `userId`]])
    expectToBe<ConsumeSelectColumns<[`SELECT`, `id`, `userId`, `FROM`]>>([[[``, `id`, `userId`]], [`SELECT`, `id`, `userId`]])
    expectToBe<ConsumeSelectColumns<[`,`, `id`, `userId`, `FROM`]>>([[[``, `id`, `userId`]], [`,`, `id`, `userId`]])

    // parses a string
    expectToBe<ConsumeSelectColumns<[`SELECT`, `'stringy string'`, `,`]>>([[[``, `'stringy string'`, `'stringy string'`]], [`SELECT`, `'stringy string'`]])
    expectToBe<ConsumeSelectColumns<[`,`, `'stringy string'`, `,`]>>([[[``, `'stringy string'`, `'stringy string'`]], [`,`, `'stringy string'`]])
    expectToBe<ConsumeSelectColumns<[`SELECT`, `'stringy string'`, `FROM`]>>([[[``, `'stringy string'`, `'stringy string'`]], [`SELECT`, `'stringy string'`]])
    expectToBe<ConsumeSelectColumns<[`,`, `'stringy string'`, `FROM`]>>([[[``, `'stringy string'`, `'stringy string'`]], [`,`, `'stringy string'`]])
    // parses a string with an explicit alias
    expectToBe<ConsumeSelectColumns<[`SELECT`, `'stringy string'`, `AS`, `text`, `,`]>>([[[``, `'stringy string'`, `text`]], [`SELECT`, `'stringy string'`, `AS`, `text`]])
    expectToBe<ConsumeSelectColumns<[`,`, `'stringy string'`, `AS`, `text`, `,`]>>([[[``, `'stringy string'`, `text`]], [`,`, `'stringy string'`, `AS`, `text`]])
    expectToBe<ConsumeSelectColumns<[`SELECT`, `'stringy string'`, `AS`, `text`, `FROM`]>>([[[``, `'stringy string'`, `text`]], [`SELECT`, `'stringy string'`, `AS`, `text`]])
    expectToBe<ConsumeSelectColumns<[`,`, `'stringy string'`, `AS`, `text`, `FROM`]>>([[[``, `'stringy string'`, `text`]], [`,`, `'stringy string'`, `AS`, `text`]])
    // parses a string with an implicit alias
    expectToBe<ConsumeSelectColumns<[`SELECT`, `'stringy string'`, `text`, `,`]>>([[[``, `'stringy string'`, `text`]], [`SELECT`, `'stringy string'`, `text`]])
    expectToBe<ConsumeSelectColumns<[`,`, `'stringy string'`, `text`, `,`]>>([[[``, `'stringy string'`, `text`]], [`,`, `'stringy string'`, `text`]])
    expectToBe<ConsumeSelectColumns<[`SELECT`, `'stringy string'`, `text`, `FROM`]>>([[[``, `'stringy string'`, `text`]], [`SELECT`, `'stringy string'`, `text`]])
    expectToBe<ConsumeSelectColumns<[`,`, `'stringy string'`, `text`, `FROM`]>>([[[``, `'stringy string'`, `text`]], [`,`, `'stringy string'`, `text`]])

    // parses a number
    expectToBe<ConsumeSelectColumns<[`SELECT`, `123`, `,`]>>([[[``, `123`, `123`]], [`SELECT`, `123`]])
    expectToBe<ConsumeSelectColumns<[`,`, `123`, `,`]>>([[[``, `123`, `123`]], [`,`, `123`]])
    expectToBe<ConsumeSelectColumns<[`SELECT`, `123`, `FROM`]>>([[[``, `123`, `123`]], [`SELECT`, `123`]])
    expectToBe<ConsumeSelectColumns<[`,`, `123`, `FROM`]>>([[[``, `123`, `123`]], [`,`, `123`]])
    // parses a number with an explicit alias
    expectToBe<ConsumeSelectColumns<[`SELECT`, `123`, `AS`, `text`, `,`]>>([[[``, `123`, `text`]], [`SELECT`, `123`, `AS`, `text`]])
    expectToBe<ConsumeSelectColumns<[`,`, `123`, `AS`, `text`, `,`]>>([[[``, `123`, `text`]], [`,`, `123`, `AS`, `text`]])
    expectToBe<ConsumeSelectColumns<[`SELECT`, `123`, `AS`, `text`, `FROM`]>>([[[``, `123`, `text`]], [`SELECT`, `123`, `AS`, `text`]])
    expectToBe<ConsumeSelectColumns<[`,`, `123`, `AS`, `text`, `FROM`]>>([[[``, `123`, `text`]], [`,`, `123`, `AS`, `text`]])
    // parses a number with an implicit alias
    expectToBe<ConsumeSelectColumns<[`SELECT`, `123`, `text`, `,`]>>([[[``, `123`, `text`]], [`SELECT`, `123`, `text`]])
    expectToBe<ConsumeSelectColumns<[`,`, `123`, `text`, `,`]>>([[[``, `123`, `text`]], [`,`, `123`, `text`]])
    expectToBe<ConsumeSelectColumns<[`SELECT`, `123`, `text`, `FROM`]>>([[[``, `123`, `text`]], [`SELECT`, `123`, `text`]])
    expectToBe<ConsumeSelectColumns<[`,`, `123`, `text`, `FROM`]>>([[[``, `123`, `text`]], [`,`, `123`, `text`]])

    // Returns empty if bad format
    expectToBe<ConsumeSelectColumns<[`id`, `,`]>>([[], []])
    expectToBe<ConsumeSelectColumns<[`SELECT`, `id`]>>([[], []])
    expectToBe<ConsumeSelectColumns<[`,`, `id`]>>([[], []])
    expectToBe<ConsumeSelectColumns<[`SELECT`, `u.id`, `AS`, `userId`, `extraneous`, `tokens`, `,`]>>([[], []])
    // terminates correctly
    expectToBe<ConsumeSelectColumns<[`FROM`, `users`, `u`]>>([[], []])

    // doesn't hit recursion limit
    type VERY_LONG_COLUMNS_TYPE = [`SELECT`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `FROM`, `users`, `u`]
    expectToBe<ConsumeSelectColumns<VERY_LONG_COLUMNS_TYPE>>([
        [["u", "id", "id"], ["u", "name", "name"], ["p", "title", "title"], ["p", "body", "body"], ["u", "id", "id"], ["u", "name", "name"], ["p", "title", "title"], ["p", "body", "body"], ["u", "id", "id"], ["u", "name", "name"], ["p", "title", "title"], ["p", "body", "body"], ["u", "id", "id"], ["u", "name", "name"], ["p", "title", "title"], ["p", "body", "body"], ["u", "id", "id"], ["u", "name", "name"], ["p", "title", "title"], ["p", "body", "body"], ["u", "id", "id"], ["u", "name", "name"], ["p", "title", "title"], ["p", "body", "body"], ["u", "id", "id"], ["u", "name", "name"], ["p", "title", "title"], ["p", "body", "body"], ["u", "id", "id"], ["u", "name", "name"], ["p", "title", "title"], ["p", "body", "body"], ["u", "id", "id"], ["u", "name", "name"], ["p", "title", "title"], ["p", "body", "body"], ["u", "id", "id"], ["u", "name", "name"], ["p", "title", "title"], ["p", "body", "body"], ["u", "id", "id"], ["u", "name", "name"], ["p", "title", "title"], ["p", "body", "body"], ["u", "id", "id"], ["u", "name", "name"], ["p", "title", "title"], ["p", "body", "body"], ["u", "id", "id"], ["u", "name", "name"], ["p", "title", "title"], ["p", "body", "body"], ["u", "id", "id"], ["u", "name", "name"], ["p", "title", "title"], ["p", "body", "body"], ["u", "id", "id"], ["u", "name", "name"], ["p", "title", "title"], ["p", "body", "body"], ["u", "id", "id"], ["u", "name", "name"], ["p", "title", "title"], ["p", "body", "body"], ["u", "id", "id"], ["u", "name", "name"], ["p", "title", "title"], ["p", "body", "body"], ["u", "id", "id"], ["u", "name", "name"], ["p", "title", "title"], ["p", "body", "body"], ["u", "id", "id"], ["u", "name", "name"], ["p", "title", "title"], ["p", "body", "body"], ["u", "id", "id"], ["u", "name", "name"], ["p", "title", "title"], ["p", "body", "body"], ["u", "id", "id"], ["u", "name", "name"], ["p", "title", "title"], ["p", "body", "body"], ["u", "id", "id"], ["u", "name", "name"], ["p", "title", "title"], ["p", "body", "body"], ["u", "id", "id"], ["u", "name", "name"], ["p", "title", "title"], ["p", "body", "body"], ["u", "id", "id"], ["u", "name", "name"], ["p", "title", "title"], ["p", "body", "body"], ["u", "id", "id"], ["u", "name", "name"], ["p", "title", "title"], ["p", "body", "body"], ["u", "id", "id"], ["u", "name", "name"], ["p", "title", "title"], ["p", "body", "body"], ["u", "id", "id"], ["u", "name", "name"], ["p", "title", "title"], ["p", "body", "body"], ["u", "id", "id"], ["u", "name", "name"], ["p", "title", "title"], ["p", "body", "body"], ["u", "id", "id"], ["u", "name", "name"], ["p", "title", "title"], ["p", "body", "body"], ["u", "id", "id"], ["u", "name", "name"], ["p", "title", "title"], ["p", "body", "body"], ["u", "id", "id"], ["u", "name", "name"], ["p", "title", "title"], ["p", "body", "body"], ["u", "id", "id"], ["u", "name", "name"], ["p", "title", "title"], ["p", "body", "body"]],
        [`SELECT`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`, `,`, `u.id`, `,`, `u.name`, `,`, `p.title`, `,`, `p.body`]
    ])

}

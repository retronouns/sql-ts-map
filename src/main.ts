import { Select } from './select/'

const SQL = `
SELECT 
    t.id as threadId,
    t.title,
    p.id as postId,
    p.body as postBody,
    u.id as userId,
    u.name username,
    u.non_existent
FROM threads t
JOIN posts p ON p.thread_id = t.id
LEFT JOIN users u ON u.id = p.user_id
WHERE u.id = 1`

type SelectTest = Select<typeof SQL>

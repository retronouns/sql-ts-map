import { Select } from './select/'

const SQL = `
SELECT 
    u.id,
    u.name,
    p.title,
    p.body
FROM users u
JOIN posts p ON p.user_id = u.id
WHERE u.id = 1`

type SelectTest = Select<typeof SQL>

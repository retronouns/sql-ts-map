import { Select } from './select'

const SQL = `
select 
    u.id,
    u.name,
    p.title,
    p.body
from users u
join posts p on p.user_id = u.id
where u.id = 1`

type SelectTest = Select<typeof SQL>

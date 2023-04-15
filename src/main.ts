import { Select } from './select'

type SelectTest = Select<`
    select 
        u.id,
        u.name,
        p.title,
        p.body
    from users u
    join posts p on p.user_id = u.id
    where u.id = 1`>

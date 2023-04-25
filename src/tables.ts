export type DbTables = {
    users: {
        id: number
        date_created: Date
        name: string
    }
    posts: {
        id: number
        user_id: number
        thread_id: number
        date_created: Date
        body: string | null
    }
    threads: {
        id: number
        user_id: number
        date_created: Date
        title: string | null
    }
}

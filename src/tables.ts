export type Tables = {
    users: {
        id: number
        name: string
    }
    posts: {
        id: number
        user_id: number
        title: string | null
        body: string | null
    }
}

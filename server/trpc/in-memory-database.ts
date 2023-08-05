class IdGenerator {
  private postId = 0
  private messageId = 0

  nextPostId() {
    return ++this.postId
  }

  nextMessageId() {
    return ++this.messageId
  }
}

export const idGenerator = new IdGenerator()
type Post = {
  id: number
  title: string
}
type InMemoryDatabase = {
  posts: Post[]
  messages: Message[]
}
export const inMemoryDatabase: InMemoryDatabase = {
  posts: [
    {
      id: idGenerator.nextPostId(),
      title: 'hello',
    },
  ],
  messages: [],
}
export type Message = {
  id: number
  text: string
  createdAt: number
  updatedAt: number
}

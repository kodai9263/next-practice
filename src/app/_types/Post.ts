export interface Post {
  id: number
  title: string
  content: string
  createdAt: string
  postCategories: {
    category: {
      id: number
      name: string
    }
  }[]
  thumbnailImageKey: string
}
export interface MicroCmsPost {
  id: string
  title: string
  content: string
  createdAt: string
  categories: { id: string; name: string }[]
  thumbnail: { url: string; height: number; width: number }
}

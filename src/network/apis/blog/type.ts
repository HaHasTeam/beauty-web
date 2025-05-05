import { IServerCreateBlog } from '@/types/blog'
import { BlogEnum } from '@/types/enum'
import { BaseParams } from '@/types/request'

export type UpdateBlogParams = { id: string; data: IServerCreateBlog }

export type TGetFilteredBlogRequestParams = BaseParams<{
  statuses?: BlogEnum[] | undefined | BlogEnum
  types?: string
  title: string
}>

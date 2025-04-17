import { IBlogDetails, IServerCreateBlog } from '@/types/blog'
import { TServerResponse } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest, publicRequest } from '@/utils/request'

import { TGetFilteredReportRequestParams } from '../report/type'
import { UpdateBlogParams } from './type'

export const getAllBlogApi = toQueryFetcher<void, TServerResponse<IBlogDetails[]>>('getAllBlogApi', async () => {
  return publicRequest('/blogs')
})
export const getBlogApi = toQueryFetcher<string, TServerResponse<IBlogDetails>>('getBlogApi', async (productId) => {
  return privateRequest(`/blogs/get-by-id/${productId}`)
})
export const getBlogByTagApi = toQueryFetcher<string, TServerResponse<IBlogDetails>>(
  'getBlogByTagApi',
  async (productId) => {
    return publicRequest(`/blogs/tag/${productId}`)
  },
)

export const createBlogApi = toMutationFetcher<IServerCreateBlog, TServerResponse<IServerCreateBlog>>(
  'createBlogApi',
  async (data) => {
    return privateRequest('/blogs', {
      method: 'POST',
      data,
    })
  },
)
export const getFilteredBlogs = toQueryFetcher<TGetFilteredReportRequestParams, TServerResponse<IBlogDetails[]>>(
  'getFilteredBlogs',
  async (query) => {
    return publicRequest('/blogs/filter-blogs', {
      method: 'POST',
      data: query,
    })
  },
)

export const updateBlogApi = toMutationFetcher<UpdateBlogParams, TServerResponse<IServerCreateBlog>>(
  'updateBlogApi',
  async ({ id, data }: UpdateBlogParams) => {
    return privateRequest(`/blogs/${id}`, {
      method: 'PUT',
      data,
    })
  },
)

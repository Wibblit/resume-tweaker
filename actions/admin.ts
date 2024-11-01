'use server'

import { prisma } from "@/prisma"

type PaginationParams = {
  page: number
  pageSize: number
}

export async function getUsers({ page, pageSize }: PaginationParams) {
  const users = await prisma.user.findMany({
    take: pageSize,
    skip: (page - 1) * pageSize,
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, email: true, createdAt: true }
  })
  return users
}

export async function getBlogs({ page, pageSize }: PaginationParams) {
  const blogs = await prisma.blog.findMany({
    take: pageSize,
    skip: (page - 1) * pageSize,
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, author: true, category: true, published: true }
  })
  return blogs
}

export async function getWaitlistMembers({ page, pageSize }: PaginationParams) {
  const waitlistMembers = await prisma.waitlist.findMany({
    take: pageSize,
    skip: (page - 1) * pageSize,
    orderBy: { joinedAt: 'desc' },
    select: { id: true, email: true, joinedAt: true }
  })
  return waitlistMembers
}
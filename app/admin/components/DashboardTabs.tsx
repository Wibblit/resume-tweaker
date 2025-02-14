'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { getUsers, getBlogs} from '@/actions/admin'

type User = {
  id: string
  name: string | null
  email: string
  createdAt: Date
}

type Blog = {
  id: string
  title: string
  author: string
  category: string
  published: boolean
}

type WaitlistMember = {
  id: string
  email: string
  joinedAt: Date
}

type DashboardTabsProps = {
  initialUsers: User[]
  initialBlogs: Blog[]
  totalUsers: number
  totalBlogs: number
}

export function DashboardTabs({
  initialUsers,
  initialBlogs,
  totalUsers,
  totalBlogs,
}: DashboardTabsProps) {
  const [users, setUsers] = useState(initialUsers)
  const [blogs, setBlogs] = useState(initialBlogs)
  const [currentPage, setCurrentPage] = useState({ users: 1, blogs: 1, waitlist: 1 })
  const [isLoading, setIsLoading] = useState({ users: false, blogs: false, waitlist: false })
  const pageSize = 5

  const loadMore = async (type: 'users' | 'blogs' | 'waitlist') => {
    setIsLoading({ ...isLoading, [type]: true })
    const nextPage = currentPage[type] + 1
    let newData

    switch (type) {
      case 'users':
        newData = await getUsers({ page: nextPage, pageSize })
        setUsers([...users, ...newData])
        break
      case 'blogs':
        newData = await getBlogs({ page: nextPage, pageSize })
        setBlogs([...blogs, ...newData])
        break
    }

    setCurrentPage({ ...currentPage, [type]: nextPage })
    setIsLoading({ ...isLoading, [type]: false })
  }

  const seeAll = async (type: 'users' | 'blogs' | 'waitlist') => {
    setIsLoading({ ...isLoading, [type]: true })
    let allData

    switch (type) {
      case 'users':
        allData = await getUsers({ page: 1, pageSize: totalUsers })
        setUsers(allData)
        break
      case 'blogs':
        allData = await getBlogs({ page: 1, pageSize: totalBlogs })
        setBlogs(allData)
        break
    }

    setIsLoading({ ...isLoading, [type]: false })
  }

  return (
    <Tabs defaultValue="users" className="space-y-4">
      <TabsList>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="blogs">Blogs</TabsTrigger>
        <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
      </TabsList>
      <TabsContent value="users">
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name || 'N/A'}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-between">
              <Button onClick={() => loadMore('users')} disabled={isLoading.users || users.length >= totalUsers}>
                {isLoading.users ? 'Loading...' : 'Load More'}
              </Button>
              <Button onClick={() => seeAll('users')} disabled={isLoading.users || users.length >= totalUsers}>
                See All
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="blogs">
        <Card>
          <CardHeader>
            <CardTitle>Blog Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Published</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell>{blog.title}</TableCell>
                    <TableCell>{blog.author}</TableCell>
                    <TableCell>{blog.category}</TableCell>
                    <TableCell>{blog.published ? 'Yes' : 'No'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-between">
              <Button onClick={() => loadMore('blogs')} disabled={isLoading.blogs || blogs.length >= totalBlogs}>
                {isLoading.blogs ? 'Loading...' : 'Load More'}
              </Button>
              <Button onClick={() => seeAll('blogs')} disabled={isLoading.blogs || blogs.length >= totalBlogs}>
                See All
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

    </Tabs>
  )
}
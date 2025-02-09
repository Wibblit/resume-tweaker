import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardTabs } from "./components/DashboardTabs"
import { getUsers, getBlogs } from "@/actions/admin"

async function getDashboardData() {
  const [
    userCount,
    resumeCount,
    coverLetterCount,
    blogCount,
    recentUsers,
    recentBlogs,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.resume.count(),
    prisma.coverletter.count(),
    prisma.blog.count(),
    getUsers({ page: 1, pageSize: 5 }),
    getBlogs({ page: 1, pageSize: 5 }),
  ])

  return {
    userCount,
    resumeCount,
    coverLetterCount,
    blogCount,
    recentUsers,
    recentBlogs,
  }
}

export default async function AdminDashboard() {
  const session = await auth()
  if (session?.user?.email !== process.env.ADMIN_EMAIL) {
    redirect("/")
  }

  const dashboardData = await getDashboardData()

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{dashboardData.userCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Resumes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{dashboardData.resumeCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Cover Letters</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{dashboardData.coverLetterCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Blog Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{dashboardData.blogCount}</p>
          </CardContent>
        </Card>

      </div>

      <DashboardTabs 
        initialUsers={dashboardData.recentUsers}
        initialBlogs={dashboardData.recentBlogs}
        totalUsers={dashboardData.userCount}
        totalBlogs={dashboardData.blogCount}
      />
    </div>
  )
}

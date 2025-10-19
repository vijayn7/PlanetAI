import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, TrendingUp, Clock, CheckCircle2, CalendarIcon } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex h-screen">
      <AppSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader />

        <main className="flex-1 overflow-y-auto bg-background p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-balance">Welcome back!</h1>
                <p className="text-muted-foreground mt-1">Here's what's happening today</p>
              </div>
              <Button className="rounded-xl gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                <Plus className="h-4 w-4" />
                Quick Add
              </Button>
            </div>

            {/* Widgets Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Today's Overview */}
              <Card className="p-6 rounded-[20px] shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Today's Overview</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tasks completed</span>
                    <span className="font-semibold">8 / 12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Events today</span>
                    <span className="font-semibold">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Hours focused</span>
                    <span className="font-semibold">4.5h</span>
                  </div>
                </div>
              </Card>

              {/* Productivity Score */}
              <Card className="p-6 rounded-[20px] shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Productivity Score</h3>
                </div>
                <div className="flex items-center justify-center py-4">
                  <div className="relative h-32 w-32">
                    <svg className="h-full w-full -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-muted"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.78)}`}
                        className="text-primary transition-all duration-500"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold">78%</span>
                    </div>
                  </div>
                </div>
                <p className="text-center text-sm text-muted-foreground">Great work this week!</p>
              </Card>

              {/* Upcoming Deadlines */}
              <Card className="p-6 rounded-[20px] shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Upcoming Deadlines</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">Project proposal</p>
                      <p className="text-xs text-muted-foreground">Tomorrow, 5:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">Team meeting prep</p>
                      <p className="text-xs text-muted-foreground">Friday, 2:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">Monthly report</p>
                      <p className="text-xs text-muted-foreground">Next Monday</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6 rounded-[20px] shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] md:col-span-2 lg:col-span-3">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Button variant="outline" className="rounded-xl justify-start gap-3 h-auto py-4 bg-transparent">
                    <Plus className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">Add Task</p>
                      <p className="text-xs text-muted-foreground">Create a new to-do</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="rounded-xl justify-start gap-3 h-auto py-4 bg-transparent">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">Add Event</p>
                      <p className="text-xs text-muted-foreground">Schedule something</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="rounded-xl justify-start gap-3 h-auto py-4 bg-transparent">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">View Analytics</p>
                      <p className="text-xs text-muted-foreground">Check your stats</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="rounded-xl justify-start gap-3 h-auto py-4 bg-transparent">
                    <Clock className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">Start Timer</p>
                      <p className="text-xs text-muted-foreground">Focus mode</p>
                    </div>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Floating Action Button */}
      <Button
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl shadow-primary/40 hover:shadow-primary/60 hover:scale-110 transition-all"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  )
}

"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

type CalendarEvent = {
  id: string
  title: string
  date: Date
  time: string
  color: string
}

const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Team Meeting",
    date: new Date(2025, 0, 15),
    time: "10:00 AM",
    color: "bg-primary",
  },
  {
    id: "2",
    title: "Project Review",
    date: new Date(2025, 0, 15),
    time: "2:00 PM",
    color: "bg-primary",
  },
  {
    id: "3",
    title: "Client Call",
    date: new Date(2025, 0, 18),
    time: "11:00 AM",
    color: "bg-primary",
  },
  {
    id: "4",
    title: "Workshop",
    date: new Date(2025, 0, 22),
    time: "3:00 PM",
    color: "bg-primary",
  },
]

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"month" | "week" | "day">("month")
  const [events] = useState<CalendarEvent[]>(mockEvents)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const getEventsForDate = (date: number) => {
    return events.filter((event) => {
      return event.date.getDate() === date && event.date.getMonth() === month && event.date.getFullYear() === year
    })
  }

  const isToday = (date: number) => {
    const today = new Date()
    return date === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  }

  const renderMonthView = () => {
    const days = []
    const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7

    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - firstDayOfMonth + 1
      const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth
      const dayEvents = isCurrentMonth ? getEventsForDate(dayNumber) : []

      days.push(
        <div
          key={i}
          className={cn(
            "min-h-24 border border-border p-2 transition-all hover:bg-accent/50",
            !isCurrentMonth && "bg-muted/30 text-muted-foreground",
            isCurrentMonth && "bg-card cursor-pointer",
          )}
        >
          {isCurrentMonth && (
            <>
              <div
                className={cn(
                  "text-sm font-medium mb-1",
                  isToday(dayNumber) &&
                    "inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground",
                )}
              >
                {dayNumber}
              </div>
              <div className="space-y-1">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "text-xs px-2 py-1 rounded-lg text-white truncate",
                      event.color,
                      "hover:shadow-md transition-all",
                    )}
                    title={`${event.title} - ${event.time}`}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>,
      )
    }

    return days
  }

  return (
    <div className="flex h-screen">
      <AppSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader />

        <main className="flex-1 overflow-y-auto bg-background">
          <div className="flex h-full">
            {/* Mini Calendar Sidebar */}
            <div className="w-80 border-r bg-muted/30 p-4 space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Mini Calendar</h3>
                <Card className="p-3 rounded-xl">
                  <div className="text-center mb-2">
                    <p className="text-sm font-medium">
                      {months[month]} {year}
                    </p>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-xs">
                    {daysOfWeek.map((day) => (
                      <div key={day} className="text-center font-medium text-muted-foreground py-1">
                        {day[0]}
                      </div>
                    ))}
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1
                      const hasEvents = getEventsForDate(day).length > 0
                      return (
                        <button
                          key={day}
                          className={cn(
                            "aspect-square flex items-center justify-center rounded-lg hover:bg-accent transition-colors",
                            isToday(day) && "bg-primary text-primary-foreground font-semibold",
                            hasEvents &&
                              !isToday(day) &&
                              "font-medium relative after:absolute after:bottom-1 after:h-1 after:w-1 after:rounded-full after:bg-primary",
                          )}
                        >
                          {day}
                        </button>
                      )
                    })}
                  </div>
                </Card>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Upcoming Events</h3>
                  <Badge variant="secondary">{events.length}</Badge>
                </div>
                <div className="space-y-2">
                  {events.slice(0, 5).map((event) => (
                    <Card key={event.id} className="p-3 rounded-xl hover:shadow-md transition-all">
                      <div className="flex items-start gap-2">
                        <div className={cn("h-2 w-2 rounded-full mt-1.5", event.color)} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{event.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {event.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} at {event.time}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <Card className="p-4 rounded-xl bg-accent/50 border-primary/20">
                <div className="flex items-center gap-2 text-sm">
                  <RefreshCw className="h-4 w-4 text-primary" />
                  <span className="font-medium">Sync with Google</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Last synced: 2 hours ago</p>
                <Button variant="outline" size="sm" className="w-full mt-3 rounded-lg bg-transparent">
                  Sync Now
                </Button>
              </Card>
            </div>

            {/* Main Calendar */}
            <div className="flex-1 p-6">
              <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold">
                      {months[month]} {year}
                    </h1>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={previousMonth}
                        className="rounded-lg h-8 w-8 bg-transparent"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={nextMonth}
                        className="rounded-lg h-8 w-8 bg-transparent"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
                      <Button
                        variant={view === "month" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setView("month")}
                        className="rounded-lg text-xs"
                      >
                        Month
                      </Button>
                      <Button
                        variant={view === "week" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setView("week")}
                        className="rounded-lg text-xs"
                      >
                        Week
                      </Button>
                      <Button
                        variant={view === "day" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setView("day")}
                        className="rounded-lg text-xs"
                      >
                        Day
                      </Button>
                    </div>
                    <Button className="rounded-xl gap-2 shadow-lg shadow-primary/20">
                      <Plus className="h-4 w-4" />
                      Add Event
                    </Button>
                  </div>
                </div>

                {/* Calendar Grid */}
                {view === "month" && (
                  <Card className="rounded-[20px] overflow-hidden">
                    <div className="grid grid-cols-7 border-b bg-muted/50">
                      {daysOfWeek.map((day) => (
                        <div key={day} className="p-3 text-center text-sm font-semibold border-r last:border-r-0">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7">{renderMonthView()}</div>
                  </Card>
                )}

                {view === "week" && (
                  <Card className="p-6 rounded-[20px]">
                    <p className="text-center text-muted-foreground">Week view coming soon</p>
                  </Card>
                )}

                {view === "day" && (
                  <Card className="p-6 rounded-[20px]">
                    <p className="text-center text-muted-foreground">Day view coming soon</p>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

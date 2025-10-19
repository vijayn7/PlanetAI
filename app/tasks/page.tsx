"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Plus, List, LayoutGrid, Search, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

type Task = {
  id: string
  title: string
  category: string
  priority: "high" | "medium" | "low"
  dueDate: string
  completed: boolean
  status: "todo" | "in-progress" | "done"
}

const categories = ["All", "Work", "School", "Personal"]

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Complete project proposal",
    category: "Work",
    priority: "high",
    dueDate: "Tomorrow",
    completed: false,
    status: "in-progress",
  },
  {
    id: "2",
    title: "Review pull requests",
    category: "Work",
    priority: "medium",
    dueDate: "Today",
    completed: false,
    status: "todo",
  },
  {
    id: "3",
    title: "Study for exam",
    category: "School",
    priority: "high",
    dueDate: "Friday",
    completed: false,
    status: "todo",
  },
  {
    id: "4",
    title: "Grocery shopping",
    category: "Personal",
    priority: "low",
    dueDate: "Weekend",
    completed: true,
    status: "done",
  },
  {
    id: "5",
    title: "Team meeting preparation",
    category: "Work",
    priority: "medium",
    dueDate: "Thursday",
    completed: false,
    status: "in-progress",
  },
  {
    id: "6",
    title: "Update resume",
    category: "Personal",
    priority: "medium",
    dueDate: "Next week",
    completed: false,
    status: "todo",
  },
]

export default function TasksPage() {
  const [view, setView] = useState<"list" | "kanban">("list")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [tasks, setTasks] = useState<Task[]>(mockTasks)

  const filteredTasks = selectedCategory === "All" ? tasks : tasks.filter((task) => task.category === selectedCategory)

  const toggleTaskComplete = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed, status: !task.completed ? "done" : "todo" } : task,
      ),
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-600 dark:text-red-400"
      case "medium":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
      case "low":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="flex h-screen">
      <AppSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader />

        <main className="flex-1 overflow-y-auto bg-background">
          <div className="flex h-full">
            {/* Categories Sidebar */}
            <div className="w-64 border-r bg-muted/30 p-4">
              <h3 className="font-semibold mb-4 px-2">Categories</h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-all",
                      selectedCategory === category ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-muted",
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
              <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-balance">Tasks</h1>
                    <p className="text-muted-foreground mt-1">
                      {filteredTasks.filter((t) => !t.completed).length} tasks remaining
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
                      <Button
                        variant={view === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setView("list")}
                        className="rounded-lg"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={view === "kanban" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setView("kanban")}
                        className="rounded-lg"
                      >
                        <LayoutGrid className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button className="rounded-xl gap-2 shadow-lg shadow-primary/20">
                      <Plus className="h-4 w-4" />
                      New Task
                    </Button>
                  </div>
                </div>

                {/* Search and Filter */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input type="search" placeholder="Search tasks..." className="pl-10 rounded-xl" />
                  </div>
                  <Button variant="outline" className="rounded-xl gap-2 bg-transparent">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </div>

                {/* Tasks View */}
                {view === "list" ? (
                  <div className="space-y-3">
                    {filteredTasks.map((task) => (
                      <Card
                        key={task.id}
                        className={cn(
                          "p-4 rounded-[20px] transition-all duration-200 hover:shadow-lg",
                          task.completed && "opacity-60",
                          !task.completed && "border-l-4 border-l-primary",
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => toggleTaskComplete(task.id)}
                            className="h-5 w-5"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className={cn("font-medium", task.completed && "line-through text-muted-foreground")}>
                              {task.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {task.category}
                              </Badge>
                              <Badge className={cn("text-xs", getPriorityColor(task.priority))}>{task.priority}</Badge>
                              <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-3">
                    {/* To Do Column */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">To Do</h3>
                        <Badge variant="secondary">{filteredTasks.filter((t) => t.status === "todo").length}</Badge>
                      </div>
                      {filteredTasks
                        .filter((t) => t.status === "todo")
                        .map((task) => (
                          <Card
                            key={task.id}
                            className="p-4 rounded-[20px] cursor-move hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary"
                          >
                            <h3 className="font-medium mb-2">{task.title}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {task.category}
                              </Badge>
                              <Badge className={cn("text-xs", getPriorityColor(task.priority))}>{task.priority}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">{task.dueDate}</p>
                          </Card>
                        ))}
                    </div>

                    {/* In Progress Column */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">In Progress</h3>
                        <Badge variant="secondary">
                          {filteredTasks.filter((t) => t.status === "in-progress").length}
                        </Badge>
                      </div>
                      {filteredTasks
                        .filter((t) => t.status === "in-progress")
                        .map((task) => (
                          <Card
                            key={task.id}
                            className="p-4 rounded-[20px] cursor-move hover:shadow-lg transition-all duration-200 border-l-4 border-l-yellow-500"
                          >
                            <h3 className="font-medium mb-2">{task.title}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {task.category}
                              </Badge>
                              <Badge className={cn("text-xs", getPriorityColor(task.priority))}>{task.priority}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">{task.dueDate}</p>
                          </Card>
                        ))}
                    </div>

                    {/* Done Column */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Done</h3>
                        <Badge variant="secondary">{filteredTasks.filter((t) => t.status === "done").length}</Badge>
                      </div>
                      {filteredTasks
                        .filter((t) => t.status === "done")
                        .map((task) => (
                          <Card
                            key={task.id}
                            className="p-4 rounded-[20px] cursor-move hover:shadow-lg transition-all duration-200 opacity-60"
                          >
                            <h3 className="font-medium mb-2 line-through text-muted-foreground">{task.title}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {task.category}
                              </Badge>
                              <Badge className={cn("text-xs", getPriorityColor(task.priority))}>{task.priority}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">{task.dueDate}</p>
                          </Card>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Play, Clock, CheckCircle2, XCircle, FileText, Table, Mail, Database } from "lucide-react"
import { cn } from "@/lib/utils"

type Workflow = {
  id: string
  name: string
  description: string
  icon: React.ElementType
  integrations: string[]
  active: boolean
  lastRun: string
  status: "success" | "failed" | "pending"
  runsToday: number
}

const mockWorkflows: Workflow[] = [
  {
    id: "1",
    name: "Resume Generator",
    description: "Automatically generate LaTeX resumes from Google Sheets data",
    icon: FileText,
    integrations: ["Google Sheets", "LaTeX", "Drive"],
    active: true,
    lastRun: "2 hours ago",
    status: "success",
    runsToday: 3,
  },
  {
    id: "2",
    name: "Task Sync",
    description: "Sync tasks between Notion and Google Calendar",
    icon: Table,
    integrations: ["Notion", "Google Calendar"],
    active: true,
    lastRun: "30 minutes ago",
    status: "success",
    runsToday: 12,
  },
  {
    id: "3",
    name: "Email Digest",
    description: "Send daily summary of completed tasks via email",
    icon: Mail,
    integrations: ["Gmail", "Database"],
    active: false,
    lastRun: "Yesterday",
    status: "pending",
    runsToday: 0,
  },
  {
    id: "4",
    name: "Data Backup",
    description: "Backup important files to cloud storage",
    icon: Database,
    integrations: ["Drive", "Dropbox"],
    active: true,
    lastRun: "5 hours ago",
    status: "success",
    runsToday: 1,
  },
]

type ActivityLog = {
  id: string
  workflowName: string
  timestamp: string
  status: "success" | "failed"
  message: string
}

const mockActivityLog: ActivityLog[] = [
  {
    id: "1",
    workflowName: "Task Sync",
    timestamp: "30 minutes ago",
    status: "success",
    message: "Synced 5 tasks successfully",
  },
  {
    id: "2",
    workflowName: "Resume Generator",
    timestamp: "2 hours ago",
    status: "success",
    message: "Generated 1 resume",
  },
  {
    id: "3",
    workflowName: "Data Backup",
    timestamp: "5 hours ago",
    status: "success",
    message: "Backed up 24 files",
  },
  {
    id: "4",
    workflowName: "Email Digest",
    timestamp: "Yesterday",
    status: "failed",
    message: "Authentication error",
  },
]

export default function AutomationsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(mockWorkflows)

  const toggleWorkflow = (id: string) => {
    setWorkflows(workflows.map((w) => (w.id === id ? { ...w, active: !w.active } : w)))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  return (
    <div className="flex h-screen">
      <AppSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader />

        <main className="flex-1 overflow-y-auto bg-background">
          <div className="flex h-full">
            {/* Main Content */}
            <div className="flex-1 p-6">
              <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-balance">Automations</h1>
                    <p className="text-muted-foreground mt-1">
                      {workflows.filter((w) => w.active).length} active workflows
                    </p>
                  </div>
                  <Button className="rounded-xl gap-2 shadow-lg shadow-primary/20">
                    <Plus className="h-4 w-4" />
                    New Workflow
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{workflows.reduce((acc, w) => acc + w.runsToday, 0)}</p>
                        <p className="text-sm text-muted-foreground">Runs Today</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{workflows.filter((w) => w.status === "success").length}</p>
                        <p className="text-sm text-muted-foreground">Successful</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                        <XCircle className="h-5 w-5 text-red-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{workflows.filter((w) => w.status === "failed").length}</p>
                        <p className="text-sm text-muted-foreground">Failed</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Active Workflows */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Active Workflows</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {workflows.map((workflow) => {
                      const Icon = workflow.icon
                      return (
                        <Card
                          key={workflow.id}
                          className={cn(
                            "p-6 rounded-[20px] transition-all duration-200 hover:shadow-lg",
                            workflow.active && "border-l-4 border-l-primary",
                          )}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3">
                              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Icon className="h-6 w-6 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold mb-1">{workflow.name}</h3>
                                <p className="text-sm text-muted-foreground">{workflow.description}</p>
                              </div>
                            </div>
                            <Switch checked={workflow.active} onCheckedChange={() => toggleWorkflow(workflow.id)} />
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {workflow.integrations.map((integration) => (
                              <Badge key={integration} variant="secondary" className="text-xs">
                                {integration}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                {getStatusIcon(workflow.status)}
                                <span className="text-muted-foreground">{workflow.lastRun}</span>
                              </div>
                              <div className="text-muted-foreground">{workflow.runsToday} runs today</div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-lg gap-2 bg-transparent"
                              disabled={!workflow.active}
                            >
                              <Play className="h-3 w-3" />
                              Run Now
                            </Button>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                </div>

                {/* Create New Workflow */}
                <Card className="p-8 rounded-[20px] border-dashed border-2 hover:border-primary/50 transition-all">
                  <div className="text-center">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Plus className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Create New Workflow</h3>
                    <p className="text-sm text-muted-foreground mb-4">Set up automated tasks and integrations</p>
                    <Button className="rounded-xl">Get Started</Button>
                  </div>
                </Card>
              </div>
            </div>

            {/* Activity Log Sidebar */}
            <div className="w-80 border-l bg-muted/30 p-4">
              <h3 className="font-semibold mb-4">Activity Log</h3>
              <div className="space-y-3">
                {mockActivityLog.map((log) => (
                  <Card key={log.id} className="p-3 rounded-xl">
                    <div className="flex items-start gap-2">
                      {getStatusIcon(log.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{log.workflowName}</p>
                        <p className="text-xs text-muted-foreground">{log.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{log.timestamp}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { User, Palette, Link2, Shield, Save, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

type SettingsSection = "profile" | "appearance" | "integrations" | "storage"

const integrations = [
  { name: "Google Calendar", connected: true, icon: "📅" },
  { name: "Google Drive", connected: true, icon: "📁" },
  { name: "n8n", connected: true, icon: "⚡" },
  { name: "Notion", connected: false, icon: "📝" },
  { name: "Slack", connected: false, icon: "💬" },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile")
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [autoSync, setAutoSync] = useState(true)
  const [saved, setSaved] = useState(false)

  const sections = [
    { id: "profile" as const, name: "Profile", icon: User },
    { id: "appearance" as const, name: "Appearance", icon: Palette },
    { id: "integrations" as const, name: "Integrations", icon: Link2 },
    { id: "storage" as const, name: "Storage & Permissions", icon: Shield },
  ]

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="flex h-screen">
      <AppSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader />

        <main className="flex-1 overflow-y-auto bg-background">
          <div className="flex h-full">
            {/* Settings Navigation */}
            <div className="w-64 border-r bg-muted/30 p-4">
              <h3 className="font-semibold mb-4 px-2">Settings</h3>
              <div className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                        activeSection === section.id
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "hover:bg-muted",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {section.name}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
              <div className="max-w-3xl mx-auto space-y-6">
                {/* Profile Section */}
                {activeSection === "profile" && (
                  <>
                    <div>
                      <h1 className="text-3xl font-bold text-balance">Profile</h1>
                      <p className="text-muted-foreground mt-1">Manage your account information</p>
                    </div>

                    <Card className="p-6 rounded-[20px]">
                      <div className="flex items-center gap-6 mb-6">
                        <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold">
                          U
                        </div>
                        <div>
                          <Button variant="outline" className="rounded-xl bg-transparent">
                            Change Avatar
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" defaultValue="User Name" className="rounded-xl" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" defaultValue="user@planet.app" className="rounded-xl" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Input
                            id="bio"
                            defaultValue="Productivity enthusiast"
                            className="rounded-xl"
                            placeholder="Tell us about yourself"
                          />
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6 rounded-[20px]">
                      <h3 className="font-semibold mb-4">Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-muted-foreground">Receive updates via email</p>
                          </div>
                          <Switch checked={notifications} onCheckedChange={setNotifications} />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Auto Sync</p>
                            <p className="text-sm text-muted-foreground">Automatically sync with integrations</p>
                          </div>
                          <Switch checked={autoSync} onCheckedChange={setAutoSync} />
                        </div>
                      </div>
                    </Card>
                  </>
                )}

                {/* Appearance Section */}
                {activeSection === "appearance" && (
                  <>
                    <div>
                      <h1 className="text-3xl font-bold text-balance">Appearance</h1>
                      <p className="text-muted-foreground mt-1">Customize how Planet looks</p>
                    </div>

                    <Card className="p-6 rounded-[20px]">
                      <h3 className="font-semibold mb-4">Theme</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Dark Mode</p>
                            <p className="text-sm text-muted-foreground">Use dark theme across the app</p>
                          </div>
                          <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6 rounded-[20px]">
                      <h3 className="font-semibold mb-4">Accent Color</h3>
                      <p className="text-sm text-muted-foreground mb-4">Choose your primary accent color</p>
                      <div className="grid grid-cols-6 gap-3">
                        {[
                          { name: "Green", color: "bg-[#34C759]" },
                          { name: "Blue", color: "bg-blue-500" },
                          { name: "Purple", color: "bg-purple-500" },
                          { name: "Pink", color: "bg-pink-500" },
                          { name: "Orange", color: "bg-orange-500" },
                          { name: "Red", color: "bg-red-500" },
                        ].map((color) => (
                          <button
                            key={color.name}
                            className={cn(
                              "h-12 rounded-xl transition-all hover:scale-110",
                              color.color,
                              color.name === "Green" && "ring-2 ring-offset-2 ring-primary",
                            )}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </Card>

                    <Card className="p-6 rounded-[20px]">
                      <h3 className="font-semibold mb-4">Display</h3>
                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <Label>Font Size</Label>
                          <div className="flex items-center gap-4">
                            <input type="range" min="12" max="18" defaultValue="14" className="flex-1" />
                            <span className="text-sm text-muted-foreground w-12">14px</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </>
                )}

                {/* Integrations Section */}
                {activeSection === "integrations" && (
                  <>
                    <div>
                      <h1 className="text-3xl font-bold text-balance">Integrations</h1>
                      <p className="text-muted-foreground mt-1">Connect your favorite tools</p>
                    </div>

                    <div className="space-y-3">
                      {integrations.map((integration) => (
                        <Card key={integration.name} className="p-6 rounded-[20px]">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
                                {integration.icon}
                              </div>
                              <div>
                                <p className="font-semibold">{integration.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  {integration.connected ? (
                                    <>
                                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                                      <span className="text-sm text-green-600 dark:text-green-400">Connected</span>
                                    </>
                                  ) : (
                                    <span className="text-sm text-muted-foreground">Not connected</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant={integration.connected ? "outline" : "default"}
                              className="rounded-xl bg-transparent"
                            >
                              {integration.connected ? "Disconnect" : "Connect"}
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </>
                )}

                {/* Storage & Permissions Section */}
                {activeSection === "storage" && (
                  <>
                    <div>
                      <h1 className="text-3xl font-bold text-balance">Storage & Permissions</h1>
                      <p className="text-muted-foreground mt-1">Manage your data and access</p>
                    </div>

                    <Card className="p-6 rounded-[20px]">
                      <h3 className="font-semibold mb-4">Storage Usage</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">2.4 GB of 15 GB used</span>
                            <span className="text-sm font-medium">16%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: "16%" }} />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 pt-4">
                          <div>
                            <p className="text-2xl font-bold">1.2 GB</p>
                            <p className="text-sm text-muted-foreground">Files</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold">0.8 GB</p>
                            <p className="text-sm text-muted-foreground">Tasks</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold">0.4 GB</p>
                            <p className="text-sm text-muted-foreground">Other</p>
                          </div>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6 rounded-[20px]">
                      <h3 className="font-semibold mb-4">Permissions</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Calendar Access</p>
                            <p className="text-sm text-muted-foreground">Allow Planet to access your calendar</p>
                          </div>
                          <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400">
                            Granted
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Drive Access</p>
                            <p className="text-sm text-muted-foreground">Allow Planet to access your files</p>
                          </div>
                          <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400">
                            Granted
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Notifications</p>
                            <p className="text-sm text-muted-foreground">Allow Planet to send notifications</p>
                          </div>
                          <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400">
                            Granted
                          </Badge>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6 rounded-[20px] border-destructive/50">
                      <h3 className="font-semibold mb-2 text-destructive">Danger Zone</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Irreversible actions that affect your account
                      </p>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full rounded-xl bg-transparent text-destructive">
                          Clear All Data
                        </Button>
                        <Button variant="outline" className="w-full rounded-xl bg-transparent text-destructive">
                          Delete Account
                        </Button>
                      </div>
                    </Card>
                  </>
                )}

                {/* Save Button */}
                <div className="flex items-center justify-end gap-3 pt-4">
                  {saved && (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm font-medium">Settings saved</span>
                    </div>
                  )}
                  <Button onClick={handleSave} className="rounded-xl gap-2 shadow-lg shadow-primary/20">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye, Plus } from "lucide-react"

const mockFiles = [
  { id: "1", name: "Resume_2025.pdf", type: "PDF", size: "245 KB", date: "2 days ago" },
  { id: "2", name: "Project_Proposal.pdf", type: "PDF", size: "1.2 MB", date: "1 week ago" },
  { id: "3", name: "Monthly_Report.pdf", type: "PDF", size: "890 KB", date: "2 weeks ago" },
  { id: "4", name: "Cover_Letter.pdf", type: "PDF", size: "156 KB", date: "3 weeks ago" },
]

export default function FilesPage() {
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
                <h1 className="text-3xl font-bold text-balance">Files</h1>
                <p className="text-muted-foreground mt-1">{mockFiles.length} files stored</p>
              </div>
              <Button className="rounded-xl gap-2 shadow-lg shadow-primary/20">
                <Plus className="h-4 w-4" />
                Upload File
              </Button>
            </div>

            {/* Files Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockFiles.map((file) => (
                <Card
                  key={file.id}
                  className="p-6 rounded-[20px] hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{file.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {file.type} • {file.size}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{file.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex-1 rounded-lg gap-2 bg-transparent">
                      <Eye className="h-3 w-3" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 rounded-lg gap-2 bg-transparent">
                      <Download className="h-3 w-3" />
                      Download
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

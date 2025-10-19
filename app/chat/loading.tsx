import { Sparkles } from "lucide-react"

export default function ChatLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Sparkles className="h-8 w-8 animate-pulse text-primary" />
        </div>
        <p className="text-sm text-muted-foreground">Loading chat...</p>
      </div>
    </div>
  )
}

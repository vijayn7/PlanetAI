import { Auth } from "@auth/core"
import { authOptions } from "@/auth"

export async function GET(request: Request) {
	return Auth(request, authOptions)
}

export async function POST(request: Request) {
	return Auth(request, authOptions)
}

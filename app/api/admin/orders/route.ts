import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get date parameter from query string
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");

    // Validate date parameter
    if (!dateParam) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 }
      );
    }

    const apiBaseUrl = process.env.API_BASE_URL;

    // Get orders from the Express API
    const response = await fetch(
      `${apiBaseUrl}/orders/admin?date=${dateParam}`,
      {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/authOptions";

// Fetch from Express API
export async function GET() {
  try {
    const apiBaseUrl = process.env.API_BASE_URL;
    const response = await fetch(`${apiBaseUrl}/sandwiches`);

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data.data);
  } catch (error) {
    console.error("Error fetching sandwiches:", error);
    return NextResponse.json(
      { error: "Failed to fetch sandwiches" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Get the user's session to retrieve the authentication token
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const apiBaseUrl = process.env.API_BASE_URL;

    // Prepare headers with authentication token if available
    const headers = {
      "Content-Type": "application/json",
    };

    // Add authorization header if user is logged in
    if (session?.user?.token) {
      headers.Authorization = `Bearer ${session.user.token}`;
    }

    const response = await fetch(`${apiBaseUrl}/sandwiches`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log("Error data:", errorData);
      throw new Error(errorData.message || "Failed to create sandwich");
    }

    const data = await response.json();
    return NextResponse.json(data.data, { status: 201 });
  } catch (error) {
    console.error("Error creating sandwich:", error);
    return NextResponse.json(
      { error: "Failed to create sandwich" },
      { status: 500 }
    );
  }
}

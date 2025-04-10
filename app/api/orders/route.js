import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/authOptions";

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

    const response = await fetch(`${apiBaseUrl}/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json(
          { error: "Unauthorized. Please log in first." },
          { status: 401 }
        );
      }
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create order");
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create order",
      },
      { status: 500 }
    );
  }
}

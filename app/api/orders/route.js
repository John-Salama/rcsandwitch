import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/authOptions";

export async function GET(request) {
  try {
    // Get the user's session to retrieve the authentication token
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required. Please log in to view orders." },
        { status: 401 }
      );
    }

    const apiBaseUrl = process.env.API_BASE_URL;
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    // Prepare headers with authentication token
    const headers = {
      "Content-Type": "application/json",
    };

    // Add authorization header with user token
    if (session.user.token) {
      headers.Authorization = `Bearer ${session.user.token}`;
    }

    // Build URL with optional date parameter
    let url = `${apiBaseUrl}/orders/user/${session.user.id}`;
    if (date) {
      url += `?date=${date}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json(
          { error: "Unauthorized. Please log in first." },
          { status: 401 }
        );
      }
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch orders");
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch orders",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Get the user's session to retrieve the authentication token
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required. Please log in to place an order." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const apiBaseUrl = process.env.API_BASE_URL;

    // Validate required fields before sending to the API
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "At least one sandwich is required in your order" },
        { status: 400 }
      );
    }

    // Prepare headers with authentication token
    const headers = {
      "Content-Type": "application/json",
    };

    // Add authorization header with user token
    if (session.user.token) {
      headers.Authorization = `Bearer ${session.user.token}`;
    }

    // Add user name and ID to the request body
    const orderData = {
      ...body,
      userName: session.user.name, // Add user name from session
      userId: session.user.id, // Add the user ID from the session
    };

    const response = await fetch(`${apiBaseUrl}/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify(orderData),
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

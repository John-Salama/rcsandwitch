import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const apiBaseUrl = process.env.API_BASE_URL;
    const response = await fetch(`${apiBaseUrl}/sandwiches/${params.id}`);

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Sandwich not found" },
          { status: 404 }
        );
      }
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data.data);
  } catch (error) {
    console.error(`Error fetching sandwich ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch sandwich" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    // Get the user's session to retrieve the authentication token
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const apiBaseUrl = process.env.API_BASE_URL;

    // Prepare headers with authentication token if available
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Add authorization header if user is logged in
    if (session?.user?.token) {
      headers.Authorization = `Bearer ${session.user.token}`;
    }

    const response = await fetch(`${apiBaseUrl}/sandwiches/${params.id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Sandwich not found" },
          { status: 404 }
        );
      }
      if (response.status === 401) {
        return NextResponse.json(
          { error: "Unauthorized. Please log in first." },
          { status: 401 }
        );
      }
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update sandwich");
    }

    const data = await response.json();
    return NextResponse.json(data.data);
  } catch (error) {
    console.error(`Error updating sandwich ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to update sandwich" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Get the user's session to retrieve the authentication token
    const session = await getServerSession(authOptions);
    const id = context.params.id;
    const apiBaseUrl = process.env.API_BASE_URL;

    // Prepare headers with authentication token if available
    const headers: HeadersInit = {};

    // Add authorization header if user is logged in
    if (session?.user?.token) {
      headers.Authorization = `Bearer ${session.user.token}`;
    }

    const response = await fetch(`${apiBaseUrl}/sandwiches/${id}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Sandwich not found" },
          { status: 404 }
        );
      }
      if (response.status === 401) {
        return NextResponse.json(
          { error: "Unauthorized. Please log in first." },
          { status: 401 }
        );
      }
      if (response.status === 400) {
        return NextResponse.json(
          { error: "Cannot delete sandwich that has been ordered" },
          { status: 400 }
        );
      }
      throw new Error(`API responded with status: ${response.status}`);
    }

    return NextResponse.json(
      { message: "Sandwich deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting sandwich ${context.params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete sandwich" },
      { status: 500 }
    );
  }
}

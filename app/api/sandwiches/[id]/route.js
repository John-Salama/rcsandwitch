import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/authOptions";

export async function GET(request, { params }) {
  const id = params.id;
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const apiBaseUrl = process.env.API_BASE_URL;
    const response = await fetch(`${apiBaseUrl}/sandwiches/${id}`);

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
    console.error(`Error fetching sandwich ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch sandwich" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  const id = params.id;
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const apiBaseUrl = process.env.API_BASE_URL;

    const headers = {
      "Content-Type": "application/json",
    };

    if (session?.user?.token) {
      headers.Authorization = `Bearer ${session.user.token}`;
    }

    const response = await fetch(`${apiBaseUrl}/sandwiches/${id}`, {
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
    console.error(`Error updating sandwich ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to update sandwich" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const id = params.id;
  try {
    const session = await getServerSession(authOptions);
    const apiBaseUrl = process.env.API_BASE_URL;

    const headers = {};

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
    console.error(`Error deleting sandwich ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete sandwich" },
      { status: 500 }
    );
  }
}

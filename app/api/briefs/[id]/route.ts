import { NextRequest } from "next/server";
import { loadBrief, deleteBrief, saveBrief } from "@/lib/brief-storage";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const brief = await loadBrief(id);
    
    if (!brief) {
      return new Response(JSON.stringify({ error: "Brief not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ brief }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error loading brief:", error);
    return new Response(JSON.stringify({ error: "Failed to load brief" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    
    // Validate the request body
    if (!body.briefData || !body.metadata) {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Create the updated brief object
    const updatedBrief = {
      id,
      briefData: body.briefData,
      metadata: {
        ...body.metadata,
        updatedAt: new Date().toISOString()
      }
    };

    // Save the updated brief
    const success = await saveBrief(updatedBrief);
    
    if (!success) {
      return new Response(JSON.stringify({ error: "Failed to save brief" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ message: "Brief updated successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error updating brief:", error);
    return new Response(JSON.stringify({ error: "Failed to update brief" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const success = await deleteBrief(id);
    
    if (!success) {
      return new Response(JSON.stringify({ error: "Brief not found or could not be deleted" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ message: "Brief deleted successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error deleting brief:", error);
    return new Response(JSON.stringify({ error: "Failed to delete brief" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

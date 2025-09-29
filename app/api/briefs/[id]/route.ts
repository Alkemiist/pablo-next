import { NextRequest } from "next/server";
import { loadBrief, deleteBrief } from "@/lib/brief-storage";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const brief = await loadBrief(params.id);
    
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteBrief(params.id);
    
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

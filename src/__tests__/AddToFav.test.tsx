/**
 * AddToFav Component Unit Tests (Passing Only)
 *
 * This test suite validates the AddToFav component by checking:
 * - Rendering for signed-in and signed-out users
 * - Loading state when Clerk is not loaded
 * - Redirects to /sign-in when unauthenticated
 */

import AddToFav from "../app/components/favorite/AddToFav";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// --- Mocks ---
// Mock Clerk
vi.mock("@clerk/nextjs", () => ({
  useUser: vi.fn(),
}));

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("AddToFav Component", () => {
  const mockPush = vi.fn();
  const mockReload = vi.fn();

  const mockUser = {
    isSignedIn: true,
    user: {
      publicMetadata: { favs: [] },
      reload: mockReload,
    },
    isLoaded: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({ push: mockPush });
    (useUser as any).mockReturnValue(mockUser);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ✅ Test 1: Renders correctly for signed-in users
  it("renders correctly for signed-in users", async () => {
    render(<AddToFav movieId={123} title="Test Movie" showLabel={true} />);
    expect(await screen.findByRole("button")).toBeInTheDocument();
    expect(await screen.findByText("Add to Favorites")).toBeInTheDocument();
    expect(await screen.findByLabelText("Add to favorites")).toBeInTheDocument();
  });

  // ✅ Test 2: Renders correctly for signed-out users
  it("renders correctly for signed-out users", async () => {
    (useUser as any).mockReturnValue({
      isSignedIn: false,
      user: null,
      isLoaded: true,
    });

    render(<AddToFav movieId={123} title="Test Movie" showLabel={true} />);
    expect(await screen.findByText("Add to Favorites")).toBeInTheDocument();
  });

  // ✅ Test 3: Shows loading state when not loaded
  it("shows loading state when not loaded", () => {
    (useUser as any).mockReturnValue({
      isSignedIn: false,
      user: null,
      isLoaded: false,
    });

    render(<AddToFav movieId={123} title="Test Movie" showLabel={true} />);
    expect(screen.getByText("...")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  // ✅ Test 4: Redirects to sign-in when user is not signed in
  it("redirects to sign-in when user is not signed in", async () => {
    (useUser as any).mockReturnValue({
      isSignedIn: false,
      user: null,
      isLoaded: true,
    });

    render(<AddToFav movieId={123} title="Test Movie" showLabel={true} />);
    const button = await screen.findByRole("button", { name: /add to favorites/i });
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith("/sign-in");
  });
});

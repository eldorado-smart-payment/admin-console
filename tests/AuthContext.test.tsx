import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/components/AuthContext";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockLogoutAPI = vi.fn().mockResolvedValue(undefined);
vi.mock("@/lib/api", () => ({
  loginAPI: vi.fn(),
  verifyOTPAPI: vi.fn(),
  resendOTPAPI: vi.fn(),
  logoutAPI: (...args: unknown[]) => mockLogoutAPI(...args),
}));

function seedSession() {
  localStorage.setItem("access_token", "test-access-token");
  localStorage.setItem("refresh_token", "test-refresh-token");
  localStorage.setItem(
    "user",
    JSON.stringify({
      first_name: "Test",
      last_name: "User",
      email: "test@example.com",
      username: "testuser",
      profile_image: null,
      is_online: true,
      is_staff: true,
      can_create: true,
      can_retrieve: true,
    })
  );
  document.cookie = "auth_token=test-access-token";
}

function TestConsumer() {
  const { isAuthenticated, user, logout } = useAuth();
  return (
    <div>
      <span data-testid="auth-status">{isAuthenticated ? "authenticated" : "unauthenticated"}</span>
      <span data-testid="user-name">{user?.first_name ?? "none"}</span>
      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>
  );
}

function tick() {
  act(() => { vi.advanceTimersByTime(10); });
}

async function waitForAuth(screen: ReturnType<typeof render>) {
  await vi.waitFor(() => {
    expect(screen.getByTestId("auth-status").textContent).toBe("authenticated");
  });
}

describe("AuthContext", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(1_700_000_000_000);
    localStorage.clear();
    document.cookie = "";
    mockPush.mockClear();
    mockLogoutAPI.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  describe("initialization", () => {
    it("restores session from localStorage", async () => {
      seedSession();
      const screen = renderWithProvider();
      await vi.waitFor(() => {
        expect(screen.getByTestId("auth-status").textContent).toBe("authenticated");
        expect(screen.getByTestId("user-name").textContent).toBe("Test");
      });
    });

    it("starts unauthenticated when no session exists", async () => {
      const screen = renderWithProvider();
      await vi.waitFor(() => {
        expect(screen.getByTestId("auth-status").textContent).toBe("unauthenticated");
      });
    });
  });

  describe("inactivity timeout (30 min)", () => {
    it("logs out after 30 minutes of inactivity", async () => {
      seedSession();
      const screen = renderWithProvider();
      await waitForAuth(screen);

      act(() => { vi.advanceTimersByTime(30 * 60 * 1000 + 100); });

      await vi.waitFor(() => {
        expect(mockLogoutAPI).toHaveBeenCalledWith("test-refresh-token");
        expect(localStorage.getItem("access_token")).toBeNull();
        expect(mockPush).toHaveBeenCalledWith("/");
        expect(screen.getByTestId("auth-status").textContent).toBe("unauthenticated");
      });
    });

    it("resets inactivity timer on user activity", async () => {
      seedSession();
      const screen = renderWithProvider();
      await waitForAuth(screen);

      act(() => { window.dispatchEvent(new Event("mousedown")); });
      act(() => { vi.advanceTimersByTime(29 * 60 * 1000); });
      tick();

      expect(mockLogoutAPI).not.toHaveBeenCalled();

      act(() => { vi.advanceTimersByTime(2 * 60 * 1000); });
      tick();

      expect(mockLogoutAPI).toHaveBeenCalledTimes(1);
    });
  });

  describe("tab visibility change", () => {
    it("logs out when returning after 30+ min away", async () => {
      seedSession();
      const screen = renderWithProvider();
      await waitForAuth(screen);

      act(() => { vi.advanceTimersByTime(30 * 60 * 1000 + 500); });

      await vi.waitFor(() => {
        expect(mockLogoutAPI).toHaveBeenCalled();
        expect(localStorage.getItem("access_token")).toBeNull();
        expect(mockPush).toHaveBeenCalledWith("/");
      });
    });

    it("does NOT log out when returning within 30 min", async () => {
      seedSession();
      const screen = renderWithProvider();
      await waitForAuth(screen);

      act(() => { vi.advanceTimersByTime(15 * 60 * 1000); });
      Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true });
      act(() => { document.dispatchEvent(new Event("visibilitychange")); });

      expect(mockLogoutAPI).not.toHaveBeenCalled();
    });
  });

  describe("tab close (beforeunload)", () => {
    it("clears session on beforeunload", async () => {
      seedSession();
      const screen = renderWithProvider();
      await waitForAuth(screen);

      const sendBeaconOrig = navigator.sendBeacon;
      const sendBeaconSpy = vi.fn();
      navigator.sendBeacon = sendBeaconSpy;

      act(() => { window.dispatchEvent(new Event("beforeunload")); });

      expect(localStorage.getItem("access_token")).toBeNull();
      expect(localStorage.getItem("refresh_token")).toBeNull();

      navigator.sendBeacon = sendBeaconOrig;
    });
  });

  describe("explicit logout", () => {
    it("calls logout API, clears session, and redirects", async () => {
      seedSession();
      const screen = renderWithProvider();
      await waitForAuth(screen);

      await act(async () => {
        screen.getByTestId("logout-btn").click();
      });

      expect(mockLogoutAPI).toHaveBeenCalledWith("test-refresh-token");
      expect(localStorage.getItem("access_token")).toBeNull();
      expect(mockPush).toHaveBeenCalledWith("/");
      expect(screen.getByTestId("auth-status").textContent).toBe("unauthenticated");
    });
  });
});

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Crown,
  Calendar,
  Eye,
  Users,
  Gift,
  CreditCard,
  Coffee,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  plan: string;
  dailyViews: number;
  bonusViews: number;
  lastViewReset: Date;
  premiumUntil?: Date | null;
  createdAt: Date;
}

interface Invite {
  id: string;
  email: string;
  code: string;
  status: string;
  createdAt: Date;
  acceptedAt?: Date | null;
}

export default function AccountPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }
    fetchProfile();
    fetchInvites();
  }, [session, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/user/profile");
      const data = await response.json();

      if (data.success) {
        setProfile(data.data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvites = async () => {
    try {
      const response = await fetch("/api/user/invite");
      const data = await response.json();

      if (data.success) {
        setInvites(data.data);
      }
    } catch (error) {
      console.error("Error fetching invites:", error);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    setInviteLoading(true);
    try {
      const response = await fetch("/api/user/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Invite sent successfully!");
        setInviteEmail("");
        fetchInvites();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Failed to send invite");
    } finally {
      setInviteLoading(false);
    }
  };

  const handleUpgrade = async (duration: "monthly" | "yearly") => {
    setUpgradeLoading(true);
    try {
      const response = await fetch("/api/user/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "PREMIUM", duration }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Successfully upgraded to Premium!");
        await update(); // Refresh session
        fetchProfile();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Upgrade failed");
    } finally {
      setUpgradeLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-6">
                <div className="h-6 bg-muted rounded mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const remainingViews = profile
    ? Math.max(0, 5 - profile.dailyViews) + profile.bonusViews
    : 0;
  const isPremium = profile?.plan === "PREMIUM";

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Account</h1>
          <p className="text-muted-foreground">
            Manage your movieABC account and subscription
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-foreground">
                  Profile
                </h2>
                {isPremium && (
                  <div className="flex items-center space-x-2 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full">
                    <Crown className="h-4 w-4" />
                    <span className="text-sm font-medium">Premium</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Name
                  </label>
                  <div className="text-foreground">{profile?.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Email
                  </label>
                  <div className="text-foreground">{profile?.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Member Since
                  </label>
                  <div className="text-foreground">
                    {profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString()
                      : "-"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Current Plan
                  </label>
                  <div className="text-foreground capitalize">
                    {profile?.plan?.toLowerCase()}
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Stats */}
            <div className="card p-6">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                Usage Statistics
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                    <Eye className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {isPremium ? "∞" : remainingViews}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {isPremium ? "Unlimited Views" : "Views Remaining"}
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-green-500/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                    <Gift className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {profile?.bonusViews || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Bonus Views
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-blue-500/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {invites.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Invites
                  </div>
                </div>
              </div>
            </div>

            {/* Invite Friends */}
            {!isPremium && (
              <div className="card p-6">
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Invite Friends
                </h2>
                <p className="text-muted-foreground mb-6">
                  Invite friends to get 2 bonus views for each successful
                  signup!
                </p>

                <form onSubmit={handleInvite} className="flex gap-4">
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Friend's email address"
                    className="input flex-1"
                    required
                  />
                  <Button type="submit" disabled={inviteLoading} size="sm">
                    {inviteLoading ? "Sending..." : "Send Invite"}
                  </Button>
                </form>

                {/* Invites List */}
                {invites.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-medium text-foreground mb-3">
                      Your Invites
                    </h3>
                    <div className="space-y-2">
                      {invites.slice(0, 5).map((invite) => (
                        <div
                          key={invite.id}
                          className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded"
                        >
                          <span className="text-sm text-foreground">
                            {invite.email}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              invite.status === "ACCEPTED"
                                ? "bg-green-500/10 text-green-500"
                                : "bg-yellow-500/10 text-yellow-500"
                            }`}
                          >
                            {invite.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Upgrade Card */}
            {!isPremium && (
              <div className="card p-6 border-primary">
                <div className="text-center mb-6">
                  <Crown className="h-12 w-12 text-primary mx-auto mb-3" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Upgrade to Premium
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Unlock unlimited views and exclusive features
                  </p>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={() => handleUpgrade("monthly")}
                    disabled={upgradeLoading}
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Monthly - $9.99</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleUpgrade("yearly")}
                    disabled={upgradeLoading}
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Yearly - $99.99</span>
                  </Button>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <Coffee className="h-4 w-4" />
                    <span>Buy Me a Coffee</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Premium Status */}
            {isPremium && profile?.premiumUntil && (
              <div className="card p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500">
                <div className="text-center">
                  <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Premium Active
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Your premium subscription is active until:
                  </p>
                  <div className="text-lg font-medium text-foreground">
                    {new Date(profile.premiumUntil).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="card p-6">
              <h3 className="font-semibold text-foreground mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Views Today</span>
                  <span className="text-foreground">
                    {profile?.dailyViews || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Successful Invites
                  </span>
                  <span className="text-foreground">
                    {invites.filter((i) => i.status === "ACCEPTED").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Type</span>
                  <span className="text-foreground capitalize">
                    {profile?.plan?.toLowerCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

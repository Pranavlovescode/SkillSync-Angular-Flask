"use client";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import axios from "axios";

// Shadcn UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Icons
import { CheckCircle2, XCircle, Loader2, Mail, ArrowRight, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { authService } from "@/services/authService";

const VerifyEmailPage = () => {
  const [verificationStatus, setVerificationStatus] = useState("loading"); // loading, success, invalid, expired
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const {token} = useParams();

  useEffect(() => {
    if (!token) {
      setVerificationStatus("invalid");
      setMessage("No verification token found. Please check your email for the correct verification link.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await authService.verifyEmail(token);

        if (response.verified) {
          setVerificationStatus("success");
          setMessage("Your email has been successfully verified. You can now access all features of SkillSync.");
        } else {
          setVerificationStatus("invalid");
          setMessage("Verification failed. Please try again or request a new verification link.");
        }
      } catch (error) {
        if (error.response?.status === 400) {
          setVerificationStatus("expired");
          setMessage("This verification link has expired. Please request a new verification link.");
        } else {
          setVerificationStatus("invalid");
          setMessage("An error occurred during verification. Please try again later.");
        }
        console.error("Verification error:", error);
      }
    };

    verifyEmail();
  }, [token]);

  const handleResendVerification = async () => {
    try {
      setVerificationStatus("sending");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/resend-verification`,
        {},
        { withCredentials: true }
      );
      setMessage("A new verification link has been sent to your email address.");
      setVerificationStatus("resent");
    } catch (error) {
      setMessage("Failed to resend verification email. Please try again later.");
      setVerificationStatus("invalid");
      console.error("Resend error:", error);
    }
  };

  const getStatusContent = () => {
    switch (verificationStatus) {
      case "loading":
        return {
          icon: <Loader2 className="h-12 w-12 text-primary animate-spin" />,
          title: "Verifying Your Email",
          description: "Please wait while we verify your email address...",
          alertStatus: "default",
        };
      case "success":
        return {
          icon: <CheckCircle2 className="h-12 w-12 text-green-500" />,
          title: "Email Verified Successfully!",
          description: message,
          alertStatus: "success",
        };
      case "expired":
        return {
          icon: <XCircle className="h-12 w-12 text-amber-500" />,
          title: "Verification Link Expired",
          description: message,
          alertStatus: "warning",
        };
      case "sending":
        return {
          icon: <Loader2 className="h-12 w-12 text-primary animate-spin" />,
          title: "Sending New Verification Link",
          description: "Please wait while we send a new verification link to your email...",
          alertStatus: "default",
        };
      case "resent":
        return {
          icon: <Mail className="h-12 w-12 text-blue-500" />,
          title: "Verification Email Sent!",
          description: message,
          alertStatus: "info",
        };
      case "invalid":
      default:
        return {
          icon: <XCircle className="h-12 w-12 text-destructive" />,
          title: "Verification Failed",
          description: message,
          alertStatus: "destructive",
        };
    }
  };

  const { icon, title, description, alertStatus } = getStatusContent();

  // Background elements styles
  const bgStyle = {
    background: "radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.1) 0%, rgba(0, 0, 0, 0) 70%)",
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 -left-20 h-[500px] w-[500px] rounded-full bg-purple-900/10 blur-3xl" />
        <div className="absolute bottom-0 -right-20 h-[500px] w-[500px] rounded-full bg-blue-900/10 blur-3xl" />
        <div className="absolute inset-0" style={bgStyle} />
      </div>

      <div className="container max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden border border-border/40 bg-black/40 shadow-xl backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center pb-2">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                {icon}
              </div>
              <CardTitle className="text-2xl font-bold">{title}</CardTitle>
              <CardDescription className="text-white">{description}</CardDescription>
            </CardHeader>

            <CardContent className="pb-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={verificationStatus}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Alert variant={alertStatus} className="mb-4">
                    <AlertTitle className="flex items-center">
                      {verificationStatus === "success" && "Welcome to SkillSync!"}
                      {verificationStatus === "expired" && "Your link has expired"}
                      {verificationStatus === "invalid" && "Something went wrong"}
                      {verificationStatus === "loading" && "Please wait"}
                      {verificationStatus === "resent" && "Check your inbox"}
                      {verificationStatus === "sending" && "Sending..."}
                    </AlertTitle>
                    <AlertDescription className={'text-white'}>
                      {verificationStatus === "success" && "You now have full access to all SkillSync features."}
                      {verificationStatus === "expired" && "Click below to request a new verification link."}
                      {verificationStatus === "invalid" && "Your verification link appears to be invalid."}
                      {verificationStatus === "resent" && "We've sent a fresh verification link to your email address."}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              </AnimatePresence>

              {(verificationStatus === "invalid" || verificationStatus === "expired") && (
                <div className="mt-6 text-center text-sm text-muted-foreground">
                  Need a new verification link?
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              {verificationStatus === "success" && (
                <Button
                  className="w-full gap-2 group"
                  onClick={() => router.push("/auth/login")}
                >
                  Continue to Login
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              )}

              {(verificationStatus === "invalid" || verificationStatus === "expired") && (
                <Button
                  variant={verificationStatus === "expired" ? "default" : "secondary"}
                  className="w-full gap-2"
                  onClick={handleResendVerification}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Resend Verification Email
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full border-border/40 hover:bg-primary/10"
                onClick={() => router.push("/")}
              >
                Return to Home Page
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Having trouble? Contact support at <span className="text-primary">support@skillsync.com</span></p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
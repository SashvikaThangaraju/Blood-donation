import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { adminLogin } from "@/lib/api";
import { saveToken } from "@/lib/auth";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  const mutation = useMutation({
    mutationFn: adminLogin,
    onSuccess: (data) => {
      saveToken(data.token);
      toast({
        title: "Login Successful!",
        description: "Welcome to the admin dashboard.",
      });
      navigate("/admin/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid username or password.",
        variant: "destructive"
      });
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.username.trim() || !credentials.password.trim()) {
        toast({ title: "Error", description: "Username and password are required", variant: "destructive" });
        return;
    }
    mutation.mutate(credentials);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="bg-primary rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Login</h1>
          <p className="text-warm-gray">Access the BloodConnect admin dashboard</p>
        </div>

        <Card className="blood-card">
          <CardHeader><CardTitle className="text-primary text-center">Secure Access</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center"><User className="mr-2 h-4 w-4" />Username</Label>
                <Input id="username" value={credentials.username} onChange={(e) => handleInputChange("username", e.target.value)} placeholder="Enter your username" required autoComplete="username" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center"><Lock className="mr-2 h-4 w-4" />Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} value={credentials.password} onChange={(e) => handleInputChange("password", e.target.value)} placeholder="Enter your password" required autoComplete="current-password" />
                  <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4 text-warm-gray" /> : <Eye className="h-4 w-4 text-warm-gray" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full btn-blood" disabled={mutation.isPending}>
                {mutation.isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;


import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Users, 
  MessageSquare, 
  Heart, 
  TrendingUp, 
  Search, 
  Edit, 
  Trash2, 
  LogOut,
  Download,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getAdminMessages, deleteMessage, getDonors, deleteDonor } from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";
import { Donor, Message } from "@/types";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("");

  // Check if admin is logged in
  useEffect(() => {
    if (!getToken()) {
      navigate("/admin");
    }
  }, [navigate]);
  
  // Fetch Donors
  const { data: donorsData, isLoading: isLoadingDonors } = useQuery<Donor[]>({
    queryKey: ['adminDonors', searchTerm, bloodGroupFilter],
    queryFn: () => getDonors({ search: searchTerm, bloodGroup: bloodGroupFilter }),
    enabled: !!getToken(),
  });
  
  // Fetch Messages
  const { data: messagesData, isLoading: isLoadingMessages } = useQuery<Message[]>({
    queryKey: ['adminMessages'],
    queryFn: getAdminMessages,
    enabled: !!getToken(),
  });

  const donors = useMemo(() => donorsData || [], [donorsData]);
  const messages = useMemo(() => messagesData || [], [messagesData]);

  // Delete Donor Mutation
  const deleteDonorMutation = useMutation({
    mutationFn: deleteDonor,
    onSuccess: () => {
      toast({ title: "Success", description: "Donor deleted successfully." });
      queryClient.invalidateQueries({ queryKey: ['adminDonors'] });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Delete Message Mutation
  const deleteMessageMutation = useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => {
      toast({ title: "Success", description: "Message deleted successfully." });
      queryClient.invalidateQueries({ queryKey: ['adminMessages'] });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const dashboardStats = [
    { title: "Total Donors", value: donors.length, change: "", icon: Users, color: "text-blue-500" },
    { title: "Unread Messages", value: messages.filter(m => m.status === 'Unread').length, change: "", icon: MessageSquare, color: "text-green-500" },
    { title: "O- Donors", value: donors.filter(d => d.bloodGroup === 'O-').length, change: "Critical Need", icon: Heart, color: "text-red-500" },
    { title: "New This Month", value: donors.filter(d => new Date(d.registeredDate).getMonth() === new Date().getMonth()).length, change: "", icon: TrendingUp, color: "text-purple-500" },
  ];

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handleLogout = () => {
    removeToken();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/admin");
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "Anytime": return "bg-green-100 text-green-800";
      case "Emergency Only": return "bg-red-100 text-red-800";
      case "Weekdays": return "bg-blue-100 text-blue-800";
      case "Weekends": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getMessageStatusColor = (status: string) => {
    switch (status) {
      case "Unread": return "bg-red-100 text-red-800";
      case "Read": return "bg-blue-100 text-blue-800";
      case "Replied": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-warm-gray-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-warm-gray">Manage donors and messages</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <Card key={index} className="blood-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-warm-gray">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    {stat.change && <p className="text-xs text-green-600">{stat.change}</p>}
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="donors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="donors">Manage Donors</TabsTrigger>
            <TabsTrigger value="messages">Manage Messages</TabsTrigger>
          </TabsList>

          {/* Donors Tab */}
          <TabsContent value="donors">
            <Card className="blood-card">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-primary flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Donor Management
                  </CardTitle>
                  <Button className="btn-blood">
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search and Filters */}
                <div className="flex gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-warm-gray" />
                    <Input
                      placeholder="Search donors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select 
                    value={bloodGroupFilter} 
                    onValueChange={(value) => setBloodGroupFilter(value === 'all' ? '' : value)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Blood Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Blood Groups</SelectItem>
                      {bloodGroups.map(group => (
                        <SelectItem key={group} value={group}>{group}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Donors Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Blood Group</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Availability</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingDonors ? (
                        <TableRow><TableCell colSpan={6} className="text-center">Loading donors...</TableCell></TableRow>
                      ) : donors.map((donor) => (
                        <TableRow key={donor.id}>
                          <TableCell className="font-medium">{donor.fullName}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{donor.email}</div>
                              <div className="text-warm-gray">{donor.phone}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-primary text-primary-foreground">
                              {donor.bloodGroup}
                            </Badge>
                          </TableCell>
                          <TableCell>{donor.location}</TableCell>
                          <TableCell>
                            <Badge className={getAvailabilityColor(donor.availability)}>
                              {donor.availability}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => deleteDonorMutation.mutate(donor.id)}
                                disabled={deleteDonorMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card className="blood-card">
              <CardHeader>
                <CardTitle className="text-primary flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Message Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoadingMessages ? (
                    <p>Loading messages...</p>
                  ) : messages.map((message) => (
                    <Card key={message.id} className="border border-border">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-foreground">{message.name}</h4>
                            <p className="text-sm text-warm-gray">{message.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getMessageStatusColor(message.status)}>
                              {message.status}
                            </Badge>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => deleteMessageMutation.mutate(message.id)}
                              disabled={deleteMessageMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <h5 className="font-medium text-foreground mb-2">{message.subject}</h5>
                        <p className="text-warm-gray text-sm mb-3">{message.message}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-warm-gray">{new Date(message.receivedDate).toLocaleString()}</span>
                          <Button size="sm" className="btn-blood">
                            Reply
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;


import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, MapPin, Phone, Mail, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getDonors } from "@/lib/api";
import { Donor } from "@/types";

const FindDonors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const { data: donors, isLoading, error } = useQuery<Donor[]>({
    queryKey: ['donors', searchTerm, bloodGroupFilter, locationFilter],
    queryFn: () => getDonors({ search: searchTerm, bloodGroup: bloodGroupFilter, location: locationFilter }),
  });

  const filteredDonors = useMemo(() => {
    if (!donors) return [];
    // The backend now handles filtering, but we can keep this for client-side responsiveness if needed.
    // For now, we'll just use the data as is from the backend.
    return donors;
  }, [donors]);

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "Anytime": return "bg-green-100 text-green-800";
      case "Emergency Only": return "bg-red-100 text-red-800";
      case "Weekdays": return "bg-blue-100 text-blue-800";
      case "Weekends": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleContactDonor = (donor: Donor) => {
    window.open(`tel:${donor.phone}`);
  };
  
  const clearFilters = () => {
    setSearchTerm("");
    setBloodGroupFilter("");
    setLocationFilter("");
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Heart className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-foreground mb-4">Find Blood Donors</h1>
          <p className="text-xl text-warm-gray max-w-2xl mx-auto">
            Connect with generous donors in your area. Search by blood type and location to find the help you need.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 blood-card">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <Filter className="mr-2 h-5 w-5" />
              Search & Filter Donors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-warm-gray" />
                <Input
                  placeholder="Search by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select 
                value={bloodGroupFilter} 
                onValueChange={(value) => setBloodGroupFilter(value === 'all' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Blood Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Blood Groups</SelectItem>
                  {bloodGroups.map(group => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input
                placeholder="Filter by location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
              
              <Button 
                variant="outline" 
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-warm-gray">
            {isLoading ? 'Searching for donors...' : `Found ${filteredDonors.length} donors`}
          </p>
        </div>

        {/* Donors Grid */}
        {isLoading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {Array.from({ length: 6 }).map((_, index) => (
               <Card key={index} className="blood-card">
                 <CardHeader>
                   <Skeleton className="h-6 w-3/4" />
                   <Skeleton className="h-4 w-1/2 mt-2" />
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <Skeleton className="h-4 w-full" />
                   <Skeleton className="h-4 w-full" />
                   <div className="pt-4 border-t border-border">
                    <Skeleton className="h-10 w-full" />
                   </div>
                 </CardContent>
               </Card>
             ))}
           </div>
        ) : error ? (
            <Card className="blood-card text-center py-12 bg-red-50 border-red-200">
                <CardContent>
                    <Heart className="h-16 w-16 text-destructive mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-destructive mb-2">Error Fetching Donors</h3>
                    <p className="text-red-700">There was a problem retrieving data from the server. Please try again later.</p>
                </CardContent>
            </Card>
        ) : filteredDonors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonors.map((donor) => (
              <Card key={donor.id} className="blood-card hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-semibold text-foreground">
                        {donor.fullName}
                      </CardTitle>
                      <div className="flex items-center mt-2">
                        <Badge className="bg-primary text-primary-foreground text-lg font-bold px-3 py-1">
                          {donor.bloodGroup}
                        </Badge>
                        <Badge className={`ml-2 ${getAvailabilityColor(donor.availability)}`}>
                          {donor.availability}
                        </Badge>
                      </div>
                    </div>
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center text-warm-gray">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{donor.location}</span>
                  </div>
                  
                  <div className="flex items-center text-warm-gray">
                    <Phone className="h-4 w-4 mr-2" />
                    <span className="text-sm">{donor.phone}</span>
                  </div>
                  
                  <div className="flex items-center text-warm-gray">
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="text-sm">{donor.email}</span>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                     <Button
                      onClick={() => handleContactDonor(donor)}
                      className="w-full btn-blood"
                    >
                      Contact Donor
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="blood-card text-center py-12">
            <CardContent>
              <Heart className="h-16 w-16 text-warm-gray mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Donors Found</h3>
              <p className="text-warm-gray mb-6">
                No donors match your current search criteria. Try adjusting your filters or search terms.
              </p>
              <Button onClick={clearFilters} className="btn-blood">
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Emergency Section */}
        <Card className="mt-12 bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center">
              <Heart className="mr-2 h-6 w-6" />
              Emergency Blood Need?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 mb-4">
              If you have an urgent blood requirement, please contact your nearest blood bank or hospital immediately. 
              You can also call our emergency hotline for immediate assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Emergency Hotline: (555) 911-BLOOD
              </Button>
              <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                Find Nearest Blood Bank
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FindDonors;


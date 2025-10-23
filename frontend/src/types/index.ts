// Defines the structure for a Donor object
export interface Donor {
    id: number;
    fullName: string;
    age: number;
    bloodGroup: string;
    phone: string;
    email: string;
    location: string;
    availability: string;
    registeredDate: string;
    totalDonations: number;
    lastDonation?: string;
  }
  
  // Defines the structure for a Message object
  export interface Message {
    receivedDate: string | number | Date;
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    timestamp: string;
    status: 'Unread' | 'Read' | 'Replied';
  }

export interface User {
    id: string;
    fullName: string;
    email: string;
  }
  
 export interface AuthResponse {
    success: boolean;
    token: string;
    user: User;
  }
  
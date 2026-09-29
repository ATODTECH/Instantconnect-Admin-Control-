export interface AdminUser {
  id: string
  fullName: string
  firstName: string
  email: string
  role: "admin"
}

export interface AdminSession {
  accessTokenExpiresIn: number
  user: AdminUser
}

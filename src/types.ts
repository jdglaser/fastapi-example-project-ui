export type Optional<O> = O | null

export interface AuthToken {
  accessToken: string
  tokenType: string
}

export interface UserTemplate {
  username: string
  email: string
  firstName: string
  lastName: Optional<string>
  dateOfBirth: string
  password: string
}

export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: Optional<string>
  dateOfBirth: Date
  disabled: boolean
}

export interface RegistrationError {
  errorCode: number
  message: string
}

export interface Item {
  id: number
  name: number
  description: number
  completed: boolean
}

export interface ItemTemplate {
  name: string
  description: string
}
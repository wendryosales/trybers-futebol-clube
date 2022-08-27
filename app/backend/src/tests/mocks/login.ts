import { hash } from "bcryptjs";

export const userLogin = {
  email: 'teste@teste.com',
  password: 'password'
}

export const mockFindOne = async () => {
  const passwordEncrypt = await hash('password', 8)
  return (
    {
      id: 1,
      username: 'name',
      role: 'role',
      email: 'teste@teste.com',
      password: passwordEncrypt
    }
  )
} 

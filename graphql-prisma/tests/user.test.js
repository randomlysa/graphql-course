import { isValidPassword } from '../src/utils/user'

test('Should reject passwords shorter than 8 characters', () => {
  const isValid = isValidPassword('1234567')

  expect(isValid).toBe(false)
})

test('Should reject passwords that contain the word `password`', () => {
  const isValid = isValidPassword('aaapassword444')

  expect(isValid).toBe(false)
})

test('Should correctly validate a valid password', () => {
  const isValid = isValidPassword('gxqi41000z')

  expect(isValid).toBe(true)
})

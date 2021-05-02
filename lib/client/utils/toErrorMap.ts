import { FieldError } from '../generated/graphql'

export const toErrorMap = (errors: FieldError[]) => {
  let errorObject: Record<string, [string]> = {} 
  errors.forEach(({ field, message }) => {
    if (!errorObject[field]) {
      errorObject[field] = [message]
    } else {
      errorObject[field].push(message)
    }
  })

  return errorObject
}
declare module 'option-validator' {
  export type ValidatorPath = (string | number)[]
  export type Validator = (value: unknown, type: string, paths: ValidatorPath) => unknown
  export type Scheme = string | Validator | Scheme[] | { [key: string]: Scheme }

  function optionValidator<T>(option: T, scheme: Scheme, paths?: ValidatorPath): T
  namespace optionValidator {
    const kindOf: (value: unknown) => string
  }
  export default optionValidator
}

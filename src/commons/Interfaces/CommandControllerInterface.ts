

export interface CommandControllerInterface {
  definition(params?: any): Promise<boolean>
};
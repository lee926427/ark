declare module 'sql.js' {
  export interface QueryExecResult {
    columns: string[]
    values: any[][]
  }

  export interface Statement {
    bind(params?: any[]): boolean
    step(): boolean
    getAsObject(): Record<string, any>
    free(): void
    reset(): void
  }

  export interface Database {
    run(sql: string, params?: any[]): Database
    exec(sql: string, params?: any[]): QueryExecResult[]
    prepare(sql: string): Statement
    export(): Uint8Array
    close(): void
  }

  export interface SqlJsStatic {
    Database: new (data?: ArrayLike<number>) => Database
  }

  export interface InitSqlJsOptions {
    locateFile?: (file: string) => string
  }

  export default function initSqlJs(
    options?: InitSqlJsOptions,
  ): Promise<SqlJsStatic>
}

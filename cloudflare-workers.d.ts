declare module "cloudflare:workers" {
  export const env: {
    DB: {
      prepare(query: string): any;
      batch(statements: any[]): Promise<any>;
    };
    BUCKET: {
      put(key: string, value: ArrayBuffer, options?: any): Promise<any>;
      get(key: string): Promise<{body: ReadableStream; httpMetadata?: {contentType?: string}} | null>;
    };
  };
}

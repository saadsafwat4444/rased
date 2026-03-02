declare module '*.json' {
  const value: any;
  export default value;
}

declare module './serviceAccountKey.json' {
  const serviceAccount: any;
  export default serviceAccount;
}

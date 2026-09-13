declare module '*?worker&inline' {
  const WorkerConstructor: new (options?: WorkerOptions) => Worker
  export default WorkerConstructor
}

export type Context = Map<string, unknown>
export type Stage = (context: Context) => Promise<void>
export type Callback<Args> = (args: Args) => Promise<void>
export type SetUpFunction<Config = void, Args = void> = (
  cb: Callback<Args>,
  config?: Config,
) => Stage

export function setUpPipeline(...stages: Stage[]) {
  return async () => {
    const context = new Map<string, unknown>()
    for (const setUp of stages) {
      await setUp(context)
    }
  }
}

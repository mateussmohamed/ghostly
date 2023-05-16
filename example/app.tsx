import { Autocomplete } from './components/autocomplete'
import colors from './helpers/colors'

const App = () => {
  return (
    <main>
      <div className="container mx-auto max-w-sm flex flex-col gap-10">
        <h1 className="text-3xl font-bold text-center mt-10">Ghostly</h1>

        <div className="flex flex-col">
          <h1 className="mb-1 text-xl font-bold">Simple</h1>
          <Autocomplete key="x" data={colors} />
        </div>

        <div className="flex flex-col">
          <h1 className="mb-1 text-xl font-bold">Multi values</h1>
          <Autocomplete key="y" data={colors} multiValue />
        </div>
      </div>
    </main>
  )
}

export default App

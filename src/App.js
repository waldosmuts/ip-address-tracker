import Main from "./components/Main";

export default function App() {
  return (
    <>
      <header className="text-center py-7">
        <a className="text-white font-rubik text-2xl md:text-3xl leading-none font-medium tracking-wide md:tracking-wider" href="."><h1 className="pointer-events-none">IP Address Tracker</h1></a>
      </header>
      <Main />
    </>
  )
}
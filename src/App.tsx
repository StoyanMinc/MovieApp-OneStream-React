import { Route, Routes } from "react-router-dom"
import { Toaster } from "react-hot-toast"

import { MovieContextProvider } from "./contexts/MovieContext"
import Header from "./components/Header"
import Home from "./components/Home"
import MovieList from "./components/MovieList"
import MovieDetails from "./components/MovieDetails"
import MovieEdit from "./components/MovieEdit"

function App() {

    return (
        <MovieContextProvider>
            <Toaster position="top-right" />
            <Header />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/movie-list' element={<MovieList />} />
                <Route path='/movie-list/:id/details' element={<MovieDetails />} />
                <Route path='/movie-list/:id/edit' element={<MovieEdit />} />
            </Routes>
        </MovieContextProvider>
    )
}

export default App

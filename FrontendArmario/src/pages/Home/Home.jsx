import { Footer } from '../../componentes/Footer/Footer'
import { HomeSection } from '../../componentes/Homesection/HomeSection'
import {Navbar} from '../../componentes/Navbar/Navbar'

export function Home(){
    
    return (
        <>
            <Navbar/>
            <HomeSection/>
            <Footer/>
        </>
    )
}
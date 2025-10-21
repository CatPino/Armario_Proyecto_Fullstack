import { UltimosProductos } from "../../componentes/UltimosProductos/UltimosProductos";
import { HomeSection } from '../../componentes/Homesection/HomeSection'
import { Footer } from '../../componentes/Footer/Footer'


export function Home(){
    
    return (
        <>
            <HomeSection/>
            <UltimosProductos />
            <Footer/>
        </>
    )
}
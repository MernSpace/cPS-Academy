import { Navbar } from "@/components/Navbar"

interface Props {
    children: React.ReactNode
}


const Layout = ({ children }: Props) => {
    return (
        <div>
            <Navbar />
            {children}
        </div>
    )
}

export default Layout
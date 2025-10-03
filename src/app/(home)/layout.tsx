import { Navbar } from "@/components/Navbar"
import { Toaster } from "@/components/ui/sonner"

interface Props {
    children: React.ReactNode
}


const Layout = ({ children }: Props) => {
    return (
        <div>
            <Toaster />
            <Navbar />
            {children}
        </div>
    )
}

export default Layout
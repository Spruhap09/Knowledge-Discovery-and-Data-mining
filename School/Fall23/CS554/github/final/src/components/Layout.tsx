import Navigation from "@/components/Navigation"

interface LayoutProps {
    children: React.ReactNode,
}

export default function Layout({children}: LayoutProps) {
    return (
        <main className="primary">
            <div className="m-0 p-0 w-full flex flex-col items-end">
                <Navigation/>
            </div>
            <div className="m-0 p-5 w-full h-11/12 flex flex-col justify-center items-center">
                    {children}
            </div>
        </main>
    )
}
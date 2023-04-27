import Navbar from "./NavBar/NavBar";
export function Layout({children}: { children: React.ReactNode }) {

    return (
        <Navbar
        >
            {children}
        </Navbar>
    );
}
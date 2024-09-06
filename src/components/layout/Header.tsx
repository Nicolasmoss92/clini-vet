import { ButtonAbout } from "./ButtonAbout";
import { ButtonContact } from "./ButtonContact";
import { DropdownService } from "./ButtonDropdownService";
import { DropdownProducts } from "./ButtonDropdownProducts";

export default function Header() {
    return (
        <header className="bg-white h-20 flex items-center justify-between shadow-md px-6">
            <div className="flex items-center">
                <div className="relative w-40 h-16">
                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="object-contain w-full h-full"
                    />
                </div>
            </div>

            <nav className="flex items-center space-x-6 mr-12">
                <DropdownProducts />
                <DropdownService />
                <ButtonAbout />
                <ButtonContact />
            </nav>
        </header>
    );
}

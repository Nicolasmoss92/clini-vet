import { ButtonAbout } from "./ButtonAbout";
import { ButtonContact } from "./ButtonContact";
import { DropdownService } from "./ButtonDropdownService";
import { DropdownProducts } from "./ButtonDropdownProducts";

export default function Header() {
    return (
        <header className="bg-green-800 h-24 flex items-center justify-between px-4">
            <div className="flex items-center">
                <div className="relative w-36 h-16">
                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="object-contain w-full h-full"
                    />
                </div>
            </div>
            
            <div className="flex items-center space-x-4 mr-12">
                <DropdownProducts />
                <DropdownService />
                <ButtonAbout />
                <ButtonContact />
            </div>
        </header>
    );
}

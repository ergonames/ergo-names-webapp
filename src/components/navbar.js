import {Link} from "react-router-dom";
import { ErgoDappConnector } from "ergo-dapp-connector";

function Navbar() {
    return (
        <div className="text-white py-4">
            <Link to="/" className="pl-8 text-3xl font-bold hover:text-gray-500 duration-300"><img src="public/img/icons/logo_64x64.jpg" alt="" className="inline-block"></img>ErgoNames</Link>
            <div className="float-right pr-8">
                <ErgoDappConnector color="orange" />
            </div>
        </div>
    );
}

export default Navbar;
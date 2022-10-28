import { useState } from "react";
import { resolveErgoname, resolveErgonameRegistrationInformation } from "ergonames";
import { sendTransaction } from "ergonames-tx-lib";
import Swal from "sweetalert2";

function SearchBox() {
    const [searchName, setSearchName] = useState("");
    const [resolvedAddress, setResolvedAddress] = useState("");
    const [hasResolved, setHasResolved] = useState(false);
    const [tokenId, setTokenId] = useState("");
    const [ergonamePrice, setErgonamePrice] = useState(0);
    const [registeredAddress, setRegisteredAddress] = useState("");
    const [resolvedPrice, setResolvedPrice] = useState(0);
    const [resolvedDate, setResolvedDate] = useState("");

    const submitSearch = async () => {
        console.log(`Searching for: ${searchName}`);
        let tokenResolveData = await resolveErgoname(searchName);
        console.log(`Resolved data: ${tokenResolveData}`);
        if (tokenResolveData.registered === false) {
          setResolvedAddress("");
          setTokenId("");
          setErgonamePrice(1000000);
          setRegisteredAddress("");
          setResolvedPrice(0);
          setResolvedDate("");
        } else {
          let address = tokenResolveData.tokenAddress;
          setResolvedAddress(address);
          console.log(`Resolved address: ${resolvedAddress}`);
          const registrationData = await resolveErgonameRegistrationInformation(searchName);
          console.log(`Registration data: ${registrationData}`);
          setRegisteredAddress(registrationData.address);
          setTokenId(registrationData.tokenId);
          setResolvedPrice(1000000);
          let timestamp = registrationData.timestamp;
          timestamp = Number(timestamp);
          let date = new Date(timestamp);
          const options = { year: 'numeric', month: 'long', day: 'numeric' };
          setResolvedDate(date.toLocaleDateString("en-US", options));
        };
        setHasResolved(true);
      };
    
      const registerName = async () => {
        console.log(`Registering name: ${searchName}`);
        window.ergoConnector.nautilus.connect().then(async () => {
          console.log("Connected to Nautilus");
          // let raddr = window.ergo.get_change_address();
          let raddr = window.localStorage.getItem("walletAddress");
          console.log(`Address: ${raddr}`);
          let tx = await sendTransaction(ergonamePrice, searchName, raddr);
          console.log(`TX ID: ${tx.txId} - Box ID: ${tx.boxId}`);
          let apiResponse = await postAPIInformation(tx.txId, tx.boxId);
          console.log(`API Response: ${apiResponse}`);
          let explorerLink = 'https://testnet.ergoplatform.com/en/transactions/' + tx.txId;
          Swal.fire({
            title: `Now registering ${searchName}`,
            html: `<a href=${explorerLink}>${tx.txId}</a>`,
            icon: "success",
            confirmButtonText: "Ok",
          });
        })
      };

      const exploreAddress = async () => {
        console.log(`Exploring address: ${resolvedAddress}`);
        window.open('https://testnet.ergoplatform.com/en/addresses/' + resolvedAddress, '_blank');
      };

      const postAPIInformation = async (txId, boxId) => {
        console.log("Sending API request");
        let url = process.env.REACT_APP_API_REQUEST_URL;
        let data = {
          "paymentTxId": txId,
          "mintingRequestBoxId": boxId,
        };
        let response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        let json = await response.json();
        console.log(json);
        return json;
      };

      const copyTokenId = () => {
        navigator.clipboard.writeText(resolvedAddress);
      };

      const copyResolvedAddress = () => {
        navigator.clipboard.writeText(resolvedAddress);
      };

      const copyRegisteredAddress = () => {
        navigator.clipboard.writeText(registeredAddress);
      };

    if (!hasResolved) {
        return (
            <div>
              <div className="mx-auto mt-36 w-[45%] h-[450px] rounded-xl bg-gray-700/50">
                <h1 className="text-white pb-2 pt-4 pl-8 text-2xl font-bold">Search</h1>
                <div className="mx-auto my-4 block">
                  <input type="text" className="ml-[9%] w-3/5 mx-auto my-2 px-2 py-3 bg-gray-500 text-black placeholder:text-black" placeholder="Enter an ErgoName..." onChange={(e) => setSearchName(e.target.value)} />
                  <button className="mx-auto my-2 w-1/5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4" onClick={submitSearch}>Search</button>
                </div>
              </div>
            </div>
        );
      } else {
        if (resolvedAddress !== "") {
          return (
              <div>
                <div className="mx-auto mt-36 w-[45%] h-[450px] rounded-xl bg-gray-700/50">
                <h1 className="text-white pb-2 pt-4 pl-8 text-2xl font-bold">Search</h1>
                <div className="mx-auto my-4 block">
                    <input type="text" className="ml-[9%] w-3/5 mx-auto my-2 px-2 py-3 bg-gray-500 text-black placeholder:text-black" placeholder="Enter an ErgoName..." onChange={(e) => setSearchName(e.target.value)} />
                    <button className="mx-auto my-2 w-1/5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4" onClick={submitSearch}>Search</button>
                </div>
                <div>
                  <h1 className="text-white pl-8 pt-4 pb-2 font-bold text-xl">ErgoName Registration Information</h1>
                  <h1 className="text-white pb-1 pl-8 font-bold">Token Id: <button onClick={copyTokenId} className="text-white font-bold hover:text-gray-500 duration-300">{tokenId}</button></h1>
                  <h1 className="text-white pb-1 pl-8 font-bold">Current Owner: <button onClick={copyResolvedAddress} className="text-white font-bold hover:text-gray-500 duration-300">{resolvedAddress}</button></h1>
                  <h1 className="text-white pb-1 pl-8 font-bold">Registered By: <button onClick={copyRegisteredAddress} className="text-white font-bold hover:text-gray-500 duration-300">{registeredAddress}</button></h1>
                  <h1 className="text-white pb-1 pl-8 font-bold">Registered For: <span className="text-white font-bold">{resolvedPrice / 1e9}</span> Erg</h1>
                  <h1 className="text-white pb-1 pl-8 font-bold">Registered On: <span className="text-white font-bold">{resolvedDate}</span></h1>
                </div>
                <button className="block mx-auto my-8 bg-blue-500 hover:bg-blue-700 text-white text-2xl font-bold py-2 px-4 rounded" onClick={exploreAddress}>Explore Address</button>
                </div>
              </div>
          );
        } else {
          return (
              <div>
                <div className="mx-auto mt-36 w-[45%] h-[450px] rounded-xl bg-gray-700/50">
                <h1 className="text-white pb-2 pt-4 pl-8 text-2xl font-bold">Search</h1>
                <div className="mx-auto my-4 block">
                    <input type="text" className="ml-[9%] w-3/5 mx-auto my-2 px-2 py-3 bg-gray-500 text-black placeholder:text-black" placeholder="Enter an ErgoName..." onChange={(e) => setSearchName(e.target.value)} />
                    <button className="mx-auto my-2 w-1/5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4" onClick={submitSearch}>Search</button>
                </div>
                <div>
                  <h1 className="text-white pl-8 pt-4 font-bold text-xl">ErgoName Registration Information</h1>
                  <h1 className="text-white pl-8 pt-4 text-xl">Price: <span className="text-white font-bold">{ergonamePrice / 1e9}</span> Erg</h1>
                </div>
                  <button className="block mx-auto my-8 bg-blue-500 hover:bg-blue-700 text-white text-2xl font-bold py-2 px-4 rounded" onClick={registerName}>Register Now</button>
                </div>
              </div>
          );
        };
    };
}

export default SearchBox;
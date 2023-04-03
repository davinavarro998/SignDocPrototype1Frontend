import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import DocumentSignerContract from '../build/contracts/DocumentSigner.json';
const DocumentSigner = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0]);
      });
    }
  }, []);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (account && contract) {
        const myDocuments = await contract.methods
          .getMyDocuments()
          .call({ from: account });
        setDocuments(myDocuments);
      }
    };

    fetchDocuments();
  }, [account, contract]);

  const connectWallet = async () => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      await window.ethereum.request({method:"eth_requestAccounts"});
      const accounts = await web3Instance.eth.getAccounts();
      setAccount(accounts[0]);
      setConnected(true);

      const networkId = await web3Instance.eth.net.getId();
      const networkData = DocumentSignerContract.networks[networkId];
      if (networkData) {
        const contractInstance = new web3Instance.eth.Contract(
          DocumentSignerContract.abi,
          networkData.address
        );
        setContract(contractInstance);
      } else {
        alert("Smart contract not deployed to the detected network");
      }
    } else {
      alert(
        "Please install MetaMask or another compatible wallet to interact with this DApp"
      );
    }
  };

  const signDocument = async () => {
    if (content === "") {
      setMessage("Document content cannot be empty.");
      return;
    }

    setMessage("Processing your request...");
    try {
      await contract.methods.signDocument(content).send({ from: account });
      setMessage("Document successfully signed!");
    } catch (error) {
      console.error(error);
      setMessage("An error occurred while signing the document.");
    }
  };

  const displayAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  useEffect(() => {
    if (account && contract) {
      const eventListener = contract.events
        .DocumentSigned({ filter: { signer: account }, fromBlock: "latest" })
        .on("data", (event) => {
          const newDocument = {
            id: event.returnValues.documentId.toString(),
            content: event.returnValues.content,
            signer: event.returnValues.signer,
            timestamp: event.returnValues.timestamp.toString(),
          };

          setDocuments((prevDocuments) => [...prevDocuments, newDocument]);
        })
        .on("error", (error) => {
          console.error("Error listening for DocumentSigned event:", error);
        });

      return () => {
        eventListener.unsubscribe();
      };
    }
  }, [account, contract]);

  return (
    <div>
      {!connected ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected Account: {displayAddress(account)}</p>
          <h2>Sign a Document</h2>
          <input
            type="text"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Enter document content"
          />
          <button onClick={signDocument}>Sign Document</button>
          {message && <p>{message}</p>}
        </div>
      )}

      {documents.length > 0 && (
        <div>
          <h2>My Signed Documents</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Content</th>
                <th>Signer</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((document, index) => (
                <tr key={index}>
                  <td>{document.id}</td>
                  <td>{document.content}</td>
                  <td>{displayAddress(document.signer)}</td>
                  <td>
                    {new Date(
                      parseInt(document.timestamp) * 1000
                    ).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DocumentSigner;

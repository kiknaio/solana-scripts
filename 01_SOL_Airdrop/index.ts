import {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const wallet = new Keypair();

const publicKey = new PublicKey(wallet.publicKey);
const privateKey = wallet.secretKey;

const getWalletBalance = async () => {
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const walletBalance = await connection.getBalance(publicKey);
    console.log("Wallet balance: ", walletBalance / LAMPORTS_PER_SOL, "SOL");
  } catch (error) {
    console.log(error);
  }
};

const airdropSol = async () => {
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const fromAirdropSignature = await connection.requestAirdrop(
      publicKey,
      2 * LAMPORTS_PER_SOL
    );
    const latestBlockHash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: fromAirdropSignature,
    });
    console.log("✅ Airdrop successful");
  } catch (error) {
    console.log(error);
  }
};

async function main() {
  await getWalletBalance();
  await airdropSol();
  await getWalletBalance();
}

main();

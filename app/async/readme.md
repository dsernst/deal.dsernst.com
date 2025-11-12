# Async MPC

To achieve asynchronous multi-party computation,

willing to add a server intermediary to make possible,  
minimizing what the server stores.

## Async MPC design summary:

- Alice creates an encrypted payload and gets a Share URL
- Bob uses the Share URL to submit his inputs
- The server validates, decrypts, runs the MPC, and stores results
- Both parties can view results by opening the Share URL
- The server only stores a hash fingerprint of Alice's payload (with 24-hour expiration for our use case)

The design enables async MPC with minimal server storage.

## Details:

1. Alice loads up MPCApp.com
2. Alice uses app to construct her private input (role and value).
3. Alice POSTs her plaintext input to server.
4. The server encrypts Alice's input (value, role, timestamp) using symmetric encryption (AES-256-CTR) for compact ciphertexts. The server responds back with the encrypted payload. The server doesn't need to store anything yet.
5. Alice's client receives the encrypted payload and constructs a "Share URL" for her.
6. Alice can paste this Share URL — which includes the full encrypted payload — in a message to Bob, over any direct channel (email, signal, sms, telegram, whatever)
7. Bob receives & clicks to open the Share URL: MPCApp.com/b/[encrypted-payload]
8. Bob's client validates the payload, which includes asking the backend if this payload has been used already. Each initiating payload is only allowed a single usage! The backend queries its local DB to check if it has a record of already "resolving" this payload, which is coming in future step 12.
9. If the validation passes — it should iff it's legitimately unused — Bob's client now invites Bob to complete his side of the MPC by submitting his own inputs.
10. Bob POSTs his own private inputs and the encrypted payload from Alice to the backend.
11. The backend now has Bob's inputs, and Alice's (via Bob), and atomically confirms Alice's payload is unused by attempting to insert a hash of it into the DB, with a unique constraint. If the insert succeeds (payload is unused), it proceeds to:
12. - a. Decrypt Alice's payload.
    - b. Runs the pre-agreed-upon MPC logic over the two inputs.
    - c. Stores the MPC results in the database.
    - d. Responds to Bob's POST with the result, so he can immediately see them too.

## Result:

- MPC completed successfully!
- Async! Alice sends initiation on her own, Bob has 24 hours to respond.
- Both parties can view results by opening the Share URL (results are stored and persist).
- Neither party learns the others' input.
- Server briefly sees the two private inputs, but never needs to store them, not even encrypted.
- Server does need to store the hash fingerprint of Alice's payload.
  - For our particular use-case — "Fair" Negotiating https://deal.dsernst.com — we can set initiators' payloads to "expire" if unresponded to within 24 hours. The server can stateless-ly enforce this by checking the encrypted payload timestamp, allowing the DB to safely purge any hashes more than 24 hours old, since those will be rejected by outdated timestamps. So low DB size requirements— just the 1 day's worth of resolved-fingerprints.

## Security Considerations:

**Replay/Interception Attacks:** If Eve intercepts the Share URL and uses it before Bob, Alice would receive results computed with Eve's inputs instead of Bob's. When Alice and Bob communicate, they would quickly discover the mismatch and ignore the incorrect results. This is acceptable for our use case, as the parties can detect and handle such scenarios through their direct communication channel.

**Malicious Server:** As an intermediary, the server briefly sees both inputs during step 12. A malicious server could store those inputs for much longer than intended, and could also intentionally mis-calculate the MPC results. Whether such mis-calculation would be detectable by Alice and Bob depends on the specific MPC protocol being used. This design requires trusting the server to follow the protocol correctly and not retain inputs beyond the computation.

**Error Handling:**

- **Failed POST requests:** Bob's client can show an error and invite retry if his POST fails.
- **Server crashes mid-computation:** If the server crashes between steps 12a and 12d, Bob would see an error and can retry. Bob still wouldn't learn Alice's inputs, so the failure mode is relatively safe.
- **Expired payloads:** Payloads expire after 24 hours. If Bob tries to use an expired payload, he'll see an error message.

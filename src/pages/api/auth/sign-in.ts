// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
    Body,
    Post,
    UnauthorizedException,
    ValidationPipe,
} from 'next-api-decorators'
import {recoverPersonalSignature} from "@metamask/eth-sig-util";
import {ethers} from "ethers";

import {IsEthereumAddress, IsNumber, IsString} from "class-validator";
import {bufferToHex} from "@walletconnect/encoding";
import {getUserAuthToken} from "@/pages/api/auth/utils";
import {getUserByAddress} from "@/lib/db/services/user";
import {createFirestoreCollectionDocument} from "@/lib/db/firestore";

export type SignupResponseData = {
    token: string;
    isNewUser: boolean;
}

export class SignupDTO {
    @IsEthereumAddress()
    address!: string;

    @IsString()
    signature!: string;

    @IsNumber()
    nonce!: number;
}

class SignInHandler {
    @Post("/")
    public async signup(@Body(ValidationPipe) body: SignupDTO) {
        // the address and signed message from the client
        const {address, signature, nonce} = body;

        // verify the signature
        const message = `Hi there. Sign this message to prove you own this wallet. This doesn't cost anything.\n\nSecurity code (you can ignore this): ${nonce}`;

        // compare if the address from request is the same as the address recovered from the signed message
        const recoveredAddress = recoverPersonalSignature({
            signature,
            data: bufferToHex(Buffer.from(message, "utf8")),
        });

        if (address.toLowerCase() !== recoveredAddress.toLowerCase()) {
            throw new UnauthorizedException("Authentication Failed.");
        }

        let user = await getUserByAddress(address.toLowerCase());
        let userId = user?.id as string
        let isNewUser = false;
        if (!user) {
            const serverWeb3 = new ethers.InfuraProvider(
                undefined,
                process.env.INFURA_ID
            );
            const ensLabel = await serverWeb3.lookupAddress(address);
            userId = await createFirestoreCollectionDocument("users", {address: address.toLowerCase(), ensLabel});
            isNewUser = true;
        }
        const token = getUserAuthToken(user?.id as string);
        return {token, isNewUser};
    }
}

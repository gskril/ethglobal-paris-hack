// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
    Body,
    Post,
    UnauthorizedException,
    ValidationPipe,
    createHandler,
} from 'next-api-decorators'
import {recoverPersonalSignature} from "@metamask/eth-sig-util";

import {IsEthereumAddress, IsNumber, IsString} from "class-validator";
import {bufferToHex} from "@walletconnect/encoding";
import {getUserAuthToken} from "@/pages/api/auth/utils";
import {createUser, getUserByAddress} from "@/lib/db/services/user";
import {Address, createPublicClient, http} from "viem";
import {mainnet} from "wagmi/chains";
import {normalize} from "viem/ens";

export type SignInResponseData = {
    token: string;
    isNewUser: boolean;
}

export type SignInRequestData = {
    address: string;
    signature: string;
    nonce: number;
}

export class SignInDTO {
    @IsEthereumAddress()
    address!: string;

    @IsString()
    signature!: string;

    @IsNumber()
    nonce!: number;
}

class SignInHandler {
    @Post("/")
    public async signIn(@Body(ValidationPipe) body: SignInDTO) {
        // the address and signed message from the client
        const {address, signature, nonce} = body;

        console.log(body, body.signature);

        // verify the signature
        const message = `Hi there. Sign this message to prove you own this wallet. This doesn't cost anything.\n\nSecurity code (you can ignore this): ${nonce}`;

        // compare if the address from request is the same as the address recovered from the signed message
        const recoveredAddress = recoverPersonalSignature({
            signature,
            data: bufferToHex(Buffer.from(message, "utf8")),
        });

        console.log(signature)

        if (address.toLowerCase() !== recoveredAddress.toLowerCase()) {
            throw new UnauthorizedException("Authentication Failed.");
        }

        let user = await getUserByAddress(address.toLowerCase());
        let userId = user?.id as string
        let isNewUser = false;
        if (!user) {
            const client = createPublicClient({
                chain: mainnet,
                transport: http(),
            })
            const ensLabel = await client.getEnsName({address: address as Address});
            let ensAvatarUrl = null;
            if (ensLabel) {
                ensAvatarUrl = await client.getEnsAvatar({
                    name: normalize(ensLabel as string),
                })
            }
            userId = await createUser({address: address.toLowerCase(), ensLabel: ensLabel as string, avatarUrl: ensAvatarUrl as string});
            isNewUser = true;
        }
        const token = getUserAuthToken(user?.id as string);
        return {token, isNewUser};
    }
}

export default createHandler(SignInHandler);

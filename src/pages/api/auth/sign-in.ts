// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
    Body,
    Post,
    UnauthorizedException,
    ValidationPipe,
    createHandler,
} from 'next-api-decorators'

import {IsEthereumAddress, IsNumber, IsString} from "class-validator";
import {getAddressENS, getAddressSocialProfiles, getUserAuthToken} from "@/pages/api/auth/utils";
import {createUser, getUserByAddress} from "@/lib/db/services/user";
import {Address, createPublicClient, http, verifyMessage} from "viem";
import {mainnet} from "wagmi/chains";
import {normalize} from "viem/ens";
import {AirstackHelper} from "@/lib/airstack";

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

        // verify the signature
        const message = `Hi there. Sign this message to prove you own this wallet. This doesn't cost anything.\n\nSecurity code (you can ignore this): ${nonce}`;

        const isVerified = verifyMessage({address: address as Address, message, signature: signature as Address});

        if (!isVerified) {
            throw new UnauthorizedException("Authentication Failed.");
        }

        let user = await getUserByAddress(address.toLowerCase());


        console.log()

        let userId = user?.id as string
        let isNewUser = false;
        if (!user) {
            const {ensLabel, ensAvatarUrl} = await getAddressENS(address);
            const {farcasterFName, lensHandle} = await getAddressSocialProfiles(address);
            userId = await createUser({
                address: address.toLowerCase(),
                ensLabel: ensLabel as string,
                avatarUrl: ensAvatarUrl as string,
                farcasterFName: farcasterFName as string,
                lensHandle: lensHandle as string
            });
            isNewUser = true;
        }
        const token = getUserAuthToken(user?.id as string);
        return {token, isNewUser};
    }
}

export default createHandler(SignInHandler);

import {createHandler, Delete, NotFoundException, Param, Post, Req} from "next-api-decorators";
import {JwtAuthGuard} from "@/lib/middlewares";
import type {NextApiRequest} from "next";
import {getBubbleById} from "@/lib/db/services/bubble";
import {checkBubbleAccess} from "@/pages/api/bubbles/utils";

class BubbleAccessHandler {
    @Post()
    @JwtAuthGuard()
    public async getBubbleToken(@Req() req: NextApiRequest) {
        const {id} = req.query;

        const bubble = await getBubbleById(id as string);
        if (!bubble) {
            throw new NotFoundException('Bubble not found');
        }
        const canAccessBubble = await checkBubbleAccess(bubble, req.user!);
        return bubble
    }
}

export default createHandler(BubbleAccessHandler)
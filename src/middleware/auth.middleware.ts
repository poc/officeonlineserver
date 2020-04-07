export class AuthMiddleware {
    static use(app: any) {
        app.use((req: any, res: any, next: any) => {
                let accessToken = req.headers['authorization']?.replace('Bearer ','');
                if (accessToken && accessToken?.includes("INVALID")) {
                    return res.sendStatus(401);
                }
            next();
        })
    }
}
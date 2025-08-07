export default class AdvancedError extends Error {
    public constructor(
        public readonly message: string,
        public readonly statusCode: number
    ){
        super(message);
    }
}
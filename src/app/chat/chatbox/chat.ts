//definition of interface

export interface ChatMessage {
    chatId?:string, //question mark meeans chatid is optional
    message: string,
    createdOn: Date,
    receiverId: string,
    receiverName:string,
    senderId:string,
    senderName:string
}
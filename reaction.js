window.reactionOptions = [
    { code: 'like', symbol: String.fromCodePoint(0x1F44D) },
    { code: 'heart', symbol: String.fromCodePoint(0x2764, 0xFE0F) },
];

window.reactionSymbol = function (code) {
    const option = window.reactionOptions?.find(o => o.code === code);
    return option ? option.symbol : code;
};

window.createMessageId = function () {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

window.applyReactionToMessage = function (messageId, code, from, setMessages) {
    if (!messageId || !setMessages) return;
    setMessages(prev => prev.map(msg => {
        if (msg.id !== messageId) return msg;
        const reactions = { ...(msg.reactions || {}) };
        const currentUsers = new Set(reactions[code] || []);

        if (currentUsers.has(from)) {
            currentUsers.delete(from);
        } else {
            currentUsers.add(from);
        }

        if (currentUsers.size > 0) {
            reactions[code] = Array.from(currentUsers);
        } else {
            delete reactions[code];
        }

        return { ...msg, reactions };
    }));
};

window.sendReaction = function (messageId, code, from, conn, setMessages) {
    if (!messageId || !conn || !setMessages || !from) return;
    if (conn.open) {
        conn.send({ type: 'reaction', messageId, code, from });
    }
    window.applyReactionToMessage(messageId, code, from, setMessages);
};

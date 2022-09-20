// (() => {
let transcript = '';

if (!Promise.prototype.finally) throw new Error('This extension is not compatible with your browser');

const logger = {
    LEVEL_NONE: 0, LEVEL_ERROR: 1, LEVEL_WARN: 2, LEVEL_INFO: 3, LEVEL_LOG: 4, LEVEL_DEBUG: 5, LEVEL_TACE: 6,
    outputPlainString: true,
    level: null,
    consoleOutput: function (consoleMethod, args) {
        if (this.outputPlainString) {
            let r = '', i = 0, x;
            while (i < args.length) {
                x = args[i++];
                if (r) r += ' ';
                r += (x.constructor === Object || Array.isArray(x)) ? JSON.stringify(x) : x;
            }
            consoleMethod.call(console, r);
        } else {
            consoleMethod.apply(console, args);
        }
    },
    trace: function () {
        if (this.level >= this.LEVEL_TACE) this.consoleOutput(console.trace, arguments);
    }, debug: function () {
        if (this.level >= this.LEVEL_DEBUG) this.consoleOutput(console.debug, arguments);
    }, log: function () {
        if (this.level >= this.LEVEL_LOG) this.consoleOutput(console.log, arguments);
    }, info: function () {
        if (this.level >= this.LEVEL_INFO) this.consoleOutput(console.info, arguments);
    }, warn: function () {
        if (this.level >= this.LEVEL_WARN) this.consoleOutput(console.warn, arguments);
    }, error: function () {
        if (this.level >= this.LEVEL_ERROR) this.consoleOutput(console.error, arguments);
    }
};


logger.level = logger.LEVEL_TACE;

Object.freeze(logger);

const storage = sessionStorage;

const displayAgentMessage = (text, dateline, avatarUrl) => {
    const data = { text: text };
    if (dateline) data['dateline'] = dateline;
    if (avatarUrl) data['avatarUrl'] = avatarUrl;
    TeneoWebChat.call('add_message', { author: 'agent', type: 'text', data: data });
}, displayUserMessage = (text) => {
    TeneoWebChat.call('add_message', { author: 'user', type: 'text', data: { 'text': text } });
}, displaySystemMessage = (text) => {
    TeneoWebChat.call('add_message', { type: 'system', data: { text: text } });
}, displayTypingIndicator = (dateline, avatarUrl) => {
    const data = {};
    if (dateline) data['dateline'] = dateline;
    if (avatarUrl) data['avatarUrl'] = avatarUrl;
    TeneoWebChat.call('show_typing_indicator', { author: 'agent', data: data });
}, hideTypingIndicator = () => {
    TeneoWebChat.call('hide_typing_indicator', { author: 'agent' });
};

const disableUserInput = () => {
    storage.setItem('twc_userInputDisabled', 'true');
    TeneoWebChat.call('disable_user_input');
}, enableUserInput = () => {
    storage.removeItem('twc_userInputDisabled');
    TeneoWebChat.call('enable_user_input');
};


const customerSDK = CustomerSDK.init({
    clientId: '9fd023c2ee3786d03f6f243034c1a343',
    licenseId: 9243615,
    autoConnect: false
});


if (logger.level >= logger.LEVEL_DEBUG) {
    customerSDK.on('availability_updated', payload => logger.debug('::', 'availability_updated', payload));
    customerSDK.on('chat_deactivated', payload => logger.debug('::', 'chat_deactivated', payload));
    customerSDK.on('chat_properties_deleted', payload => logger.debug('::', 'chat_properties_deleted', payload));
    customerSDK.on('chat_properties_updated', payload => logger.debug('::', 'chat_properties_updated', payload));
    customerSDK.on('chat_transferred', payload => logger.debug('::', 'chat_transferred', payload));
    customerSDK.on('connected', payload => logger.debug('::', 'connected', payload));
    customerSDK.on('connection_recovered', payload => logger.debug('::', 'connection_recovered', payload));
    customerSDK.on('connection_unstable', payload => logger.debug('::', 'connection_unstable', payload));
    customerSDK.on('customer_id', payload => logger.debug('::', 'customer_id', payload));
    customerSDK.on('customer_page_updated', payload => logger.debug('::', 'customer_page_updated', payload));
    customerSDK.on('customer_updated', payload => logger.debug('::', 'customer_updated', payload));
    customerSDK.on('disconnected', payload => logger.debug('::', 'disconnected', payload));
    customerSDK.on('event_properties_deleted', payload => logger.debug('::', 'event_properties_deleted', payload));
    customerSDK.on('event_properties_updated', payload => logger.debug('::', 'event_properties_updated', payload));
    customerSDK.on('event_updated', payload => logger.debug('::', 'event_updated', payload));
    customerSDK.on('events_marked_as_seen', payload => logger.debug('::', 'events_marked_as_seen', payload));
    customerSDK.on('greeting_accepted', payload => logger.debug('::', 'greeting_accepted', payload));
    customerSDK.on('greeting_canceled', payload => logger.debug('::', 'greeting_canceled', payload));
    customerSDK.on('incoming_chat', payload => logger.debug('::', 'incoming_chat', payload));
    customerSDK.on('incoming_event', payload => logger.debug('::', 'incoming_event', payload));
    customerSDK.on('incoming_greeting', payload => logger.debug('::', 'incoming_greeting', payload));
    customerSDK.on('incoming_rich_message_postback', payload => logger.debug('::', 'incoming_rich_message_postback', payload));
    customerSDK.on('incoming_typing_indicator', payload => logger.debug('::', 'incoming_typing_indicator', payload));
    customerSDK.on('queue_position_updated', payload => logger.debug('::', 'queue_position_updated', payload));
    customerSDK.on('thread_properties_deleted', payload => logger.debug('::', 'thread_properties_deleted', payload));
    customerSDK.on('thread_properties_updated', payload => logger.debug('::', 'thread_properties_updated', payload));
    customerSDK.on('user_added_to_chat', payload => logger.debug('::', 'user_added_to_chat', payload));
    customerSDK.on('user_data', payload => logger.debug('::', 'user_data', payload));
    customerSDK.on('user_removed_from_chat', payload => logger.debug('::', 'user_removed_from_chat', payload));
}


let bLiveChatStopped;

const LC_STOPPER_NONE = 0, LC_STOPPER_AGENT = 1, LC_STOPPER_USER = 2, LC_STOPPER_CODE = 3;
let liveChatStopper = LC_STOPPER_NONE;


const listChats = () => {
    let lastPageId;
    const activeChats = [], inactiveChats = [];
    return new Promise((resolve, reject) => {
        if (liveChatStopper !== LC_STOPPER_NONE) {
            reject();
            return;
        }
        const f = pageId => {
            customerSDK.listChats(pageId ? { limit: 25, pageId: pageId } : { limit: 25 }).then(payload => {
                if (liveChatStopper !== LC_STOPPER_NONE) {
                    reject();
                    return;
                }
                logger.debug('[customerSDK.listChats::then]', payload);
                payload.chatsSummary.forEach(chat => {
                    (chat.active ? activeChats : inactiveChats).push(chat);
                });
                if (payload.nextPageId && lastPageId !== payload.nextPageId) f(lastPageId = payload.nextPageId);
                else resolve({activeChats: activeChats, inactiveChats: inactiveChats});
            }, error => {
                logger.error('[customerSDK.listChats::catch] Failure listing chats for pageId', error);
                reject();
            });
        };
        f();
    });
};


const startChat = () => new Promise((resolve, reject) => {
    if (liveChatStopper !== LC_STOPPER_NONE) {
        reject();
        return;
    }
    customerSDK.startChat({ chat: { thread: { events: [] } } }).then(payload => {
        if (liveChatStopper !== LC_STOPPER_NONE) {
            reject();
            return;
        }
        logger.debug('[customerSDK.startChat::then]', payload);
        resolve(payload.chat);
    }, error => {
        if (liveChatStopper !== LC_STOPPER_NONE) {
            reject();
            return;
        }
        logger.debug('[customerSDK.startChat::catch]', error);
        if (error.code === 'CHAT_LIMIT_REACHED') {
            listChats().then(({activeChats, inactiveChats}) => {
                if (liveChatStopper !== LC_STOPPER_NONE) {
                    reject();
                    return;
                }
                if (activeChats.length === 1) resolve(activeChats[0]);
                else if (activeChats.length > 1) {
                    logger.error('[listChats::then] Multiple active chats', activeChats);
                    reject();
                } else if (inactiveChats.length > 0) {
                    let nChatInd = inactiveChats.length - 1;

                    const success = payload => {
                        if (liveChatStopper !== LC_STOPPER_NONE) {
                            reject();
                            return;
                        }
                        logger.debug('[customerSDK.resumeChat::then] Resumed live chat payload', payload);
                        resolve(payload.chat);
                    }, failure = error => {
                        if (liveChatStopper !== LC_STOPPER_NONE) {
                            reject();
                            return;
                        }
                        if (--nChatInd >= 0) f();
                        else {
                            logger.error('[customerSDK.resumeChat::catch] Failure to resume', inactiveChats.length, 'chat(s):', error);
                            reject();
                        }
                    };

                    const f = () => customerSDK.resumeChat({ chat: { id: inactiveChats[nChatInd].id, thread: { events: [] } } }).then(success, failure);
                    f();
                } else {
                    reject();
                }
            }, reject);
        } else {
            reject();
        }
    });
});


const obtainLiveChat = sChatId => new Promise((resolve, reject) => {
    if (liveChatStopper !== LC_STOPPER_NONE) {
        reject();
        return;
    }
    if (sChatId) {
        customerSDK.getChat({ chatId: sChatId }).then(chat => {
            if (liveChatStopper !== LC_STOPPER_NONE) {
                reject();
                return;
            }
            logger.debug('[customerSDK.getChat::then]', chat);
            if (chat.active) resolve(chat);
            else {
                customerSDK.resumeChat({ chat: { id: chatId, thread: { events: [] } } }).then(payload => {
                    if (liveChatStopper !== LC_STOPPER_NONE) reject();
                    else {
                        logger.debug('[customerSDK.resumeChat::then] Resumed live chat payload', payload);
                        resolve(payload.chat);
                    }
                }, error => {
                    if (liveChatStopper !== LC_STOPPER_NONE) reject();
                    else {
                        logger.info('[customerSDK.resumeChat::catch] Failure to resume inactive chat', error);
                        resolve(chat);
                    }
                });
            }
        }, error => {
            if (liveChatStopper !== LC_STOPPER_NONE) {
                reject();
                return;
            }
            logger.info('[customerSDK.getChat::catch]', error);
            startChat().then(resolve, reject);
        });
    } else {
        startChat().then(resolve, reject);
    }
});


let nLastQueuePosition = Number.parseInt(storage.getItem('twc_liveChatInc_lastQueuePosition'));

const resetLastQueuePosition = () => {
    nLastQueuePosition = Number.NaN;
    storage.removeItem('twc_liveChatInc_lastQueuePosition');
}, setLastQueuePosition = n => {
    if (Number.isNaN(n)) resetLastQueuePosition();
    else storage.setItem('twc_liveChatInc_lastQueuePosition', (nLastQueuePosition = n).toString());
};

let sLiveChatId = storage.getItem('twc_liveChatInc_chatId'), idToLiveChatUser;

const resetCurrentLiveChatData = () => {
    idToLiveChatUser = null;
    sLiveChatId = null;
    storage.removeItem('twc_liveChatInc_chatId');
    resetLastQueuePosition();
}, setCurrentLiveChatData = chat => {
    sLiveChatId = chat.id;
    if (('string' !== typeof sLiveChatId) || !sLiveChatId) {
        resetCurrentLiveChatData();
        throw new Error('Chat without string ID ' + JSON.stringify(chat));
    }
    storage.setItem('twc_liveChatInc_chatId', sLiveChatId);
    idToLiveChatUser = {};
    const users = chat.users;
    if (users) {
        let n = users.length;
        while (--n >= 0) {
            idToLiveChatUser[users[n].id] = users[n];
        }
    }
};


const assignAvailability = payload => {
    switch (payload.availability) {
        case 'online':
            displaySystemMessage('Live chat is available');
            break;
        case 'offline':
            displaySystemMessage('Live chat is offline');
            break;
        default:
            logger.warn('Unknown availability', payload.availability);
    }
};


const processLiveChatEvent = ({ chatId, event }) => {
    if (liveChatStopper !== LC_STOPPER_NONE) return;
    if (chatId !== sLiveChatId) {
        logger.error('[processLiveChatEvent] unknown chatId', chatId, 'for sLiveChatId', sLiveChatId);
        return;
    }
    if (event.type !== 'message') {
        logger.info('[processLiveChatEvent] unprocessed event type', event.type);
        return;
    }
    hideTypingIndicator();
    const user = idToLiveChatUser.hasOwnProperty(event.authorId) ? idToLiveChatUser[event.authorId] : null;
    if (user) displayAgentMessage(event.text, user.name, user.avatar);
    else displayAgentMessage(event.text);
};


const prepareForLiveChat = chat => {
    if (liveChatStopper !== LC_STOPPER_NONE) return;
    enableUserInput();
    let events;
    if (chat.thread) {
        if (chat.thread.queue) {
            logger.log('[prepareForLiveChat] chat.thread.queue', chat.thread.queue);
            displaySystemMessage('You will be handed over to an agent. You are placed in the chat queue with position ' + chat.thread.queue.position + ' and estimated waiting time ' + chat.thread.queue.waitTime + ' seconds.');
            return;
        }
        events = chat.thread.events;
    }
    resetLastQueuePosition();
    displaySystemMessage('Live chat has started');
    let nNamedAgents = 0, nUnnamedAgents = 0;
    if (chat.users) {
        chat.users.forEach(user => {
            if (user.type === 'agent') {
                if (user.name) {
                    displaySystemMessage(`You are talking with ${user.name}`);
                    nNamedAgents++;
                } else {
                    nUnnamedAgents++;
                }
            }
        });
    }
    logger.log('[prepareForLiveChat] nNamedAgents', nNamedAgents, 'nUnnamedAgents', nUnnamedAgents);
    if (nNamedAgents === 0) {
        displaySystemMessage(nUnnamedAgents === 0 ? 'You are in a live chat' : 'You are in a live chat talking to an agent');
    }
    if (events) events.forEach(event => processLiveChatEvent({ chatId: chat.id, event: event }));
};


customerSDK.on('connected', payload => {
    if (liveChatStopper !== LC_STOPPER_NONE) return;
    resetCurrentLiveChatData();
    disableUserInput();
    assignAvailability(payload);
    obtainLiveChat(storage.getItem('twc_liveChatInc_chatId')).then(chat => {
        if (liveChatStopper !== LC_STOPPER_NONE) return;
        setCurrentLiveChatData(chat);
        displaySystemMessage('Live chat has connected');
        logger.log('Live chat has connected', chat);
        prepareForLiveChat(chat);
        customerSDK.sendEvent({ chatId: sLiveChatId, event: { type: 'message', text: transcript } }).then(payload => logger.debug("customerSDK.sendEvent::then", payload), error => logger.error("customerSDK.sendEvent::catch", error));
    }, () => {
        if (liveChatStopper !== LC_STOPPER_NONE) return;
        resetCurrentLiveChatData();
        disableUserInput();
        displaySystemMessage('Live chat has failed to connect');
        logger.error('Live chat has failed to connect');
    })
});


customerSDK.on('disconnected', () => {
    // A potential live chat end:
    hideTypingIndicator();
    if (liveChatStopper !== LC_STOPPER_USER) displaySystemMessage('Live chat has been disconnected');
});


customerSDK.on('availability_updated', payload => {
    if (liveChatStopper !== LC_STOPPER_NONE) return;
    assignAvailability(payload);
});


customerSDK.on('user_added_to_chat', ({ chatId, user }) => {
    if (liveChatStopper !== LC_STOPPER_NONE) return;
    if (chatId !== sLiveChatId) {
        logger.error('[user_added_to_chat] unknown chatId', chatId, 'for sLiveChatId', sLiveChatId);
        return;
    }
    logger.info('[user_added_to_chat] chat', chatId, 'adding user', user);
    if (user.name) displaySystemMessage(user.name + ' joined live chat');
    else displaySystemMessage(user.type === 'agent' ? 'An agent joined live chat' : 'A user joined live chat');
    idToLiveChatUser[user.id] = user;
});


customerSDK.on('user_removed_from_chat', ({ chatId, userId }) => {
    if (liveChatStopper !== LC_STOPPER_NONE) return;
    if (chatId !== sLiveChatId) {
        logger.error('[user_removed_from_chat] unknown chatId', chatId, 'for sLiveChatId', sLiveChatId);
        return;
    }
    logger.info('[user_removed_from_chat] chat', chatId, 'removing user', userId);
    const user = idToLiveChatUser.hasOwnProperty(userId) ? idToLiveChatUser[userId] : null;
    delete idToLiveChatUser[userId];
    if (user) {
        if (user.name) displaySystemMessage(user.name + ' left live chat');
        else displaySystemMessage(user.type === 'agent' ? 'An agent left live chat' : 'A user left live chat');
    }
});


customerSDK.on('chat_deactivated', ({ chatId }) => {
    // A potential live chat end:
    // This listener is triggered when the live chat agent closes the chat with
    // this user (sLiveChatId) or when the user closes the frontend (!sLiveChatId).
    if (sLiveChatId && chatId !== sLiveChatId) {
        logger.error('[chat_deactivated] unknown chatId', chatId, 'for sLiveChatId', sLiveChatId);
        return;
    }
    resetCurrentLiveChatData();
    hideTypingIndicator();
    if (liveChatStopper !== LC_STOPPER_USER) {
        liveChatStopper = LC_STOPPER_AGENT;
        displaySystemMessage('Live chat has been deactivated');
        disableUserInput();
    }
    customerSDK.disconnect();
});


customerSDK.on('incoming_event', processLiveChatEvent);


customerSDK.on('queue_position_updated', ({ chatId, queue }) => {
    if (liveChatStopper !== LC_STOPPER_NONE) return;
    if (chatId !== sLiveChatId) {
        logger.error('[queue_position_updated] unknown chatId', chatId, 'for sLiveChatId', sLiveChatId);
        return;
    }
    hideTypingIndicator();
    const n = Number.parseInt(queue.position);
    if (Number.isNaN(n) || nLastQueuePosition === n) return;
    setLastQueuePosition(n);
    displaySystemMessage('Your position in the chat queue: ' + n + ', estimated waiting time: ' + queue.waitTime + ' seconds');
});


customerSDK.on('incoming_typing_indicator', ({ chatId, typingIndicator }) => {
    if (liveChatStopper !== LC_STOPPER_NONE) return;
    if (chatId !== sLiveChatId) {
        logger.error('[incoming_typing_indicator] unknown chatId', chatId, 'for sLiveChatId', sLiveChatId);
        return;
    }
    if (typingIndicator.isTyping) displayTypingIndicator();
    else hideTypingIndicator();
});


customerSDK.on('incoming_chat', ({ chat }) => {
    if (liveChatStopper !== LC_STOPPER_NONE) return;
    setCurrentLiveChatData(chat);
    prepareForLiveChat(chat);
});



// user:
// https://developers.livechat.com/docs/extending-chat-widget/customer-sdk/#customer-user-type
// https://developers.livechat.com/docs/extending-chat-widget/customer-sdk/#agent-user-type



////////////////////////////////////////////////////////////////////////////////////////////////////////




TeneoWebChat.on('engine_response', data => {
    if (sLiveChatId) {
        data.handledState.handled = true;
        return;
    }
    liveChatStopper = LC_STOPPER_NONE;
    let s = data.responseDetails.output.parameters.livechat_handover;
    transcript = data.responseDetails.output.parameters.dialogueTranscript;

    if (s && s.trim().toLowerCase() === 'true') {
        resetCurrentLiveChatData();
        disableUserInput();
        displaySystemMessage('Starting live chat');
        try {
            customerSDK.connect();
        } catch (ex) {
            // This happens if the chat is already connected
            logger.warn('LiveChatInc connect error', ex);
            enableUserInput();
        }
    }
});


TeneoWebChat.on('input_submitted', data => {
    if (sLiveChatId) {
        data.handledState.handled = true;
        const sText = data.text.trim();
        if (sText) {
            displayUserMessage(sText);
            customerSDK.sendEvent({ chatId: sLiveChatId, event: { type: 'message', text: sText } }).then(payload => logger.debug("customerSDK.sendEvent::then", payload), error => logger.error("customerSDK.sendEvent::catch", error));
        }
    }
});


TeneoWebChat.on('user_typing', payload => {
    if (sLiveChatId) {
        customerSDK.setSneakPeek({
            chatId: sLiveChatId,
            sneakPeekText: payload.text,
        });
    }
});


TeneoWebChat.on('ready', () => {
    if (storage.getItem('twc_userInputDisabled') === 'true') setTimeout(() => TeneoWebChat.call('disable_user_input'), 0);
    if (sLiveChatId) customerSDK.connect();
    const x = storage.getItem('twc_last_state');
    if (x) {
        switch (x) {
            case 'maximized':
                TeneoWebChat.call('maximize');
                break;
            case 'minimized':
                TeneoWebChat.call('minimize');
                break;
            default:
                logger.warn('window.TeneoWebChat unknown stored twc_last_state value', x);
        }
    }
});


TeneoWebChat.on('visibility_changed', payload => storage.setItem('twc_last_state', payload.visibility));


TeneoWebChat.on('reset', () => {
    if (sLiveChatId) {
        liveChatStopper = LC_STOPPER_USER;
        const sId = sLiveChatId;
        resetCurrentLiveChatData();
        customerSDK.deactivateChat({ id: sId }).then(payload => {
            logger.debug('[then] Disconnecting upon reset', payload);
            customerSDK.disconnect();
        }).catch(error => {
            logger.debug('[catch] Disconnecting upon reset', error);
            customerSDK.disconnect();
        }).finally(() => {
            logger.debug('[finally] Disconnecting upon reset');
            customerSDK.disconnect();
        });
    }
    storage.removeItem('twc_last_state');
    setTimeout(enableUserInput, 0);
});



// })();

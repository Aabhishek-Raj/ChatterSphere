"use client";

import { io } from "socket.io-client";

export const sockets = io({
    autoConnect: false
});
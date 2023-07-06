import { WebSocket } from 'ws';

type UserMetadata = {
    password: string;
    index: number;
    roomId?: number;
    gameId?: number;
    socket: WebSocket;
};

type UsersInfo = {
    [username: string]: UserMetadata;
};

class UsersDB {
    private _users: UsersInfo = {};

    nextUserIdx: number = 0;

    addUser(username: string, user: UserMetadata): void {
        this._users[username] = user;

        this.nextUserIdx += 1;
    }

    getUserMetadata(username: string): UserMetadata {
        return this._users[username]!;
    }

    isNewUser(username: string): boolean {
        const usernames = Object.keys(this._users);

        return usernames.some((name) => name === username);
    }

    isPasswordValid(username: string, password: string): boolean {
        return this._users[username]?.password === password;
    }

    isUserInRoom(username: string): boolean {
        return this._users[username]?.roomId !== undefined;
    }

    isUserInGame(username: string): boolean {
        return this._users[username]?.gameId !== undefined;
    }
}

export const usersDB = new UsersDB();

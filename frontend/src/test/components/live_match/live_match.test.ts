import {expect, vi} from "vitest";
import {mockLiveTimeRunningMatch, mockScheduledMatch} from "../../../../vitest.setup.tsx";
import {live_match_websocket} from "../../../main/components/live_match/live_match.ts";
import type {Match} from "../../../main/types/match.ts";
import {Client, type Frame, type IFrame} from "@stomp/stompjs";

interface MockMatchUseState {
    match: null | Match
}

interface MockClientUseRef {
    current: null | Client
}

interface MockWebsocketPayload {
    body: Match
}

let mockMatchUseState: MockMatchUseState;

const setMatchMock = vi.fn().mockImplementation((match: Match) => {
    mockMatchUseState.match = match;
});

let mockClientRef: MockClientUseRef;


describe("liveMatch", () => {
    beforeEach(() => {

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockScheduledMatch,
        } as Response);

        vi.mock('@stomp/stompjs', () => {

            class MockClient {
                receive: null | MockWebsocketPayload = null;
                activate = vi.fn();
                deactivate = vi.fn().mockResolvedValue(null);
                subscribe =
                    (_: string, receive: (MockWebsocketPayload)) => {
                        this.receive = receive;
                    }
            }

            class MockFrame {
                headers = {
                    "message": ""
                }
            }

            return {
                Client: MockClient,
                Frame: MockFrame
            };
        });

        JSON.parse = vi.fn().mockImplementation(e => e);

        console.error = vi.fn();

        mockMatchUseState = { match: null }
        mockClientRef = { current: null }
    });

    test("Client for websocket created", () => {
        live_match_websocket(1, setMatchMock, mockClientRef);
        expect(mockClientRef.current).toBeInstanceOf(Client);
    });

    test("Receiving a Match through the web socket", () => {
        live_match_websocket(1, setMatchMock, mockClientRef);

        expect(mockClientRef.current).toBeInstanceOf(Client);
        let client = mockClientRef.current as Client;

        client.onConnect(null as unknown as IFrame);

        const payload: MockWebsocketPayload = {
            body: mockLiveTimeRunningMatch
        }
        // @ts-ignore Shut up!!! client.receive is defined in MockClient which replaces Client
        client.receive(payload);

        expect(mockMatchUseState.match).toBe(mockLiveTimeRunningMatch);
    })

    test("Live Match Websocket Error", () => {
        live_match_websocket(1, setMatchMock, mockClientRef);

        expect(mockClientRef.current).toBeInstanceOf(Client);
        let client = mockClientRef.current as Client;

        // @ts-ignore Frame is mocked
        const mockFrame: Frame = {
            headers: { "message": "Error" }
        }

        client.onStompError(mockFrame);

        expect(console.error).toBeCalled();
    })

    test("Live Match Websocket Deactivate", () => {
        const deactivate = live_match_websocket(1, setMatchMock, mockClientRef);

        expect(mockClientRef.current).toBeInstanceOf(Client);
        let client = mockClientRef.current as Client;

        deactivate();
        expect(client.deactivate).toBeCalled();
    })
});

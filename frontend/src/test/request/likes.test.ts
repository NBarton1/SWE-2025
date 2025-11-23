import {vi, expect} from 'vitest';
import {waitFor} from "@testing-library/react";
import {mockLikeStatus} from "../../../vitest.setup.tsx";
import {
    deleteLike, getCoachLikeStatus,
    getCoachLikeStatusCount, getPostLikeStatus,
    getPostLikeStatusCount,
    likeCoach,
    likePost
} from "../../main/request/likes.ts";


const fail = vi.fn().mockRejectedValue(new Error("fail"));

describe("likes", () => {

    test("likeCoach success", async () => {

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockLikeStatus,
        } as Response);

        const res = await likeCoach(1, true);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/coaches/1/like",
                expect.objectContaining({
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: "true",
                })
            );

            expect(res).toStrictEqual(mockLikeStatus);
        });
    })

    test("likeCoach fail", async () => {

        global.fetch = fail;

        const res = await likeCoach(1, true);

        expect(res).toBeNull()
    })

    test("likePost success", async () => {

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockLikeStatus,
        } as Response);

        const res = await likePost(1, true);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/posts/1/like",
                expect.objectContaining({
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: "true",
                })
            );

            expect(res).toStrictEqual(mockLikeStatus);
        });
    })

    test("likePost fail", async () => {

        global.fetch = fail;

        const res = await likePost(1, true);

        expect(res).toBeNull()
    })

    test("deleteLike success", async () => {

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => null,
        } as Response);

        await deleteLike(1);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/likes/1",
                expect.objectContaining({
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                })
            );
        });
    })

    test("deleteLike fail", async () => {

        global.fetch = fail;

        const res = await deleteLike(1);

        expect(res).toBeNull()
    })

    test("getCoachLikeStatusCount for likes success", async () => {

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => 0,
        } as Response);

        await getCoachLikeStatusCount(1, true);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/coaches/1/likes",
                expect.objectContaining({
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                })
            );
        });
    })

    test("getCoachLikeStatusCount for dislikes success", async () => {

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => 0,
        } as Response);

        await getCoachLikeStatusCount(1, false);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/coaches/1/dislikes",
                expect.objectContaining({
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                })
            );
        });
    })

    test("getCoachLikeStatusCount fail", async () => {

        global.fetch = fail;

        const res = await getCoachLikeStatusCount(1, true);

        expect(res).toBeNull()
    })

    test("getPostLikeStatusCount for likes success", async () => {

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => 0,
        } as Response);

        await getPostLikeStatusCount(1, true);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/posts/1/likes",
                expect.objectContaining({
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                })
            );
        });
    })

    test("getPostLikeStatusCount for dislikes success", async () => {

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => 0,
        } as Response);

        await getPostLikeStatusCount(1, false);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/posts/1/dislikes",
                expect.objectContaining({
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                })
            );
        });
    })

    test("getPostLikeStatusCount fail", async () => {

        global.fetch = fail;

        const res = await getPostLikeStatusCount(1, true);

        expect(res).toBeNull()
    })

    test("getCoachLikeStatus success", async () => {

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockLikeStatus,
        } as Response);

        const res = await getCoachLikeStatus(1);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/coaches/1/like",
                expect.objectContaining({
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                })
            );

            expect(res).toStrictEqual(mockLikeStatus)
        });
    })

    test("getCoachLikeStatus fail", async () => {

        global.fetch = fail;

        const res = await getCoachLikeStatus(1);

        expect(res).toBeNull()
    })

    test("getPostLikeStatus success", async () => {

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockLikeStatus,
        } as Response);

        const res = await getPostLikeStatus(1);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/posts/1/like",
                expect.objectContaining({
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                })
            );

            expect(res).toStrictEqual(mockLikeStatus)
        });
    })

    test("getPostLikeStatus fail", async () => {

        global.fetch = fail;

        const res = await getPostLikeStatus(1);

        expect(res).toBeNull()
    })
});

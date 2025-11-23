import { vi, expect, describe, test, beforeEach } from 'vitest';
import { waitFor } from "@testing-library/react";
import { mockPost } from "../../../vitest.setup.tsx";
import {
    createPost,
    getAllPosts,
    deletePost,
    getChildren,
    getUnapprovedPostsForChildren,
    getFlaggedPosts,
    approve,
    disapprove
} from "../../main/request/posts.ts";

const fail = vi.fn().mockRejectedValue(new Error("fail"));

describe("posts", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("createPost success", async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockPost,
        } as Response);

        const req = {
            textContent: { type: "text" },
            mediaFiles: [],
            parentId: 1
        };

        const res = await createPost(req);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/posts",
                expect.objectContaining({
                    method: "POST",
                    credentials: "include",
                    body: expect.any(FormData)
                })
            );

            expect(res).toStrictEqual(mockPost);
        });
    });

    test("createPost with media files success", async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockPost,
        } as Response);

        const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
        const postRequest = {
            textContent: { type: "text" },
            mediaFiles: [file]
        };

        const res = await createPost(postRequest);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/posts",
                expect.objectContaining({
                    method: "POST",
                    credentials: "include",
                })
            );

            expect(res).toStrictEqual(mockPost);
        });
    });

    test("createPost fail", async () => {
        global.fetch = fail;

        const req = {
            textContent: { type: "doc", content: [] }
        };

        const res = await createPost(req);

        expect(res).toBeNull();
    });

    test("getAllPosts success", async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => [mockPost],
        } as Response);

        const res = await getAllPosts();

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/posts",
                expect.objectContaining({
                    method: "GET",
                    credentials: "include",
                })
            );

            expect(res).toStrictEqual([mockPost]);
        });
    });

    test("getAllPosts fail", async () => {
        global.fetch = fail;

        const res = await getAllPosts();

        expect(res).toStrictEqual([]);
    });

    test("deletePost success", async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
        } as Response);

        const res = await deletePost(1);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/posts/1",
                expect.objectContaining({
                    method: "DELETE",
                    credentials: "include",
                })
            );

            expect(res).toBe(true);
        });
    });

    test("deletePost fail", async () => {
        global.fetch = fail;

        const res = await deletePost(1);

        expect(res).toBe(false);
    });

    test("getChildren success", async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => [mockPost],
        } as Response);

        const res = await getChildren(mockPost);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                `http://localhost:8080/api/posts/${mockPost.id}/children`,
                expect.objectContaining({
                    method: "GET",
                    credentials: "include",
                })
            );

            expect(res).toStrictEqual([mockPost]);
        });
    });

    test("getChildren fail", async () => {
        global.fetch = fail;

        const res = await getChildren(mockPost);

        expect(res).toStrictEqual([]);
    });

    test("getUnapprovedPostsForChildren success", async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ 1: [mockPost] }),
        } as Response);

        const res = await getUnapprovedPostsForChildren();

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/posts/unapproved",
                expect.objectContaining({
                    method: "GET",
                    credentials: "include",
                })
            );

            expect(res).toStrictEqual({ 1: [mockPost] });
        });
    });

    test("getUnapprovedPostsForChildren fail", async () => {
        global.fetch = fail;

        const res = await getUnapprovedPostsForChildren();

        expect(res).toStrictEqual([]);
    });

    test("getFlaggedPosts success", async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => [mockPost],
        } as Response);

        const res = await getFlaggedPosts();

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/posts/flags",
                expect.objectContaining({
                    method: "GET",
                    credentials: "include",
                })
            );

            expect(res).toStrictEqual([mockPost]);
        });
    });

    test("getFlaggedPosts fail", async () => {
        global.fetch = fail;

        const res = await getFlaggedPosts();

        expect(res).toStrictEqual([]);
    });

    test("approve success", async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockPost,
        } as Response);

        const res = await approve(1);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/posts/1/approve",
                expect.objectContaining({
                    method: "PATCH",
                    credentials: "include",
                })
            );

            expect(res).toStrictEqual(mockPost);
        });
    });

    test("approve fail", async () => {
        global.fetch = fail;

        const res = await approve(1);

        expect(res).toBeNull();
    });

    test("disapprove success", async () => {
        const mockResponse = {
            ok: true,
        } as Response;

        global.fetch = vi.fn().mockResolvedValue(mockResponse);

        const res = await disapprove(1);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/posts/1/disapprove",
                expect.objectContaining({
                    method: "DELETE",
                    credentials: "include",
                })
            );

            expect(res).toBe(mockResponse);
        });
    });

    test("disapprove returns response on fail", async () => {
        const mockResponse = {
            ok: false,
        } as Response;

        global.fetch = vi.fn().mockResolvedValue(mockResponse);

        const res = await disapprove(1);

        expect(res).toBe(mockResponse);
    });
});
